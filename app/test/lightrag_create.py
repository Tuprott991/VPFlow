import os
import asyncio
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete, gpt_4o_complete, openai_embed
from lightrag.kg.shared_storage import initialize_pipeline_status
from lightrag.utils import setup_logger

setup_logger("lightrag", level="INFO")

WORKING_DIR = "./lightrag_dir"
if not os.path.exists(WORKING_DIR):
    os.mkdir(WORKING_DIR)

async def initialize_rag():
    rag = LightRAG(
        working_dir=WORKING_DIR,
        embedding_func=openai_embed,
        llm_model_func=gpt_4o_mini_complete,
    )
    # IMPORTANT: Both initialization calls are required!
    await rag.initialize_storages()  # Initialize storage backends
    await initialize_pipeline_status()  # Initialize processing pipeline
    rag.chunk_entity_relation_graph.embedding_func = rag.embedding_func
    return rag

async def main():
    try:
        # Initialize RAG instance
        rag = await initialize_rag()

        # Read md file as f
        with open("vpflow.md", "r", encoding="utf-8") as f:
            text = f.read()

        await rag.ainsert(text, ids="vpflow_softai_doc")

        # # Perform hybrid search
        # mode = "hybrid"
        # print(
        #   await rag.query(
        #       "What are the top themes in this story?",
        #       param=QueryParam(mode=mode)
        #   )
        # )

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if rag:
            await rag.finalize_storages()

if __name__ == "__main__":
    asyncio.run(main())