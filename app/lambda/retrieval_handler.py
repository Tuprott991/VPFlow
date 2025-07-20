"""
Lambda function for handling document retrieval requests
Integrates with Neptune graph database and vector search for intelligent document retrieval
"""

import json
import boto3
import os
from datetime import datetime
from botocore.exceptions import ClientError
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')

# Environment variables
DOCUMENTS_TABLE = os.environ.get('DOCUMENTS_TABLE', 'vpflow-documents')
WORKFLOWS_TABLE = os.environ.get('WORKFLOWS_TABLE', 'vpflow-workflows')
BUCKET_NAME = os.environ.get('DOCUMENT_BUCKET', 'vpflow-documents')
NEPTUNE_ENDPOINT = os.environ.get('NEPTUNE_ENDPOINT')

def lambda_handler(event, context):
    """
    Handle document retrieval requests
    
    Args:
        event: Lambda event object containing the request
        context: Lambda context object
        
    Returns:
        dict: Response with status code and body containing retrieved documents
    """
    try:
        # Parse the request
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        # Extract search parameters
        user_id = body.get('userId')
        search_query = body.get('query', '')
        search_type = body.get('searchType', 'semantic')  # semantic, keyword, or similarity
        limit = body.get('limit', 10)
        workflow_filter = body.get('workflowFilter')
        
        if not user_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Missing required field: userId'
                })
            }
        
        documents = []
        
        if search_type == 'semantic' and search_query:
            # Perform semantic search using vector embeddings
            documents = perform_semantic_search(user_id, search_query, limit, workflow_filter)
        elif search_type == 'keyword' and search_query:
            # Perform keyword-based search
            documents = perform_keyword_search(user_id, search_query, limit, workflow_filter)
        elif search_type == 'similarity' and body.get('documentId'):
            # Find similar documents
            documents = find_similar_documents(user_id, body['documentId'], limit)
        else:
            # Return all user documents if no specific search
            documents = get_user_documents(user_id, limit, workflow_filter)
        
        # Enrich documents with additional metadata
        enriched_documents = []
        for doc in documents:
            enriched_doc = enrich_document_metadata(doc)
            enriched_documents.append(enriched_doc)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'documents': enriched_documents,
                'total_count': len(enriched_documents),
                'search_query': search_query,
                'search_type': search_type
            })
        }
        
    except ClientError as e:
        logger.error(f"AWS service error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to retrieve documents',
                'details': str(e)
            })
        }
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'details': str(e)
            })
        }

def perform_semantic_search(user_id, query, limit, workflow_filter=None):
    """
    Perform semantic search using vector embeddings
    This would integrate with Neptune for graph-based semantic search
    """
    try:
        # For now, implement a basic text search until Neptune is configured
        # In production, this would use vector embeddings and Neptune queries
        
        table = dynamodb.Table(DOCUMENTS_TABLE)
        
        # Build filter expression
        filter_expression = "user_id = :user_id AND (contains(workflow_name, :query) OR contains(file_name, :query))"
        expression_values = {
            ':user_id': user_id,
            ':query': query
        }
        
        if workflow_filter:
            filter_expression += " AND workflow_name = :workflow"
            expression_values[':workflow'] = workflow_filter
        
        response = table.scan(
            FilterExpression=filter_expression,
            ExpressionAttributeValues=expression_values,
            Limit=limit
        )
        
        return response.get('Items', [])
        
    except Exception as e:
        logger.error(f"Error in semantic search: {str(e)}")
        return []

def perform_keyword_search(user_id, query, limit, workflow_filter=None):
    """
    Perform keyword-based search on document metadata and content
    """
    try:
        table = dynamodb.Table(DOCUMENTS_TABLE)
        
        # Split query into keywords
        keywords = query.lower().split()
        
        # Build filter expression for multiple keywords
        filter_expression = "user_id = :user_id"
        expression_values = {':user_id': user_id}
        
        for i, keyword in enumerate(keywords):
            filter_expression += f" AND (contains(#fn, :k{i}) OR contains(workflow_name, :k{i}))"
            expression_values[f':k{i}'] = keyword
        
        if workflow_filter:
            filter_expression += " AND workflow_name = :workflow"
            expression_values[':workflow'] = workflow_filter
        
        response = table.scan(
            FilterExpression=filter_expression,
            ExpressionAttributeNames={'#fn': 'file_name'},
            ExpressionAttributeValues=expression_values,
            Limit=limit
        )
        
        return response.get('Items', [])
        
    except Exception as e:
        logger.error(f"Error in keyword search: {str(e)}")
        return []

def find_similar_documents(user_id, document_id, limit):
    """
    Find documents similar to the specified document
    This would use vector similarity in production
    """
    try:
        # Get the reference document
        table = dynamodb.Table(DOCUMENTS_TABLE)
        ref_doc = table.get_item(Key={'document_id': document_id}).get('Item')
        
        if not ref_doc:
            return []
        
        # Find documents with similar workflow_name or file_type
        response = table.scan(
            FilterExpression="user_id = :user_id AND document_id <> :doc_id AND (workflow_name = :workflow OR file_type = :file_type)",
            ExpressionAttributeValues={
                ':user_id': user_id,
                ':doc_id': document_id,
                ':workflow': ref_doc.get('workflow_name', ''),
                ':file_type': ref_doc.get('file_type', '')
            },
            Limit=limit
        )
        
        return response.get('Items', [])
        
    except Exception as e:
        logger.error(f"Error finding similar documents: {str(e)}")
        return []

def get_user_documents(user_id, limit, workflow_filter=None):
    """
    Get all documents for a user with optional workflow filter
    """
    try:
        table = dynamodb.Table(DOCUMENTS_TABLE)
        
        if workflow_filter:
            response = table.scan(
                FilterExpression="user_id = :user_id AND workflow_name = :workflow",
                ExpressionAttributeValues={
                    ':user_id': user_id,
                    ':workflow': workflow_filter
                },
                Limit=limit
            )
        else:
            response = table.scan(
                FilterExpression="user_id = :user_id",
                ExpressionAttributeValues={':user_id': user_id},
                Limit=limit
            )
        
        return response.get('Items', [])
        
    except Exception as e:
        logger.error(f"Error getting user documents: {str(e)}")
        return []

def enrich_document_metadata(document):
    """
    Enrich document with additional metadata and signed URLs
    """
    try:
        # Generate pre-signed URL for document access
        if document.get('s3_bucket') and document.get('s3_key'):
            try:
                signed_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': document['s3_bucket'], 'Key': document['s3_key']},
                    ExpiresIn=3600  # 1 hour
                )
                document['download_url'] = signed_url
            except Exception as e:
                logger.warning(f"Failed to generate signed URL: {str(e)}")
        
        # Add computed fields
        document['upload_date_formatted'] = format_timestamp(document.get('upload_timestamp'))
        document['file_size_mb'] = document.get('file_size', 0) / (1024 * 1024) if document.get('file_size') else 0
        
        return document
        
    except Exception as e:
        logger.error(f"Error enriching document metadata: {str(e)}")
        return document

def format_timestamp(timestamp_str):
    """
    Format ISO timestamp to readable format
    """
    try:
        if timestamp_str:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            return dt.strftime('%Y-%m-%d %H:%M:%S UTC')
        return None
    except Exception:
        return timestamp_str
