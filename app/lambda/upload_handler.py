"""
Lambda function for handling document uploads
Integrates with S3, EventBridge, and Textract for document processing
"""

import json
import boto3
import uuid
import os
from datetime import datetime
from botocore.exceptions import ClientError
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
s3_client = boto3.client('s3')
textract_client = boto3.client('textract')
eventbridge_client = boto3.client('events')
dynamodb = boto3.resource('dynamodb')

# Environment variables
BUCKET_NAME = os.environ.get('DOCUMENT_BUCKET', 'vpflow-documents')
DOCUMENTS_TABLE = os.environ.get('DOCUMENTS_TABLE', 'vpflow-documents')
EVENT_BUS_NAME = os.environ.get('EVENT_BUS_NAME', 'vpflow-events')

def lambda_handler(event, context):
    """
    Handle document upload requests
    
    Args:
        event: Lambda event object containing the request
        context: Lambda context object
        
    Returns:
        dict: Response with status code and body
    """
    try:
        # Parse the request
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        # Extract file information
        file_name = body.get('fileName')
        file_content = body.get('fileContent')  # Base64 encoded
        file_type = body.get('fileType', 'application/pdf')
        user_id = body.get('userId')
        workflow_name = body.get('workflowName', 'Unknown Workflow')
        
        if not file_name or not file_content or not user_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Missing required fields: fileName, fileContent, or userId'
                })
            }
        
        # Generate unique document ID and S3 key
        document_id = str(uuid.uuid4())
        s3_key = f"uploads/{user_id}/{document_id}_{file_name}"
        
        # Decode and upload file to S3
        import base64
        file_bytes = base64.b64decode(file_content)
        
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=file_bytes,
            ContentType=file_type,
            Metadata={
                'user-id': user_id,
                'document-id': document_id,
                'workflow-name': workflow_name,
                'upload-timestamp': datetime.utcnow().isoformat()
            }
        )
        
        # Save document metadata to DynamoDB
        table = dynamodb.Table(DOCUMENTS_TABLE)
        table.put_item(
            Item={
                'document_id': document_id,
                'user_id': user_id,
                'file_name': file_name,
                'file_type': file_type,
                'workflow_name': workflow_name,
                's3_bucket': BUCKET_NAME,
                's3_key': s3_key,
                'upload_timestamp': datetime.utcnow().isoformat(),
                'status': 'uploaded',
                'processing_status': 'pending'
            }
        )
        
        # Trigger document processing via EventBridge
        eventbridge_client.put_events(
            Entries=[
                {
                    'Source': 'vpflow.document',
                    'DetailType': 'Document Uploaded',
                    'Detail': json.dumps({
                        'document_id': document_id,
                        'user_id': user_id,
                        's3_bucket': BUCKET_NAME,
                        's3_key': s3_key,
                        'file_type': file_type,
                        'workflow_name': workflow_name
                    }),
                    'EventBusName': EVENT_BUS_NAME
                }
            ]
        )
        
        # Start Textract job if it's a PDF or image
        if file_type in ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']:
            try:
                textract_response = textract_client.start_document_text_detection(
                    DocumentLocation={
                        'S3Object': {
                            'Bucket': BUCKET_NAME,
                            'Name': s3_key
                        }
                    },
                    ClientRequestToken=document_id
                )
                
                # Update document with Textract job ID
                table.update_item(
                    Key={'document_id': document_id},
                    UpdateExpression='SET textract_job_id = :job_id, processing_status = :status',
                    ExpressionAttributeValues={
                        ':job_id': textract_response['JobId'],
                        ':status': 'processing'
                    }
                )
                
                logger.info(f"Started Textract job {textract_response['JobId']} for document {document_id}")
                
            except ClientError as e:
                logger.error(f"Failed to start Textract job: {str(e)}")
                # Continue without failing - manual processing can be done later
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'document_id': document_id,
                's3_key': s3_key,
                'message': 'Document uploaded successfully and processing started'
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
                'error': 'Failed to upload document',
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
