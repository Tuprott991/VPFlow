import os
import json

output_folder = "."
with open(os.path.join(output_folder, "document-analysis.json"), encoding="utf-8") as f:
    blocks = json.load(f)["Blocks"]

block_map = {b["Id"]: b for b in blocks if "Id" in b}

def get_text(block, block_map):
    text = ""
    for rel in block.get("Relationships", []):
        if rel["Type"] == "CHILD":
            for child_id in rel["Ids"]:
                word = block_map.get(child_id)
                if not word:
                    continue
                if word["BlockType"] == "WORD":
                    text += word["Text"] + " "
                elif word["BlockType"] == "SELECTION_ELEMENT":
                    if word.get("SelectionStatus") == "SELECTED":
                        text += "X "
    return text.strip()

def extract_table(block, block_map):
    rows = {}
    for rel in block.get("Relationships", []):
        if rel["Type"] == "CHILD":
            for cell_id in rel["Ids"]:
                cell = block_map.get(cell_id)
                if cell and cell["BlockType"] == "CELL":
                    row = cell["RowIndex"]
                    col = cell["ColumnIndex"]
                    text = get_text(cell, block_map)
                    rows.setdefault(row, {})[col] = text
    return rows

def table_to_html(table):
    max_col = max(max(row.keys()) for row in table.values())
    html = "<table border='1'>\n"
    for r in sorted(table.keys()):
        html += "  <tr>\n"
        for c in range(1, max_col + 1):
            html += f"    <td>{table[r].get(c, '')}</td>\n"
        html += "  </tr>\n"
    html += "</table>"
    return html

def extract_kv_pairs(block, block_map):
    value_block = None
    key_text = get_text(block, block_map)
    for rel in block.get("Relationships", []):
        if rel["Type"] == "VALUE":
            for value_id in rel["Ids"]:
                value_block = block_map.get(value_id)
    value_text = get_text(value_block, block_map) if value_block else ""
    return key_text, value_text

def get_all_child_ids(block, block_map):
    all_ids = set()
    to_process = list(block.get("Relationships", []))
    while to_process:
        rel = to_process.pop()
        if rel["Type"] == "CHILD":
            for cid in rel["Ids"]:
                all_ids.add(cid)
                child = block_map.get(cid)
                if child and "Relationships" in child:
                    to_process.extend(child["Relationships"])
    return all_ids


def get_all_word_ids_in_cells(blocks, block_map):
    word_ids_in_cells = set()
    for block in blocks:
        if block.get("BlockType") == "TABLE":
            for rel in block.get("Relationships", []):
                if rel["Type"] == "CHILD":
                    for cell_id in rel["Ids"]:
                        cell_block = block_map.get(cell_id)
                        if cell_block and cell_block.get("BlockType") == "CELL":
                            for cell_rel in cell_block.get("Relationships", []):
                                if cell_rel["Type"] == "CHILD":
                                    word_ids_in_cells.update(cell_rel["Ids"])
    return word_ids_in_cells


def is_line_in_table(line_block, word_ids_in_cells):
    for rel in line_block.get("Relationships", []):
        if rel["Type"] == "CHILD":
            for wid in rel["Ids"]:
                if wid in word_ids_in_cells:
                    return True
    return False

word_ids_in_table_cells = get_all_word_ids_in_cells(blocks, block_map)

with open(os.path.join(output_folder, "proposal.md"), "w", encoding="utf-8") as f:
    f.write("# VPBank Technology Hackathon 2025\n")

    for block in blocks:
        btype = block.get("BlockType")

        if btype == "LINE":
            if not is_line_in_table(block, word_ids_in_table_cells):
                text = block.get("Text", "").strip()
                if text:
                    f.write(text + "\n")

        elif btype == "TABLE":
            table_data = extract_table(block, block_map)
            html = table_to_html(table_data)
            f.write(html + "\n\n")

        elif btype == "KEY_VALUE_SET" and "KEY" in block.get("EntityTypes", []):
            key, value = extract_kv_pairs(block, block_map)
            f.write(f"**{key}**: {value}\n\n")

