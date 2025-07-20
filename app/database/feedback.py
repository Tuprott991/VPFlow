import os
from dotenv import load_dotenv
import psycopg
from psycopg.rows import dict_row
from datetime import datetime
from typing import List, Dict, Optional
from app.database import get_db_connection
from uuid import UUID, uuid4
import json

def init_feedback_table():
    """
    Khởi tạo bảng feedback trong database nếu chưa tồn tại
    Bảng này lưu trữ feedback của người dùng về:
    - Diagrams
    - Pain points
    - Chatbot responses
    - Tổng quan hệ thống
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Enable UUID extension if not exists
            cur.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
            
            # Create table if not exists
            cur.execute("""
                CREATE TABLE IF NOT EXISTS feedback (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID,
                    feedback_type VARCHAR(50) NOT NULL,
                    target_id UUID,
                    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                    comment TEXT,
                    tags JSONB,
                    metadata JSONB,
                    status VARCHAR(50) DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """)
            
            # Create indexes for better performance
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_feedback_user_id 
                ON feedback(user_id)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_feedback_type 
                ON feedback(feedback_type)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_feedback_target_id 
                ON feedback(target_id)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_feedback_rating 
                ON feedback(rating)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_feedback_status 
                ON feedback(status)
            """)
        conn.commit()

def create_feedback(user_id: UUID, feedback_type: str, rating: int, 
                   comment: str = None, target_id: UUID = None, 
                   tags: List[str] = None, metadata: Dict = None) -> Dict:
    """
    Tạo feedback mới
    
    Args:
        user_id (UUID): ID người dùng
        feedback_type (str): Loại feedback (diagram, pain_point, chatbot, system)
        rating (int): Điểm đánh giá (1-5)
        comment (str): Bình luận chi tiết
        target_id (UUID): ID đối tượng được đánh giá (diagram_id, message_id, etc.)
        tags (List[str]): Các tag phân loại
        metadata (Dict): Dữ liệu bổ sung
        
    Returns:
        Dict: Thông tin feedback vừa được tạo
    """
    tags_json = json.dumps(tags) if tags else None
    metadata_json = json.dumps(metadata) if metadata else None
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO feedback (user_id, feedback_type, target_id, rating, comment, tags, metadata) 
                VALUES (%s, %s, %s, %s, %s, %s, %s) 
                RETURNING id::text, user_id::text, feedback_type, target_id::text, 
                         rating, comment, tags, metadata, status, created_at
                """,
                (user_id, feedback_type, target_id, rating, comment, tags_json, metadata_json)
            )
            result = cur.fetchone()
            conn.commit()
    return result

def get_feedback_by_id(feedback_id: UUID) -> Optional[Dict]:
    """
    Lấy feedback theo ID
    
    Args:
        feedback_id (UUID): ID feedback
        
    Returns:
        Dict: Thông tin feedback hoặc None nếu không tìm thấy
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id::text,
                    user_id::text,
                    feedback_type,
                    target_id::text,
                    rating,
                    comment,
                    tags,
                    metadata,
                    status,
                    created_at,
                    updated_at
                FROM feedback 
                WHERE id = %s
                """,
                (feedback_id,)
            )
            return cur.fetchone()

def get_feedback_by_target(target_id: UUID, feedback_type: str = None) -> List[Dict]:
    """
    Lấy tất cả feedback cho một đối tượng cụ thể
    
    Args:
        target_id (UUID): ID đối tượng
        feedback_type (str): Loại feedback (optional)
        
    Returns:
        List[Dict]: Danh sách feedback
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            if feedback_type:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        user_id::text,
                        feedback_type,
                        target_id::text,
                        rating,
                        comment,
                        tags,
                        metadata,
                        status,
                        created_at
                    FROM feedback 
                    WHERE target_id = %s AND feedback_type = %s
                    ORDER BY created_at DESC
                    """,
                    (target_id, feedback_type)
                )
            else:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        user_id::text,
                        feedback_type,
                        target_id::text,
                        rating,
                        comment,
                        tags,
                        metadata,
                        status,
                        created_at
                    FROM feedback 
                    WHERE target_id = %s
                    ORDER BY created_at DESC
                    """,
                    (target_id,)
                )
            return cur.fetchall()

def get_user_feedback(user_id: UUID, feedback_type: str = None, 
                     limit: int = 50, offset: int = 0) -> List[Dict]:
    """
    Lấy tất cả feedback của một người dùng
    
    Args:
        user_id (UUID): ID người dùng
        feedback_type (str): Loại feedback (optional)
        limit (int): Số lượng tối đa
        offset (int): Vị trí bắt đầu
        
    Returns:
        List[Dict]: Danh sách feedback
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            if feedback_type:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        user_id::text,
                        feedback_type,
                        target_id::text,
                        rating,
                        comment,
                        tags,
                        metadata,
                        status,
                        created_at,
                        updated_at
                    FROM feedback 
                    WHERE user_id = %s AND feedback_type = %s
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                    """,
                    (user_id, feedback_type, limit, offset)
                )
            else:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        user_id::text,
                        feedback_type,
                        target_id::text,
                        rating,
                        comment,
                        tags,
                        metadata,
                        status,
                        created_at,
                        updated_at
                    FROM feedback 
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                    """,
                    (user_id, limit, offset)
                )
            return cur.fetchall()

def update_feedback_status(feedback_id: UUID, status: str) -> Optional[Dict]:
    """
    Cập nhật trạng thái feedback
    
    Args:
        feedback_id (UUID): ID feedback
        status (str): Trạng thái mới (pending, reviewed, resolved, dismissed)
        
    Returns:
        Dict: Thông tin feedback đã cập nhật
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE feedback 
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id::text, feedback_type, status, updated_at
                """,
                (status, feedback_id)
            )
            result = cur.fetchone()
            conn.commit()
    return result

def get_feedback_statistics(feedback_type: str = None) -> Dict:
    """
    Lấy thống kê feedback
    
    Args:
        feedback_type (str): Loại feedback để thống kê (optional)
        
    Returns:
        Dict: Thống kê feedback
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            if feedback_type:
                cur.execute(
                    """
                    SELECT 
                        feedback_type,
                        COUNT(*) as total_feedback,
                        AVG(rating::float) as average_rating,
                        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedback,
                        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_feedback,
                        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_feedback,
                        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_feedback
                    FROM feedback 
                    WHERE feedback_type = %s
                    GROUP BY feedback_type
                    """,
                    (feedback_type,)
                )
            else:
                cur.execute(
                    """
                    SELECT 
                        feedback_type,
                        COUNT(*) as total_feedback,
                        AVG(rating::float) as average_rating,
                        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedback,
                        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_feedback,
                        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_feedback,
                        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_feedback
                    FROM feedback 
                    GROUP BY feedback_type
                    ORDER BY total_feedback DESC
                    """
                )
            return cur.fetchall()

def get_pain_point_feedback_summary() -> List[Dict]:
    """
    Lấy tổng hợp feedback về pain points
    
    Returns:
        List[Dict]: Danh sách feedback về pain points với thống kê
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    target_id::text,
                    COUNT(*) as feedback_count,
                    AVG(rating::float) as average_rating,
                    array_agg(DISTINCT comment) FILTER (WHERE comment IS NOT NULL) as comments,
                    array_agg(DISTINCT tags::text) FILTER (WHERE tags IS NOT NULL) as all_tags
                FROM feedback 
                WHERE feedback_type = 'pain_point'
                GROUP BY target_id
                ORDER BY feedback_count DESC, average_rating ASC
                """
            )
            return cur.fetchall()

def search_feedback_by_content(search_term: str, limit: int = 20) -> List[Dict]:
    """
    Tìm kiếm feedback theo nội dung comment
    
    Args:
        search_term (str): Từ khóa tìm kiếm
        limit (int): Số lượng tối đa
        
    Returns:
        List[Dict]: Danh sách feedback phù hợp
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id::text,
                    user_id::text,
                    feedback_type,
                    target_id::text,
                    rating,
                    comment,
                    tags,
                    metadata,
                    status,
                    created_at
                FROM feedback 
                WHERE comment ILIKE %s
                ORDER BY created_at DESC
                LIMIT %s
                """,
                (f'%{search_term}%', limit)
            )
            return cur.fetchall()

def delete_feedback(feedback_id: UUID) -> bool:
    """
    Xóa feedback
    
    Args:
        feedback_id (UUID): ID feedback
        
    Returns:
        bool: True nếu xóa thành công
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM feedback WHERE id = %s", (feedback_id,))
            success = cur.rowcount > 0
            conn.commit()
    return success

# Initialize table when module is imported
init_feedback_table()
