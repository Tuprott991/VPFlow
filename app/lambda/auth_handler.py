"""
Lambda function for handling user authentication
Supports login, registration, and JWT token management for VPFlow
"""

import json
import boto3
import os
import hashlib
import hmac
import base64
import jwt
import uuid
from datetime import datetime, timedelta
from botocore.exceptions import ClientError
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
cognito_client = boto3.client('cognito-idp')

# Environment variables
USERS_TABLE = os.environ.get('USERS_TABLE', 'vpflow-users')
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production')
COGNITO_USER_POOL_ID = os.environ.get('COGNITO_USER_POOL_ID')
COGNITO_CLIENT_ID = os.environ.get('COGNITO_CLIENT_ID')
COGNITO_CLIENT_SECRET = os.environ.get('COGNITO_CLIENT_SECRET')

def lambda_handler(event, context):
    """
    Handle authentication requests (login, register, token refresh, etc.)
    
    Args:
        event: Lambda event object containing the request
        context: Lambda context object
        
    Returns:
        dict: Response with status code and authentication result
    """
    try:
        # Determine the authentication action
        path = event.get('path', '')
        http_method = event.get('httpMethod', 'POST')
        
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        action = body.get('action', 'login')
        
        # Route to appropriate handler
        if action == 'login':
            return handle_login(body)
        elif action == 'register':
            return handle_registration(body)
        elif action == 'refresh':
            return handle_token_refresh(body)
        elif action == 'verify':
            return handle_token_verification(body)
        elif action == 'logout':
            return handle_logout(body)
        elif action == 'change_password':
            return handle_password_change(body)
        else:
            return error_response(400, 'Invalid action')
        
    except Exception as e:
        logger.error(f"Error in auth handler: {str(e)}")
        return error_response(500, 'Internal server error', str(e))

def handle_login(body):
    """
    Handle user login
    """
    try:
        username = body.get('username', '').strip().lower()
        password = body.get('password', '')
        
        if not username or not password:
            return error_response(400, 'Username and password are required')
        
        # Try Cognito authentication first if configured
        if COGNITO_USER_POOL_ID:
            return cognito_login(username, password)
        else:
            return local_login(username, password)
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return error_response(500, 'Login failed', str(e))

def handle_registration(body):
    """
    Handle user registration
    """
    try:
        username = body.get('username', '').strip().lower()
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        name = body.get('name', '').strip()
        role = body.get('role', 'banker')  # Default role
        department = body.get('department', '')
        
        if not username or not email or not password or not name:
            return error_response(400, 'Username, email, password, and name are required')
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return error_response(400, 'Invalid email format')
        
        # Validate password strength
        if len(password) < 8:
            return error_response(400, 'Password must be at least 8 characters long')
        
        # Try Cognito registration first if configured
        if COGNITO_USER_POOL_ID:
            return cognito_register(username, email, password, name, role, department)
        else:
            return local_register(username, email, password, name, role, department)
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return error_response(500, 'Registration failed', str(e))

def handle_token_refresh(body):
    """
    Handle JWT token refresh
    """
    try:
        refresh_token = body.get('refreshToken', '')
        
        if not refresh_token:
            return error_response(400, 'Refresh token is required')
        
        # Verify and decode refresh token
        try:
            payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=['HS256'])
            
            if payload.get('type') != 'refresh':
                return error_response(401, 'Invalid refresh token type')
            
            user_id = payload.get('user_id')
            username = payload.get('username')
            
            # Get user info
            user = get_user_by_id(user_id)
            if not user:
                return error_response(401, 'User not found')
            
            # Generate new access token
            access_token = generate_access_token(user)
            new_refresh_token = generate_refresh_token(user)
            
            return success_response({
                'access_token': access_token,
                'refresh_token': new_refresh_token,
                'token_type': 'Bearer',
                'expires_in': 3600
            })
            
        except jwt.ExpiredSignatureError:
            return error_response(401, 'Refresh token expired')
        except jwt.InvalidTokenError:
            return error_response(401, 'Invalid refresh token')
        
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        return error_response(500, 'Token refresh failed', str(e))

def handle_token_verification(body):
    """
    Handle token verification
    """
    try:
        token = body.get('token', '')
        
        if not token:
            return error_response(400, 'Token is required')
        
        # Remove Bearer prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            
            return success_response({
                'valid': True,
                'user_id': payload.get('user_id'),
                'username': payload.get('username'),
                'role': payload.get('role'),
                'expires_at': payload.get('exp')
            })
            
        except jwt.ExpiredSignatureError:
            return success_response({'valid': False, 'reason': 'Token expired'})
        except jwt.InvalidTokenError:
            return success_response({'valid': False, 'reason': 'Invalid token'})
        
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return error_response(500, 'Token verification failed', str(e))

def handle_logout(body):
    """
    Handle user logout
    """
    try:
        # For now, just return success (client-side token removal)
        # In production, you might want to maintain a token blacklist
        
        return success_response({
            'message': 'Logged out successfully'
        })
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return error_response(500, 'Logout failed', str(e))

def handle_password_change(body):
    """
    Handle password change
    """
    try:
        user_id = body.get('userId')
        current_password = body.get('currentPassword', '')
        new_password = body.get('newPassword', '')
        
        if not user_id or not current_password or not new_password:
            return error_response(400, 'User ID, current password, and new password are required')
        
        # Validate new password
        if len(new_password) < 8:
            return error_response(400, 'New password must be at least 8 characters long')
        
        # Get user
        user = get_user_by_id(user_id)
        if not user:
            return error_response(404, 'User not found')
        
        # Verify current password
        if not verify_password(current_password, user.get('password_hash', '')):
            return error_response(401, 'Current password is incorrect')
        
        # Hash new password
        new_password_hash = hash_password(new_password)
        
        # Update password in database
        table = dynamodb.Table(USERS_TABLE)
        table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET password_hash = :new_hash, updated_timestamp = :timestamp',
            ExpressionAttributeValues={
                ':new_hash': new_password_hash,
                ':timestamp': datetime.utcnow().isoformat()
            }
        )
        
        return success_response({
            'message': 'Password changed successfully'
        })
        
    except Exception as e:
        logger.error(f"Password change error: {str(e)}")
        return error_response(500, 'Password change failed', str(e))

def cognito_login(username, password):
    """
    Login using AWS Cognito
    """
    try:
        # Calculate secret hash if client secret is provided
        secret_hash = None
        if COGNITO_CLIENT_SECRET:
            secret_hash = calculate_secret_hash(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET)
        
        # Initiate authentication
        auth_params = {
            'USERNAME': username,
            'PASSWORD': password
        }
        
        if secret_hash:
            auth_params['SECRET_HASH'] = secret_hash
        
        response = cognito_client.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters=auth_params
        )
        
        # Get tokens
        auth_result = response['AuthenticationResult']
        access_token = auth_result['AccessToken']
        refresh_token = auth_result['RefreshToken']
        id_token = auth_result['IdToken']
        
        # Get user attributes
        user_response = cognito_client.get_user(AccessToken=access_token)
        user_attributes = {attr['Name']: attr['Value'] for attr in user_response['UserAttributes']}
        
        # Create user record in local database if not exists
        create_or_update_user_from_cognito(username, user_attributes)
        
        return success_response({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'id_token': id_token,
            'token_type': 'Bearer',
            'expires_in': 3600,
            'user': {
                'username': username,
                'email': user_attributes.get('email'),
                'name': user_attributes.get('name'),
                'role': user_attributes.get('custom:role', 'banker')
            }
        })
        
    except cognito_client.exceptions.NotAuthorizedException:
        return error_response(401, 'Invalid username or password')
    except cognito_client.exceptions.UserNotConfirmedException:
        return error_response(401, 'User account not confirmed')
    except Exception as e:
        logger.error(f"Cognito login error: {str(e)}")
        return error_response(500, 'Authentication service error')

def cognito_register(username, email, password, name, role, department):
    """
    Register user with AWS Cognito
    """
    try:
        # Calculate secret hash if client secret is provided
        secret_hash = None
        if COGNITO_CLIENT_SECRET:
            secret_hash = calculate_secret_hash(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET)
        
        # Prepare user attributes
        user_attributes = [
            {'Name': 'email', 'Value': email},
            {'Name': 'name', 'Value': name},
            {'Name': 'custom:role', 'Value': role}
        ]
        
        if department:
            user_attributes.append({'Name': 'custom:department', 'Value': department})
        
        # Sign up user
        signup_params = {
            'ClientId': COGNITO_CLIENT_ID,
            'Username': username,
            'Password': password,
            'UserAttributes': user_attributes
        }
        
        if secret_hash:
            signup_params['SecretHash'] = secret_hash
        
        response = cognito_client.sign_up(**signup_params)
        
        # Create user record in local database
        user_id = create_local_user(username, email, None, name, role, department)
        
        return success_response({
            'message': 'User registered successfully',
            'user_id': user_id,
            'confirmation_required': not response['UserConfirmed']
        })
        
    except cognito_client.exceptions.UsernameExistsException:
        return error_response(400, 'Username already exists')
    except cognito_client.exceptions.InvalidPasswordException:
        return error_response(400, 'Password does not meet requirements')
    except Exception as e:
        logger.error(f"Cognito registration error: {str(e)}")
        return error_response(500, 'Registration service error')

def local_login(username, password):
    """
    Login using local database
    """
    try:
        # Get user from database
        user = get_user_by_username(username)
        
        if not user:
            return error_response(401, 'Invalid username or password')
        
        # Verify password
        if not verify_password(password, user.get('password_hash', '')):
            return error_response(401, 'Invalid username or password')
        
        # Check if user is active
        if user.get('status') != 'active':
            return error_response(401, 'User account is not active')
        
        # Generate tokens
        access_token = generate_access_token(user)
        refresh_token = generate_refresh_token(user)
        
        # Update last login
        update_last_login(user['user_id'])
        
        return success_response({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'expires_in': 3600,
            'user': {
                'user_id': user['user_id'],
                'username': user['username'],
                'email': user['email'],
                'name': user['name'],
                'role': user['role'],
                'department': user.get('department', '')
            }
        })
        
    except Exception as e:
        logger.error(f"Local login error: {str(e)}")
        return error_response(500, 'Authentication failed')

def local_register(username, email, password, name, role, department):
    """
    Register user in local database
    """
    try:
        # Check if username exists
        if get_user_by_username(username):
            return error_response(400, 'Username already exists')
        
        # Check if email exists
        if get_user_by_email(email):
            return error_response(400, 'Email already exists')
        
        # Hash password
        password_hash = hash_password(password)
        
        # Create user
        user_id = create_local_user(username, email, password_hash, name, role, department)
        
        return success_response({
            'message': 'User registered successfully',
            'user_id': user_id
        })
        
    except Exception as e:
        logger.error(f"Local registration error: {str(e)}")
        return error_response(500, 'Registration failed')

def get_user_by_username(username):
    """Get user by username from database"""
    try:
        table = dynamodb.Table(USERS_TABLE)
        response = table.scan(
            FilterExpression='username = :username',
            ExpressionAttributeValues={':username': username}
        )
        
        items = response.get('Items', [])
        return items[0] if items else None
        
    except Exception as e:
        logger.error(f"Error getting user by username: {str(e)}")
        return None

def get_user_by_email(email):
    """Get user by email from database"""
    try:
        table = dynamodb.Table(USERS_TABLE)
        response = table.scan(
            FilterExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        
        items = response.get('Items', [])
        return items[0] if items else None
        
    except Exception as e:
        logger.error(f"Error getting user by email: {str(e)}")
        return None

def get_user_by_id(user_id):
    """Get user by ID from database"""
    try:
        table = dynamodb.Table(USERS_TABLE)
        response = table.get_item(Key={'user_id': user_id})
        return response.get('Item')
        
    except Exception as e:
        logger.error(f"Error getting user by ID: {str(e)}")
        return None

def create_local_user(username, email, password_hash, name, role, department):
    """Create user in local database"""
    try:
        user_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        table = dynamodb.Table(USERS_TABLE)
        user_item = {
            'user_id': user_id,
            'username': username,
            'email': email,
            'name': name,
            'role': role,
            'department': department,
            'status': 'active',
            'created_timestamp': timestamp,
            'updated_timestamp': timestamp
        }
        
        if password_hash:
            user_item['password_hash'] = password_hash
        
        table.put_item(Item=user_item)
        
        return user_id
        
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise e

def create_or_update_user_from_cognito(username, user_attributes):
    """Create or update user from Cognito attributes"""
    try:
        existing_user = get_user_by_username(username)
        
        user_data = {
            'username': username,
            'email': user_attributes.get('email'),
            'name': user_attributes.get('name'),
            'role': user_attributes.get('custom:role', 'banker'),
            'department': user_attributes.get('custom:department', ''),
            'status': 'active',
            'updated_timestamp': datetime.utcnow().isoformat()
        }
        
        if existing_user:
            # Update existing user
            table = dynamodb.Table(USERS_TABLE)
            table.update_item(
                Key={'user_id': existing_user['user_id']},
                UpdateExpression='SET email = :email, #name = :name, #role = :role, department = :dept, updated_timestamp = :timestamp',
                ExpressionAttributeNames={'#name': 'name', '#role': 'role'},
                ExpressionAttributeValues={
                    ':email': user_data['email'],
                    ':name': user_data['name'],
                    ':role': user_data['role'],
                    ':dept': user_data['department'],
                    ':timestamp': user_data['updated_timestamp']
                }
            )
        else:
            # Create new user
            user_data['user_id'] = str(uuid.uuid4())
            user_data['created_timestamp'] = user_data['updated_timestamp']
            
            table = dynamodb.Table(USERS_TABLE)
            table.put_item(Item=user_data)
        
    except Exception as e:
        logger.error(f"Error creating/updating user from Cognito: {str(e)}")

def hash_password(password):
    """Hash password using SHA256 with salt"""
    salt = os.urandom(32)
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt + pwdhash

def verify_password(password, stored_password):
    """Verify password against stored hash"""
    try:
        salt = stored_password[:32]
        stored_hash = stored_password[32:]
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return pwdhash == stored_hash
    except Exception:
        return False

def generate_access_token(user):
    """Generate JWT access token"""
    payload = {
        'user_id': user['user_id'],
        'username': user['username'],
        'email': user['email'],
        'role': user['role'],
        'type': 'access',
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def generate_refresh_token(user):
    """Generate JWT refresh token"""
    payload = {
        'user_id': user['user_id'],
        'username': user['username'],
        'type': 'refresh',
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def calculate_secret_hash(username, client_id, client_secret):
    """Calculate Cognito secret hash"""
    message = username + client_id
    dig = hmac.new(
        client_secret.encode('UTF-8'),
        msg=message.encode('UTF-8'),
        digestmod=hashlib.sha256
    ).digest()
    return base64.b64encode(dig).decode()

def update_last_login(user_id):
    """Update user's last login timestamp"""
    try:
        table = dynamodb.Table(USERS_TABLE)
        table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='SET last_login = :timestamp',
            ExpressionAttributeValues={
                ':timestamp': datetime.utcnow().isoformat()
            }
        )
    except Exception as e:
        logger.warning(f"Could not update last login: {str(e)}")

def success_response(data):
    """Generate success response"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            **data
        })
    }

def error_response(status_code, message, details=None):
    """Generate error response"""
    response_body = {
        'success': False,
        'error': message
    }
    
    if details:
        response_body['details'] = details
    
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(response_body)
    }
