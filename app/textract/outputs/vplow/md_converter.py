import os
import json

output_folder = "."  # Đặt đúng thư mục chứa document-analysis.json

with open(os.path.join(output_folder, "document-analysis.json"), encoding="utf-8") as f:
    blocks = json.load(f)["Blocks"]

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

def extract_table_cell_ids(blocks):
    # Lấy tất cả cell id thuộc TABLE để loại khỏi paragraph
    table_cell_ids = set()
    block_map = {b["Id"]: b for b in blocks if "Id" in b}
    for block in blocks:
        if block.get("BlockType") == "TABLE":
            for rel in block.get("Relationships", []):
                if rel["Type"] == "CHILD":
                    for cell_id in rel["Ids"]:
                        table_cell_ids.add(cell_id)
    return table_cell_ids

def extract_lines_not_in_table(blocks, table_cell_ids):
    # Trả về list các tuple (page, top, left, text) cho LINE không thuộc TABLE
    lines = []
    for b in blocks:
        if b.get("BlockType") == "LINE":
            # Nếu LINE có quan hệ PARENT là CELL thì bỏ qua
            is_in_table = False
            for rel in b.get("Relationships", []):
                if rel["Type"] == "CHILD":
                    for child_id in rel["Ids"]:
                        if child_id in table_cell_ids:
                            is_in_table = True
            if not is_in_table:
                text = b.get("Text", "")
                page = b.get("Page", 1)
                bbox = b.get("Geometry", {}).get("BoundingBox", {})
                top = bbox.get("Top", 0)
                left = bbox.get("Left", 0)
                lines.append((page, top, left, text))
    lines.sort()
    return lines

def group_paragraphs(lines, line_gap=0.02):
    paragraphs = []
    current_para = []
    prev_page, prev_top = None, None
    for page, top, left, text in lines:
        if not text.strip():
            if current_para:
                paragraphs.append(" ".join(current_para))
                current_para = []
            continue
        if prev_page is not None and (page != prev_page or abs(top - prev_top) > line_gap):
            if current_para:
                paragraphs.append(" ".join(current_para))
                current_para = []
        current_para.append(text.strip())
        prev_page, prev_top = page, top
    if current_para:
        paragraphs.append(" ".join(current_para))
    return paragraphs

def extract_tables(blocks):
    block_map = {b["Id"]: b for b in blocks if "Id" in b}
    tables = []
    for block in blocks:
        if block.get("BlockType") == "TABLE":
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

def table_to_html(table):
    max_col = max(max(row.keys()) for row in table.values())
    html = "<table>"
    for r in sorted(table.keys()):
        html += "<tr>"
        for c in range(1, max_col + 1):
            html += f"<td>{table[r].get(c, '')}</td>"
        html += "</tr>"
    html += "</table>"
    return html

def extract_kv_pairs(blocks):
    block_map = {b["Id"]: b for b in blocks if "Id" in b}
    key_map = {}
    value_map = {}
    for block in blocks:
        if block.get("BlockType") == "KEY_VALUE_SET":
            if "KEY" in block.get("EntityTypes", []):
                key_map[block["Id"]] = block
            else:
                value_map[block["Id"]] = block
    kvs = []
    for key_id, key_block in key_map.items():
        value_block = None
        for rel in key_block.get("Relationships", []):
            if rel["Type"] == "VALUE":
                for value_id in rel["Ids"]:
                    value_block = value_map.get(value_id)
        key = get_text(key_block, block_map)
        value = get_text(value_block, block_map) if value_block else ""
        kvs.append((key, value))
    return kvs

# --- MAIN FLOW ---

table_cell_ids = extract_table_cell_ids(blocks)
lines = extract_lines_not_in_table(blocks, table_cell_ids)
paragraphs = group_paragraphs(lines)
tables = extract_tables(blocks)
kvs = extract_kv_pairs(blocks)

with open(os.path.join(output_folder, "proposal.md"), "w", encoding="utf-8") as f:
    f.write("# VPBank Technology Hackathon 2025\n\n")
    if paragraphs:
        f.write("## Nội dung văn bản (Paragraph)\n\n")
        for para in paragraphs:
            f.write(para + "\n\n")
    if kvs:
        f.write("## Extracted Key-Value Pairs (Forms)\n\n")
        f.write("| Key | Value |\n| --- | --- |\n")
        for key, value in kvs:
            f.write(f"| {key} | {value} |\n")
        f.write("\n")
    if tables:
        for i, table in enumerate(tables):
            f.write(f"## Table {i+1}\n\n")
            f.write(table_to_html(table) + "\n\n")

print("✅ proposal.md generated at:", os.path.join(output_folder, "proposal.md"))