import boto3
import os
import random
import time
import json
import csv
import logging
from datetime import datetime

AWS_PROFILE = 'vpbank'
BUCKET_NAME = 'vpbank-documents'
LOCAL_FILE_PATH = r'C:/Users/Xuan Thanh/Desktop/VPBANK/documents/MB Doanh Nghiệp (chung cho vừa & nhỏ & lớn)/2-mb01bgiy--ngh-kim-h-m-v-s-dng-tktt-chung-khdn.pdf'

filename_only = os.path.basename(LOCAL_FILE_PATH)
output_folder = os.path.join("../outputs", os.path.splitext(filename_only)[0])
os.makedirs(output_folder, exist_ok=True)

log_path = os.path.join(output_folder, "process.log")
logging.basicConfig(
    filename=log_path,
    filemode='w',
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(__name__)

logger.info("Start Textract processing for: %s", filename_only)

session = boto3.Session(profile_name=AWS_PROFILE)
s3 = session.resource("s3")
s3_key = f"uploads/{filename_only}"

try:
    logger.info("Uploading %s to S3 bucket %s at key %s", filename_only, BUCKET_NAME, s3_key)
    s3.Bucket(BUCKET_NAME).upload_file(LOCAL_FILE_PATH, s3_key)
    logger.info("Upload complete.")
except Exception as e:
    logger.error("Upload failed: %s", e)
    raise

client = session.client("textract")
token = str(random.randint(1, int(1e10)))
try:
    response = client.start_document_text_detection(
        DocumentLocation={"S3Object": {"Bucket": BUCKET_NAME, "Name": s3_key}},
        ClientRequestToken=token,
    )
    job_id = response["JobId"]
    logger.info("Textract job started. JobId: %s", job_id)
except Exception as e:
    logger.error("Failed to start Textract job: %s", e)
    raise

logger.info("Waiting for Textract job to complete...")

while True:
    job_result = client.get_document_text_detection(JobId=job_id)
    job_status = job_result["JobStatus"]
    if job_status in ["SUCCEEDED", "FAILED"]:
        break
    logger.info("Job status: %s. Sleeping 5s...", job_status)
    time.sleep(5)

if job_status != "SUCCEEDED":
    logger.error("Textract job failed.")
    exit(1)

all_blocks = []
next_token = None

while True:
    if next_token:
        response = client.get_document_text_detection(JobId=job_id, NextToken=next_token)
    else:
        response = client.get_document_text_detection(JobId=job_id)

    all_blocks.extend(response['Blocks'])
    next_token = response.get('NextToken')

    if not next_token:
        break

logger.info("Got all blocks: %d", len(all_blocks))

json_path = os.path.join(output_folder, "text-detection.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump({"Blocks": all_blocks}, f, indent=2, ensure_ascii=False)
logger.info("Saved full raw Textract JSON to %s", json_path)

line_blocks = [b for b in all_blocks if b["BlockType"] == "LINE"]

csv_path = os.path.join(output_folder, "text-detection.csv")
with open(csv_path, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Page Number", "Type", "Text", "Confidence Score % (Line)"])
    for block in line_blocks:
        page = block.get("Page", 1)
        text = block.get("Text", "")
        conf = round(block.get("Confidence", 0), 2)
        writer.writerow([page, "LINE", text, f"{conf}%"])

logger.info("Extracted %d lines to CSV: %s", len(line_blocks), csv_path)
# logger.info("✅ Processing complete.")
# print(f"✅ DONE. Output saved to: {output_folder}")

try:
    response = client.start_document_analysis(
        DocumentLocation={"S3Object": {"Bucket": BUCKET_NAME, "Name": s3_key}},
        FeatureTypes=["TABLES", "FORMS"],
        ClientRequestToken=token,
    )
    job_id = response["JobId"]
    logger.info("Textract ANALYZE job started. JobId: %s", job_id)
except Exception as e:
    logger.error("Failed to start Textract ANALYZE job: %s", e)
    raise

# Poll cho đến khi hoàn thành
while True:
    job_result = client.get_document_analysis(JobId=job_id)
    job_status = job_result["JobStatus"]
    if job_status in ["SUCCEEDED", "FAILED"]:
        break
    logger.info("Job status: %s. Sleeping 5s...", job_status)
    time.sleep(5)

if job_status != "SUCCEEDED":
    logger.error("Textract ANALYZE job failed.")
    exit(1)

all_blocks = []
next_token = None

while True:
    if next_token:
        response = client.get_document_analysis(JobId=job_id, NextToken=next_token)
    else:
        response = client.get_document_analysis(JobId=job_id)

    all_blocks.extend(response["Blocks"])
    next_token = response.get("NextToken")

    if not next_token:
        break

logger.info("Got %d blocks from analysis.", len(all_blocks))
json_path = os.path.join(output_folder, "document-analysis.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump({"Blocks": all_blocks}, f, indent=2, ensure_ascii=False)
logger.info("Saved analyze raw JSON to %s", json_path)

def get_kv_map(blocks):
    key_map = {}
    value_map = {}
    block_map = {}
    for block in blocks:
        block_map[block["Id"]] = block
        if block["BlockType"] == "KEY_VALUE_SET":
            if "KEY" in block.get("EntityTypes", []):
                key_map[block["Id"]] = block
            else:
                value_map[block["Id"]] = block
    return key_map, value_map, block_map

def get_text(block, block_map):
    text = ""
    for rel in block.get("Relationships", []):
        if rel["Type"] == "CHILD":
            for child_id in rel["Ids"]:
                word = block_map[child_id]
                if word["BlockType"] == "WORD":
                    text += word["Text"] + " "
                elif word["BlockType"] == "SELECTION_ELEMENT":
                    if word["SelectionStatus"] == "SELECTED":
                        text += "X "
    return text.strip()

def find_value_block(key_block, value_map):
    for rel in key_block.get("Relationships", []):
        if rel["Type"] == "VALUE":
            for value_id in rel["Ids"]:
                return value_map.get(value_id)
    return None

def extract_kv_pairs(blocks):
    key_map, value_map, block_map = get_kv_map(blocks)
    kvs = []
    for key_id, key_block in key_map.items():
        value_block = find_value_block(key_block, value_map)
        key = get_text(key_block, block_map)
        value = get_text(value_block, block_map) if value_block else ""
        kvs.append((key, value))
    return kvs

form_csv_path = os.path.join(output_folder, "forms.csv")
kvs = extract_kv_pairs(all_blocks)

with open(form_csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Key", "Value"])
    for key, value in kvs:
        writer.writerow([key, value])
logger.info("Extracted %d form key-value pairs to %s", len(kvs), form_csv_path)

def extract_tables(blocks):
    block_map = {b["Id"]: b for b in blocks}
    tables = []
    for block in blocks:
        if block["BlockType"] == "TABLE":
            rows = {}
            for rel in block.get("Relationships", []):
                if rel["Type"] == "CHILD":
                    for cell_id in rel["Ids"]:
                        cell = block_map[cell_id]
                        row = cell["RowIndex"]
                        col = cell["ColumnIndex"]
                        text = get_text(cell, block_map)
                        rows.setdefault(row, {})[col] = text
            tables.append(rows)
    return tables

tables = extract_tables(all_blocks)
for i, table in enumerate(tables):
    table_csv_path = os.path.join(output_folder, f"table_{i+1}.csv")
    with open(table_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        max_col = max(max(row.keys()) for row in table.values())
        for r in sorted(table.keys()):
            row_data = [table[r].get(c, "") for c in range(1, max_col + 1)]
            writer.writerow(row_data)
    logger.info("Extracted table %d to %s", i + 1, table_csv_path)

logger.info("✅ All analysis complete. Output folder: %s", output_folder)
print(f"✅ DONE. All outputs saved to: {output_folder}")
