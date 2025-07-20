import os
from dotenv import load_dotenv
import psycopg
from psycopg.rows import dict_row
from datetime import datetime
from typing import List, Dict, Optional
from app.database import get_db_connection
from uuid import UUID, uuid4

def init_user_table():
    """
    Khởi tạo bảng user trong database nếu chưa tồn tại
    Bảng này lưu trữ thông tin người dùng bao gồm:
    - ID người dùng (UUID)
    - Tên người dùng
    - Email
    - Vai trò
    - Thời gian tạo
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Enable UUID extension if not exists
            cur.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
            
            # Create table if not exists
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    username VARCHAR(255) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    role VARCHAR(100) NOT NULL DEFAULT 'user',
                    full_name VARCHAR(255),
                    department VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create index if not exists
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_users_email 
                ON users(email)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_users_role 
                ON users(role)
            """)
        conn.commit()

def create_user(username: str, email: str, role: str = 'user', full_name: str = None, department: str = None) -> Dict:
    """
    Tạo người dùng mới
    
    Args:
        username (str): Tên đăng nhập
        email (str): Email người dùng
        role (str): Vai trò (user, admin, manager)
        full_name (str): Tên đầy đủ
        department (str): Phòng ban
        
    Returns:
        Dict: Thông tin người dùng vừa được tạo
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (username, email, role, full_name, department) 
                VALUES (%s, %s, %s, %s, %s) 
                RETURNING id::text, username, email, role, full_name, department, created_at
                """,
                (username, email, role, full_name, department)
            )
            result = cur.fetchone()
            conn.commit()
    return result

def get_user_by_id(user_id: UUID) -> Optional[Dict]:
    """
    Lấy thông tin người dùng theo ID
    
    Args:
        user_id (UUID): ID người dùng
        
    Returns:
        Dict: Thông tin người dùng hoặc None nếu không tìm thấy
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id::text,
                    username,
                    email,
                    role,
                    full_name,
                    department,
                    created_at,
                    updated_at
                FROM users 
                WHERE id = %s
                """,
                (user_id,)
            )
            return cur.fetchone()

def get_user_by_email(email: str) -> Optional[Dict]:
    """
    Lấy thông tin người dùng theo email
    
    Args:
        email (str): Email người dùng
        
    Returns:
        Dict: Thông tin người dùng hoặc None nếu không tìm thấy
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    id::text,
                    username,
                    email,
                    role,
                    full_name,
                    department,
                    created_at,
                    updated_at
                FROM users 
                WHERE email = %s
                """,
                (email,)
            )
            return cur.fetchone()

def update_user(user_id: UUID, **kwargs) -> Optional[Dict]:
    """
    Cập nhật thông tin người dùng
    
    Args:
        user_id (UUID): ID người dùng
        **kwargs: Các trường cần cập nhật
        
    Returns:
        Dict: Thông tin người dùng đã cập nhật
    """
    if not kwargs:
        return None
        
    # Build SET clause dynamically
    set_clauses = []
    values = []
    
    for key, value in kwargs.items():
        if key in ['username', 'email', 'role', 'full_name', 'department']:
            set_clauses.append(f"{key} = %s")
            values.append(value)
    
    if not set_clauses:
        return None
    
    set_clauses.append("updated_at = CURRENT_TIMESTAMP")
    values.append(user_id)
    
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            query = f"""
                UPDATE users 
                SET {', '.join(set_clauses)}
                WHERE id = %s
                RETURNING id::text, username, email, role, full_name, department, created_at, updated_at
            """
            cur.execute(query, values)
            result = cur.fetchone()
            conn.commit()
    return result

def list_users(role: str = None, limit: int = 50, offset: int = 0) -> List[Dict]:
    """
    Lấy danh sách người dùng
    
    Args:
        role (str): Lọc theo vai trò (optional)
        limit (int): Số lượng tối đa
        offset (int): Vị trí bắt đầu
        
    Returns:
        List[Dict]: Danh sách người dùng
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            if role:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        username,
                        email,
                        role,
                        full_name,
                        department,
                        created_at,
                        updated_at
                    FROM users 
                    WHERE role = %s
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                    """,
                    (role, limit, offset)
                )
            else:
                cur.execute(
                    """
                    SELECT 
                        id::text,
                        username,
                        email,
                        role,
                        full_name,
                        department,
                        created_at,
                        updated_at
                    FROM users 
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                    """,
                    (limit, offset)
                )
            return cur.fetchall()

def delete_user(user_id: UUID) -> bool:
    """
    Xóa người dùng
    
    Args:
        user_id (UUID): ID người dùng
        
    Returns:
        bool: True nếu xóa thành công
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
            success = cur.rowcount > 0
            conn.commit()
    return success

# Initialize table when module is imported
init_user_table()
