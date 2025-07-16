import csv
import os
import logging
from glob import glob

# === CẤU HÌNH ===
OUTPUT_FOLDER  ="../outputs/2-mb01bgiy--ngh-kim-h-m-v-s-dng-tktt-chung-khdn"
TEXT_CSV_PATH = f"{OUTPUT_FOLDER}/text-detection.csv"
TABLE_FOLDER = f"{OUTPUT_FOLDER}/."  # Hoặc thư mục chứa các file table_*.csv
OUTPUT_CSV = f"{OUTPUT_FOLDER}/text-detection.converted.csv"
LOG_FILE = f"{OUTPUT_FOLDER}/process_table_merge.log"

# === SETUP LOGGING ===
logging.basicConfig(
    filename=LOG_FILE,
    filemode='w',
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
)
logger = logging.getLogger(__name__)

logger.info("🚀 Bắt đầu xử lý text-detection.csv và gắn type TABLEXXX theo các bảng.")

# === ĐỌC TOÀN BỘ BẢNG VÀ GÁN NHÃN ===
tables = {}  # key: TABLE001, TABLE002, ... | value: set of text values
table_files = sorted(glob(os.path.join(TABLE_FOLDER, "table_*.csv")))

for idx, file_path in enumerate(table_files, start=1):
    label = f"TABLE{idx:03d}"
    tables[label] = set()

    logger.info("📄 Đọc %s thành %s", file_path, label)
    with open(file_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            for cell in row:
                text = cell.strip()
                if text:
                    tables[label].add(text)

# === ĐỌC TEXT FILE VÀ ÁNH XẠ ===
output_rows = []

with open(TEXT_CSV_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        text = row["Text"].strip()
        original_type = row["Type"]
        matched = False

        for label, value_set in tables.items():
            if text in value_set:
                row["Type"] = label
                matched = True
                logger.info("🟡 Text '%s' gán vào bảng %s", text, label)
                break

        if not matched:
            logger.debug("⚪ Không tìm thấy bảng phù hợp cho: %s", text)

        output_rows.append(row)

# === GHI FILE MỚI ===
with open(OUTPUT_CSV, "w", newline='', encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["Page Number", "Type", "Text", "Confidence Score % (Line)"])
    writer.writeheader()
    writer.writerows(output_rows)

logger.info("✅ Hoàn tất. Đã ghi file: %s", OUTPUT_CSV)
print(f"✅ DONE. Converted file saved to: {OUTPUT_CSV}")
