"""
Lambda function for handling diagram generation requests
Integrates with SageMaker for AI-powered diagram generation from workflow documents
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
sagemaker_runtime = boto3.client('sagemaker-runtime')
eventbridge_client = boto3.client('events')

# Environment variables
DOCUMENTS_TABLE = os.environ.get('DOCUMENTS_TABLE', 'vpflow-documents')
DIAGRAMS_TABLE = os.environ.get('DIAGRAMS_TABLE', 'vpflow-diagrams')
BUCKET_NAME = os.environ.get('DOCUMENT_BUCKET', 'vpflow-documents')
SAGEMAKER_ENDPOINT = os.environ.get('SAGEMAKER_DIAGRAM_ENDPOINT', 'vpflow-diagram-generator')
EVENT_BUS_NAME = os.environ.get('EVENT_BUS_NAME', 'vpflow-events')

def lambda_handler(event, context):
    """
    Handle diagram generation requests
    
    Args:
        event: Lambda event object containing the request
        context: Lambda context object
        
    Returns:
        dict: Response with status code and body containing diagram data
    """
    try:
        # Parse the request
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        # Extract parameters
        user_id = body.get('userId')
        document_id = body.get('documentId')
        diagram_type = body.get('diagramType', 'swimlane')  # swimlane, flowchart, etc.
        customization = body.get('customization', {})
        workflow_text = body.get('workflowText')  # Optional: direct text input
        
        if not user_id or (not document_id and not workflow_text):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Missing required fields: userId and (documentId or workflowText)'
                })
            }
        
        # Get document content if document_id is provided
        document_content = None
        document = None
        
        if document_id:
            document = get_document(document_id, user_id)
            if not document:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'error': 'Document not found or access denied'
                    })
                }
            
            # Get processed text from document
            document_content = get_document_text_content(document)
        
        # Use provided workflow text or document content
        workflow_content = workflow_text or document_content
        
        if not workflow_content:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'No workflow content available for diagram generation'
                })
            }
        
        # Generate diagram using AI
        diagram_data = generate_diagram_with_ai(
            workflow_content, 
            diagram_type, 
            customization
        )
        
        # Save diagram to database
        diagram_id = save_diagram(
            user_id=user_id,
            document_id=document_id,
            diagram_type=diagram_type,
            diagram_data=diagram_data,
            workflow_content=workflow_content[:1000],  # Store first 1000 chars as preview
            customization=customization
        )
        
        # Trigger post-processing events
        trigger_diagram_events(diagram_id, user_id, document_id, diagram_type)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'diagram_id': diagram_id,
                'diagram_data': diagram_data,
                'diagram_type': diagram_type,
                'message': 'Diagram generated successfully'
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
                'error': 'Failed to generate diagram',
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

def get_document(document_id, user_id):
    """
    Retrieve document from DynamoDB
    """
    try:
        table = dynamodb.Table(DOCUMENTS_TABLE)
        response = table.get_item(
            Key={'document_id': document_id}
        )
        
        document = response.get('Item')
        
        # Verify user has access to this document
        if document and document.get('user_id') == user_id:
            return document
        
        return None
        
    except Exception as e:
        logger.error(f"Error retrieving document: {str(e)}")
        return None

def get_document_text_content(document):
    """
    Get processed text content from document
    """
    try:
        # Check if we have processed text in the document record
        if document.get('processed_text'):
            return document['processed_text']
        
        # Try to get from S3 if available
        if document.get('processed_text_s3_key'):
            try:
                response = s3_client.get_object(
                    Bucket=BUCKET_NAME,
                    Key=document['processed_text_s3_key']
                )
                return response['Body'].read().decode('utf-8')
            except Exception as e:
                logger.warning(f"Failed to get processed text from S3: {str(e)}")
        
        # If no processed text available, return basic info
        return f"Document: {document.get('file_name', 'Unknown')}\nWorkflow: {document.get('workflow_name', 'Unknown')}"
        
    except Exception as e:
        logger.error(f"Error getting document text content: {str(e)}")
        return None

def generate_diagram_with_ai(workflow_content, diagram_type, customization):
    """
    Generate diagram using SageMaker AI model
    """
    try:
        # Prepare the input for the AI model
        model_input = {
            'workflow_text': workflow_content,
            'diagram_type': diagram_type,
            'customization': customization,
            'generate_nodes': True,
            'generate_links': True,
            'extract_roles': True,
            'detect_decision_points': True
        }
        
        # Try to invoke SageMaker endpoint (fallback to mock data if not available)
        try:
            response = sagemaker_runtime.invoke_endpoint(
                EndpointName=SAGEMAKER_ENDPOINT,
                ContentType='application/json',
                Body=json.dumps(model_input)
            )
            
            result = json.loads(response['Body'].read().decode('utf-8'))
            return result.get('diagram_data', generate_mock_diagram(workflow_content, diagram_type))
            
        except ClientError as e:
            if 'EndpointNotFound' in str(e) or 'ValidationException' in str(e):
                logger.warning("SageMaker endpoint not available, using mock diagram generation")
                return generate_mock_diagram(workflow_content, diagram_type)
            else:
                raise e
        
    except Exception as e:
        logger.error(f"Error in AI diagram generation: {str(e)}")
        # Fallback to mock generation
        return generate_mock_diagram(workflow_content, diagram_type)

def generate_mock_diagram(workflow_content, diagram_type):
    """
    Generate a mock diagram structure when AI service is not available
    This would be replaced by actual AI-generated diagrams in production
    """
    try:
        # Analyze workflow content to extract basic structure
        lines = workflow_content.split('\n')
        steps = []
        roles = set()
        
        # Simple text analysis to identify steps and roles
        for i, line in enumerate(lines):
            line = line.strip()
            if line and len(line) > 10:  # Filter out short lines
                # Try to identify roles (common banking roles)
                if any(role in line.lower() for role in ['customer', 'banker', 'risk', 'operation', 'manager', 'teller']):
                    for role in ['customer', 'banker', 'risk', 'operation', 'manager', 'teller']:
                        if role in line.lower():
                            roles.add(role.title())
                
                # Create step
                steps.append({
                    'id': i + 1,
                    'text': line[:100] + '...' if len(line) > 100 else line,
                    'type': 'process',
                    'x': (i % 3) * 300,
                    'y': (i // 3) * 150
                })
        
        # Create roles if none identified
        if not roles:
            roles = {'Customer', 'Banker', 'Operations', 'Risk Assessment'}
        
        # Generate diagram based on type
        if diagram_type == 'swimlane':
            return generate_swimlane_diagram(list(roles), steps)
        else:
            return generate_flowchart_diagram(steps)
            
    except Exception as e:
        logger.error(f"Error in mock diagram generation: {str(e)}")
        return generate_default_diagram()

def generate_swimlane_diagram(roles, steps):
    """
    Generate a swimlane diagram structure
    """
    nodes = []
    links = []
    
    # Create role groups (swimlanes)
    for i, role in enumerate(roles):
        nodes.append({
            'key': role.upper(),
            'text': role,
            'isGroup': True,
            'color': get_role_color(role),
            'loc': f"{i * 250} 0"
        })
    
    # Distribute steps across roles
    for i, step in enumerate(steps):
        role = roles[i % len(roles)]
        nodes.append({
            'key': step['id'],
            'text': step['text'],
            'group': role.upper(),
            'loc': f"{(i % len(roles)) * 250} {(i // len(roles) + 1) * 100}"
        })
        
        # Create links between sequential steps
        if i > 0:
            links.append({
                'from': steps[i-1]['id'],
                'to': step['id']
            })
    
    return {
        'nodeDataArray': nodes,
        'linkDataArray': links,
        'diagram_type': 'swimlane',
        'roles': roles
    }

def generate_flowchart_diagram(steps):
    """
    Generate a flowchart diagram structure
    """
    nodes = []
    links = []
    
    for i, step in enumerate(steps):
        nodes.append({
            'key': step['id'],
            'text': step['text'],
            'loc': f"{step['x']} {step['y']}"
        })
        
        # Create links between sequential steps
        if i > 0:
            links.append({
                'from': steps[i-1]['id'],
                'to': step['id']
            })
    
    return {
        'nodeDataArray': nodes,
        'linkDataArray': links,
        'diagram_type': 'flowchart'
    }

def get_role_color(role):
    """
    Get color for a role in the diagram
    """
    colors = {
        'customer': '#f8d7da',
        'banker': '#fff3cd',
        'risk': '#d1ecf1',
        'operations': '#d4edda',
        'manager': '#e2e3e5',
        'teller': '#fce4ec'
    }
    return colors.get(role.lower(), '#e9ecef')

def generate_default_diagram():
    """
    Generate a minimal default diagram
    """
    return {
        'nodeDataArray': [
            {'key': 'START', 'text': 'Start Process', 'loc': '0 0'},
            {'key': 'END', 'text': 'End Process', 'loc': '200 0'}
        ],
        'linkDataArray': [
            {'from': 'START', 'to': 'END'}
        ],
        'diagram_type': 'flowchart'
    }

def save_diagram(user_id, document_id, diagram_type, diagram_data, workflow_content, customization):
    """
    Save generated diagram to DynamoDB
    """
    try:
        import uuid
        diagram_id = str(uuid.uuid4())
        
        table = dynamodb.Table(DIAGRAMS_TABLE)
        table.put_item(
            Item={
                'diagram_id': diagram_id,
                'user_id': user_id,
                'document_id': document_id,
                'diagram_type': diagram_type,
                'diagram_data': diagram_data,
                'workflow_content_preview': workflow_content,
                'customization': customization,
                'created_timestamp': datetime.utcnow().isoformat(),
                'version': '1.0',
                'status': 'active'
            }
        )
        
        return diagram_id
        
    except Exception as e:
        logger.error(f"Error saving diagram: {str(e)}")
        raise e

def trigger_diagram_events(diagram_id, user_id, document_id, diagram_type):
    """
    Trigger events for diagram post-processing
    """
    try:
        eventbridge_client.put_events(
            Entries=[
                {
                    'Source': 'vpflow.diagram',
                    'DetailType': 'Diagram Generated',
                    'Detail': json.dumps({
                        'diagram_id': diagram_id,
                        'user_id': user_id,
                        'document_id': document_id,
                        'diagram_type': diagram_type,
                        'timestamp': datetime.utcnow().isoformat()
                    }),
                    'EventBusName': EVENT_BUS_NAME
                }
            ]
        )
        
    except Exception as e:
        logger.warning(f"Failed to trigger diagram events: {str(e)}")
        # Don't fail the main request if events fail
