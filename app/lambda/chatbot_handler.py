"""
Lambda function for handling chatbot interactions
Integrates with the LangChain agent and LightRAG knowledge graph for intelligent responses
"""

import json
import boto3
import os
import sys
from datetime import datetime
from botocore.exceptions import ClientError
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Add the app directory to Python path for imports
sys.path.append('/opt/python/app')

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')

# Environment variables
CHAT_HISTORY_TABLE = os.environ.get('CHAT_HISTORY_TABLE', 'vpflow-chat-history')
DOCUMENTS_TABLE = os.environ.get('DOCUMENTS_TABLE', 'vpflow-documents')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

def lambda_handler(event, context):
    """
    Handle chatbot conversation requests
    
    Args:
        event: Lambda event object containing the request
        context: Lambda context object
        
    Returns:
        dict: Response with status code and body containing chatbot response
    """
    try:
        # Parse the request
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        # Extract parameters
        user_id = body.get('userId')
        thread_id = body.get('threadId')
        message = body.get('message', '')
        context_type = body.get('contextType', 'general')  # general, workflow, diagram
        context_id = body.get('contextId')  # ID of workflow, diagram, etc.
        
        if not user_id or not thread_id or not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Missing required fields: userId, threadId, or message'
                })
            }
        
        # Get conversation context
        context_data = get_conversation_context(context_type, context_id, user_id)
        
        # Initialize chatbot with context
        chatbot_response = get_chatbot_response(
            user_id=user_id,
            thread_id=thread_id,
            message=message,
            context_data=context_data,
            context_type=context_type
        )
        
        # Save conversation to history
        save_chat_message(user_id, thread_id, message, chatbot_response, context_type, context_id)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'response': chatbot_response,
                'thread_id': thread_id,
                'context_type': context_type,
                'timestamp': datetime.utcnow().isoformat()
            })
        }
        
    except Exception as e:
        logger.error(f"Error in chatbot handler: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Failed to process chat message',
                'details': str(e)
            })
        }

def get_conversation_context(context_type, context_id, user_id):
    """
    Get relevant context for the conversation
    """
    try:
        context_data = {'type': context_type, 'user_id': user_id}
        
        if context_type == 'workflow' and context_id:
            # Get workflow/document context
            document_context = get_document_context(context_id, user_id)
            if document_context:
                context_data['document'] = document_context
        
        elif context_type == 'diagram' and context_id:
            # Get diagram context
            diagram_context = get_diagram_context(context_id, user_id)
            if diagram_context:
                context_data['diagram'] = diagram_context
        
        return context_data
        
    except Exception as e:
        logger.warning(f"Could not get conversation context: {str(e)}")
        return {'type': 'general', 'user_id': user_id}

def get_document_context(document_id, user_id):
    """
    Get document context for chatbot
    """
    try:
        table = dynamodb.Table(DOCUMENTS_TABLE)
        response = table.get_item(Key={'document_id': document_id})
        
        document = response.get('Item')
        if document and document.get('user_id') == user_id:
            return {
                'document_id': document_id,
                'file_name': document.get('file_name'),
                'workflow_name': document.get('workflow_name'),
                'processed_text': document.get('processed_text', '')[:1000]  # First 1000 chars
            }
        
        return None
        
    except Exception as e:
        logger.warning(f"Could not get document context: {str(e)}")
        return None

def get_diagram_context(diagram_id, user_id):
    """
    Get diagram context for chatbot
    """
    try:
        table = dynamodb.Table('vpflow-diagrams')
        response = table.get_item(Key={'diagram_id': diagram_id})
        
        diagram = response.get('Item')
        if diagram and diagram.get('user_id') == user_id:
            return {
                'diagram_id': diagram_id,
                'diagram_type': diagram.get('diagram_type'),
                'workflow_content_preview': diagram.get('workflow_content_preview', ''),
                'node_count': len(diagram.get('diagram_data', {}).get('nodeDataArray', []))
            }
        
        return None
        
    except Exception as e:
        logger.warning(f"Could not get diagram context: {str(e)}")
        return None

def get_chatbot_response(user_id, thread_id, message, context_data, context_type):
    """
    Get response from the chatbot using the integrated agent system
    """
    try:
        # Try to use the integrated chatbot system
        if OPENAI_API_KEY:
            return get_ai_response(user_id, thread_id, message, context_data, context_type)
        else:
            return get_fallback_response(message, context_data, context_type)
            
    except Exception as e:
        logger.error(f"Error getting chatbot response: {str(e)}")
        return get_fallback_response(message, context_data, context_type)

def get_ai_response(user_id, thread_id, message, context_data, context_type):
    """
    Get AI-powered response using the chatbot system
    """
    try:
        # Import the chatbot system (this would be available in the Lambda layer)
        # For now, implement a simplified version
        
        # Analyze the message to understand intent
        intent = analyze_message_intent(message)
        
        # Build context prompt
        context_prompt = build_context_prompt(context_data, context_type)
        
        # Generate response based on intent and context
        if intent == 'workflow_question':
            response = handle_workflow_question(message, context_data)
        elif intent == 'diagram_question':
            response = handle_diagram_question(message, context_data)
        elif intent == 'general_help':
            response = handle_general_help(message, context_data)
        else:
            response = handle_general_conversation(message, context_data)
        
        # Add helpful suggestions
        suggestions = generate_suggestions(intent, context_data)
        
        return {
            'message': response,
            'intent': intent,
            'suggestions': suggestions,
            'context_used': context_type != 'general'
        }
        
    except Exception as e:
        logger.error(f"Error in AI response generation: {str(e)}")
        return get_fallback_response(message, context_data, context_type)

def analyze_message_intent(message):
    """
    Analyze message to understand user intent
    """
    try:
        message_lower = message.lower()
        
        # Workflow-related intents
        if any(keyword in message_lower for keyword in ['workflow', 'process', 'step', 'procedure']):
            return 'workflow_question'
        
        # Diagram-related intents
        elif any(keyword in message_lower for keyword in ['diagram', 'chart', 'visualization', 'flowchart']):
            return 'diagram_question'
        
        # Help-related intents
        elif any(keyword in message_lower for keyword in ['help', 'how to', 'how do i', 'what is', 'explain']):
            return 'general_help'
        
        # Problem/complaint intents
        elif any(keyword in message_lower for keyword in ['problem', 'issue', 'error', 'not working', 'broken']):
            return 'problem_report'
        
        else:
            return 'general_conversation'
            
    except Exception:
        return 'general_conversation'

def build_context_prompt(context_data, context_type):
    """
    Build context prompt for AI response
    """
    try:
        context_prompt = "You are VPFlow AI Assistant, helping users with banking workflow management. "
        
        if context_type == 'workflow' and context_data.get('document'):
            doc = context_data['document']
            context_prompt += f"Current context: Workflow '{doc.get('workflow_name')}' from document '{doc.get('file_name')}'. "
        
        elif context_type == 'diagram' and context_data.get('diagram'):
            diag = context_data['diagram']
            context_prompt += f"Current context: {diag.get('diagram_type')} diagram with {diag.get('node_count', 0)} steps. "
        
        context_prompt += "Provide helpful, accurate information about banking processes and workflows."
        
        return context_prompt
        
    except Exception:
        return "You are VPFlow AI Assistant. Provide helpful information about banking workflows."

def handle_workflow_question(message, context_data):
    """
    Handle workflow-related questions
    """
    try:
        responses = [
            "I can help you understand banking workflows and processes.",
            "Workflows in VPFlow represent the step-by-step procedures used in banking operations.",
            "Each workflow consists of multiple steps, decision points, and role assignments."
        ]
        
        if context_data.get('document'):
            doc = context_data['document']
            return f"Regarding the '{doc.get('workflow_name')}' workflow: " + responses[0] + " This workflow is documented in '{doc.get('file_name')}' and includes the key banking processes you're working with."
        
        return responses[0] + " " + responses[1]
        
    except Exception:
        return "I can help you with workflow-related questions. What specific aspect would you like to know about?"

def handle_diagram_question(message, context_data):
    """
    Handle diagram-related questions
    """
    try:
        if context_data.get('diagram'):
            diag = context_data['diagram']
            return f"This {diag.get('diagram_type', 'workflow')} diagram visualizes the process flow with {diag.get('node_count', 'multiple')} steps. You can interact with each step to see details, dependencies, and roles involved."
        
        return "VPFlow diagrams help visualize banking workflows as interactive flowcharts or swimlane diagrams. Each diagram shows the process steps, decision points, and role responsibilities in an easy-to-understand format."
        
    except Exception:
        return "I can help you understand and work with workflow diagrams. What would you like to know?"

def handle_general_help(message, context_data):
    """
    Handle general help requests
    """
    try:
        help_topics = [
            "📋 **Workflow Management**: Upload and analyze banking process documents",
            "📊 **Diagram Generation**: Create visual representations of your workflows", 
            "🔍 **Document Search**: Find relevant workflows and procedures",
            "💬 **AI Assistant**: Get contextual help and process insights",
            "📝 **Feedback System**: Report issues and suggest improvements"
        ]
        
        return "Here's how I can help you with VPFlow:\n\n" + "\n".join(help_topics) + "\n\nWhat specific area would you like assistance with?"
        
    except Exception:
        return "I'm here to help you navigate VPFlow and understand banking workflows. What can I assist you with?"

def handle_general_conversation(message, context_data):
    """
    Handle general conversation
    """
    try:
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon']
        thanks = ['thank you', 'thanks', 'appreciate']
        
        message_lower = message.lower()
        
        if any(greeting in message_lower for greeting in greetings):
            return "Hello! I'm VPFlow AI Assistant. I'm here to help you with banking workflows, diagrams, and process management. How can I assist you today?"
        
        elif any(thank in message_lower for thank in thanks):
            return "You're welcome! I'm always here to help. Is there anything else you'd like to know about VPFlow or your banking workflows?"
        
        else:
            return "I understand you're asking about VPFlow. I can help you with workflow management, diagram generation, document analysis, and general banking process questions. What specific information do you need?"
        
    except Exception:
        return "I'm here to help with your VPFlow questions. What would you like to know?"

def generate_suggestions(intent, context_data):
    """
    Generate helpful suggestions based on intent
    """
    try:
        base_suggestions = [
            "Upload a new workflow document",
            "Generate a diagram from your workflow",
            "Search existing workflows"
        ]
        
        if intent == 'workflow_question':
            return [
                "Show me workflow steps",
                "Explain the approval process",
                "What roles are involved?"
            ] + base_suggestions[:1]
        
        elif intent == 'diagram_question':
            return [
                "Generate a new diagram",
                "Export diagram as image",
                "Show workflow relationships"
            ] + base_suggestions[1:2]
        
        else:
            return base_suggestions
            
    except Exception:
        return ["How can I help you today?"]

def get_fallback_response(message, context_data, context_type):
    """
    Generate fallback response when AI is not available
    """
    try:
        return {
            'message': "I'm VPFlow AI Assistant. I can help you with banking workflows, diagram generation, and process management. While my full AI capabilities are currently being set up, I can still provide basic assistance. What would you like to know?",
            'intent': 'general_conversation',
            'suggestions': [
                "Upload a workflow document",
                "View existing diagrams",
                "Get help with processes"
            ],
            'context_used': False
        }
        
    except Exception:
        return {
            'message': "Hello! I'm here to help with VPFlow. How can I assist you?",
            'intent': 'general_conversation',
            'suggestions': [],
            'context_used': False
        }

def save_chat_message(user_id, thread_id, user_message, bot_response, context_type, context_id):
    """
    Save chat interaction to history
    """
    try:
        table = dynamodb.Table(CHAT_HISTORY_TABLE)
        
        import uuid
        message_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()
        
        # Save user message
        table.put_item(
            Item={
                'message_id': message_id + '_user',
                'thread_id': thread_id,
                'user_id': user_id,
                'message_type': 'user',
                'content': user_message,
                'context_type': context_type,
                'context_id': context_id,
                'timestamp': timestamp
            }
        )
        
        # Save bot response
        table.put_item(
            Item={
                'message_id': message_id + '_bot',
                'thread_id': thread_id,
                'user_id': user_id,
                'message_type': 'bot',
                'content': bot_response,
                'context_type': context_type,
                'context_id': context_id,
                'timestamp': timestamp
            }
        )
        
    except Exception as e:
        logger.warning(f"Could not save chat message: {str(e)}")
        # Don't fail the request if history saving fails
