"""
VPFlow Database Module

This module provides database operations for the VPFlow application including:
- User management
- Diagram/Workflow storage and retrieval  
- Chat history tracking
- Feedback collection and analysis

All database operations use PostgreSQL with proper connection pooling and error handling.
"""

import os
import psycopg
from psycopg.rows import dict_row
from contextlib import contextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    """
    Get database connection using environment variables
    
    Returns:
        psycopg.Connection: Database connection with dict_row factory
    """
    return psycopg.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "vpflow"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        row_factory=dict_row
    )

@contextmanager
def get_db_cursor():
    """
    Context manager for database cursor operations
    
    Yields:
        psycopg.Cursor: Database cursor with automatic commit/rollback
    """
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                yield cur
    finally:
        conn.close()

# Import all database modules to initialize tables
from . import chat_history
from . import user
from . import diagram  
from . import feedback

__all__ = [
    'get_db_connection',
    'get_db_cursor',
    'chat_history',
    'user', 
    'diagram',
    'feedback'
]
