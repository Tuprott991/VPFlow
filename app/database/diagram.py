import os
from dotenv import load_dotenv
import psycopg
from psycopg.rows import dict_row
from datetime import datetime
from typing import List, Dict, Optional, Any
from app.database import get_db_connection
from uuid import UUID, uuid4
import json

def init_diagram_table():
    """
    Khởi tạo bảng diagram trong database nếu chưa tồn tại
    Bảng này lưu trữ thông tin workflow diagram bao gồm:
    - ID diagram (UUID)
    - Tên quy trình
    - Phiên bản
    - Dữ liệu JSON của workflow
    - Thông tin pain points
    - Metrics và phân tích
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Enable UUID extension if not exists
            cur.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
            
            # Create table if not exists
            cur.execute("""
                CREATE TABLE IF NOT EXISTS diagrams (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    process_name VARCHAR(500) NOT NULL,
                    version VARCHAR(100),
                    created_date DATE,
                    workflow_data JSONB NOT NULL,
                    pain_points JSONB,
                    metrics JSONB,
                    user_id UUID,
                    status VARCHAR(50) DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """)
            
            # Create indexes for better performance
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_diagrams_process_name 
                ON diagrams(process_name)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_diagrams_user_id 
                ON diagrams(user_id)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_diagrams_status 
                ON diagrams(status)
            """)
            # GIN index for JSONB columns for fast JSON queries
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_diagrams_workflow_data 
                ON diagrams USING GIN (workflow_data)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_diagrams_pain_points 
                ON diagrams USING GIN (pain_points)
            """)
        conn.commit()

def create_diagram(process_name: str, version: str, workflow_data: Dict, 
                  user_id: UUID = None, created_date: str = None) -> Dict:
    """
    Tạo diagram mới
    
    Args:
        process_name (str): Tên quy trình
        version (str): Phiên bản
        workflow_data (Dict): Dữ liệu JSON workflow
        user_id (UUID): ID người tạo
        created_date (str): Ngày tạo
        
    Returns:
        Dict: Thông tin diagram vừa được tạo
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO diagrams (process_name, version, created_date, workflow_data, user_id) 
                VALUES (%s, %s, %s, %s, %s) 
                RETURNING id::text, process_name, version, created_date, workflow_data, 
                         pain_points, metrics, user_id::text, status, created_at
                """,
                (process_name, version, created_date, json.dumps(workflow_data), user_id)
            )
            result = cur.fetchone()
            conn.commit()
    return result

def get_diagram_by_id(diagram_id: UUID) -> Optional[Dict]:
    """
    Lấy diagram theo ID
    
    Args:
        diagram_id (UUID): ID diagram
        
    Returns:
        Dict: Thông tin diagram hoặc None nếu không tìm thấy
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id::text,
                    process_name,
                    version,
                    created_date,
                    workflow_data,
                    pain_points,
                    metrics,
                    user_id::text,
                    status,
                    created_at,
                    updated_at
                FROM diagrams 
                WHERE id = %s
                """,
                (diagram_id,)
            )
            return cur.fetchone()

def list_diagrams(user_id: UUID = None, status: str = 'active', 
                 limit: int = 50, offset: int = 0) -> List[Dict]:
    """
    Lấy danh sách diagrams
    
    Args:
        user_id (UUID): Lọc theo người tạo (optional)
        status (str): Lọc theo trạng thái
        limit (int): Số lượng tối đa
        offset (int): Vị trí bắt đầu
        
    Returns:
        List[Dict]: Danh sách diagrams
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            if user_id:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        process_name,
                        version,
                        created_date,
                        workflow_data,
                        pain_points,
                        metrics,
                        user_id::text,
                        status,
                        created_at,
                        updated_at
                    FROM diagrams 
                    WHERE user_id = %s AND status = %s
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                    """,
                    (user_id, status, limit, offset)
                )
            else:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        process_name,
                        version,
                        created_date,
                        workflow_data,
                        pain_points,
                        metrics,
                        user_id::text,
                        status,
                        created_at,
                        updated_at
                    FROM diagrams 
                    WHERE status = %s
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                    """,
                    (status, limit, offset)
                )
            return cur.fetchall()

def update_pain_points(diagram_id: UUID, pain_points: List[Dict]) -> Optional[Dict]:
    """
    Cập nhật pain points cho diagram
    
    Args:
        diagram_id (UUID): ID diagram
        pain_points (List[Dict]): Danh sách pain points
        
    Returns:
        Dict: Thông tin diagram đã cập nhật
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE diagrams 
                SET pain_points = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id::text, process_name, version, pain_points, updated_at
                """,
                (json.dumps(pain_points), diagram_id)
            )
            result = cur.fetchone()
            conn.commit()
    return result

def update_metrics(diagram_id: UUID, metrics: Dict) -> Optional[Dict]:
    """
    Cập nhật metrics cho diagram
    
    Args:
        diagram_id (UUID): ID diagram
        metrics (Dict): Thông tin metrics
        
    Returns:
        Dict: Thông tin diagram đã cập nhật
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE diagrams 
                SET metrics = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id::text, process_name, version, metrics, updated_at
                """,
                (json.dumps(metrics), diagram_id)
            )
            result = cur.fetchone()
            conn.commit()
    return result

def search_diagrams_by_content(search_term: str, limit: int = 20) -> List[Dict]:
    """
    Tìm kiếm diagrams theo nội dung
    
    Args:
        search_term (str): Từ khóa tìm kiếm
        limit (int): Số lượng tối đa
        
    Returns:
        List[Dict]: Danh sách diagrams phù hợp
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id::text,
                    process_name,
                    version,
                    created_date,
                    workflow_data,
                    pain_points,
                    metrics,
                    user_id::text,
                    status,
                    created_at,
                    updated_at
                FROM diagrams 
                WHERE 
                    process_name ILIKE %s 
                    OR workflow_data::text ILIKE %s
                    AND status = 'active'
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (f'%{search_term}%', f'%{search_term}%', limit)
            )
            return cur.fetchall()

def get_diagrams_with_pain_points() -> List[Dict]:
    """
    Lấy tất cả diagrams có pain points
    
    Returns:
        List[Dict]: Danh sách diagrams có pain points
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id::text,
                    process_name,
                    version,
                    workflow_data,
                    pain_points,
                    metrics,
                    created_at
                FROM diagrams 
                WHERE pain_points IS NOT NULL 
                AND pain_points != 'null'::jsonb
                AND status = 'active'
                ORDER BY created_at DESC
                """
            )
            return cur.fetchall()

def delete_diagram(diagram_id: UUID) -> bool:
    """
    Xóa diagram (soft delete - chuyển status thành 'deleted')
    
    Args:
        diagram_id (UUID): ID diagram
        
    Returns:
        bool: True nếu xóa thành công
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE diagrams 
                SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                """, 
                (diagram_id,)
            )
            success = cur.rowcount > 0
            conn.commit()
    return success

def get_diagram_statistics() -> Dict:
    """
    Lấy thống kê về diagrams
    
    Returns:
        Dict: Thống kê tổng quan
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    COUNT(*) as total_diagrams,
                    COUNT(CASE WHEN pain_points IS NOT NULL THEN 1 END) as diagrams_with_pain_points,
                    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_diagrams,
                    COUNT(DISTINCT user_id) as unique_users
                FROM diagrams
                """
            )
            return cur.fetchone()

# Initialize table when module is imported
init_diagram_table()
