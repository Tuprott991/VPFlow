"""
Lambda function for handling user feedback submission and processing
Integrates with DynamoDB for feedback storage and SageMaker for learning loop
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
dynamodb = boto3.resource('dynamodb')
eventbridge_client = boto3.client('events')
s3_client = boto3.client('s3')

# Environment variables
FEEDBACKS_TABLE = os.environ.get('FEEDBACKS_TABLE', 'vpflow-feedbacks')
DIAGRAMS_TABLE = os.environ.get('DIAGRAMS_TABLE', 'vpflow-diagrams')
EVENT_BUS_NAME = os.environ.get('EVENT_BUS_NAME', 'vpflow-events')
BUCKET_NAME = os.environ.get('DOCUMENT_BUCKET', 'vpflow-documents')

def lambda_handler(event, context):
    """
    Handle feedback submission requests
    
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
        
        # Extract feedback data
        user_id = body.get('userId')
        feedback_type = body.get('feedbackType', 'general')  # general, diagram, painpoint, suggestion
        content = body.get('content', '')
        title = body.get('title', 'User Feedback')
        
        # Optional references
        diagram_id = body.get('diagramId')
        document_id = body.get('documentId')
        workflow_step_id = body.get('workflowStepId')
        
        # Feedback details
        rating = body.get('rating')  # 1-5 scale
        category = body.get('category', 'improvement')  # improvement, bug, complaint, suggestion
        priority = body.get('priority', 'medium')  # low, medium, high
        tags = body.get('tags', [])
        
        if not user_id or not content:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Missing required fields: userId or content'
                })
            }
        
        # Generate feedback ID
        feedback_id = str(uuid.uuid4())
        
        # Get user info for feedback context
        user_info = get_user_context(user_id)
        
        # Process and analyze feedback content
        feedback_analysis = analyze_feedback_content(content, feedback_type)
        
        # Save feedback to database
        feedback_record = save_feedback(
            feedback_id=feedback_id,
            user_id=user_id,
            user_info=user_info,
            feedback_type=feedback_type,
            title=title,
            content=content,
            rating=rating,
            category=category,
            priority=priority,
            tags=tags,
            diagram_id=diagram_id,
            document_id=document_id,
            workflow_step_id=workflow_step_id,
            analysis=feedback_analysis
        )
        
        # Update related records if applicable
        if diagram_id:
            update_diagram_feedback(diagram_id, feedback_id, rating, category)
        
        # Trigger feedback processing events
        trigger_feedback_events(feedback_record)
        
        # Generate auto-response or suggestions if applicable
        auto_response = generate_auto_response(feedback_record)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'feedback_id': feedback_id,
                'status': 'received',
                'message': 'Feedback submitted successfully',
                'auto_response': auto_response,
                'estimated_response_time': get_estimated_response_time(priority, category)
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
                'error': 'Failed to submit feedback',
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

def get_user_context(user_id):
    """
    Get user context information for feedback processing
    """
    try:
        # This would typically fetch from a users table
        # For now, return basic structure
        return {
            'user_id': user_id,
            'role': 'banker',  # Default role
            'department': 'operations',
            'experience_level': 'intermediate'
        }
    except Exception as e:
        logger.warning(f"Could not get user context: {str(e)}")
        return {'user_id': user_id}

def analyze_feedback_content(content, feedback_type):
    """
    Analyze feedback content using NLP techniques
    """
    try:
        analysis = {
            'sentiment': analyze_sentiment(content),
            'keywords': extract_keywords(content),
            'urgency_score': calculate_urgency(content),
            'topic_classification': classify_topic(content, feedback_type),
            'actionable_items': extract_actionable_items(content)
        }
        
        return analysis
        
    except Exception as e:
        logger.warning(f"Could not analyze feedback content: {str(e)}")
        return {'status': 'analysis_failed'}

def analyze_sentiment(content):
    """
    Simple sentiment analysis (in production, use AWS Comprehend)
    """
    try:
        positive_words = ['good', 'great', 'excellent', 'helpful', 'useful', 'love', 'perfect', 'amazing']
        negative_words = ['bad', 'terrible', 'horrible', 'useless', 'hate', 'broken', 'slow', 'confusing']
        
        content_lower = content.lower()
        positive_count = sum(1 for word in positive_words if word in content_lower)
        negative_count = sum(1 for word in negative_words if word in content_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
            
    except Exception:
        return 'neutral'

def extract_keywords(content):
    """
    Extract key terms from feedback content
    """
    try:
        # Simple keyword extraction (in production, use more sophisticated NLP)
        banking_terms = ['diagram', 'workflow', 'process', 'step', 'approval', 'customer', 'account', 'loan', 'credit']
        
        content_lower = content.lower()
        keywords = [term for term in banking_terms if term in content_lower]
        
        # Add frequent words
        words = content_lower.split()
        frequent_words = [word for word in words if len(word) > 4 and words.count(word) > 1]
        keywords.extend(frequent_words[:5])  # Top 5 frequent words
        
        return list(set(keywords))
        
    except Exception:
        return []

def calculate_urgency(content):
    """
    Calculate urgency score based on content analysis
    """
    try:
        urgent_indicators = ['urgent', 'critical', 'broken', 'error', 'failed', 'stop', 'immediately']
        content_lower = content.lower()
        
        urgency_score = sum(2 for indicator in urgent_indicators if indicator in content_lower)
        
        # Add points for length (longer feedback might indicate more serious issues)
        if len(content) > 500:
            urgency_score += 1
        
        return min(urgency_score, 10)  # Cap at 10
        
    except Exception:
        return 0

def classify_topic(content, feedback_type):
    """
    Classify feedback into topics
    """
    try:
        topics = {
            'ui_ux': ['interface', 'design', 'layout', 'confusing', 'hard to use'],
            'performance': ['slow', 'fast', 'loading', 'response time', 'lag'],
            'functionality': ['feature', 'function', 'not working', 'broken', 'bug'],
            'accuracy': ['wrong', 'incorrect', 'accurate', 'mistake', 'error'],
            'workflow': ['process', 'step', 'workflow', 'procedure', 'sequence']
        }
        
        content_lower = content.lower()
        
        for topic, keywords in topics.items():
            if any(keyword in content_lower for keyword in keywords):
                return topic
        
        return feedback_type
        
    except Exception:
        return 'general'

def extract_actionable_items(content):
    """
    Extract actionable items from feedback
    """
    try:
        # Simple extraction of sentences with action words
        action_words = ['should', 'could', 'need', 'want', 'suggest', 'recommend', 'improve', 'add', 'remove', 'change']
        
        sentences = content.split('.')
        actionable = []
        
        for sentence in sentences:
            if any(action in sentence.lower() for action in action_words):
                actionable.append(sentence.strip())
        
        return actionable[:3]  # Return top 3 actionable items
        
    except Exception:
        return []

def save_feedback(feedback_id, user_id, user_info, feedback_type, title, content, rating, 
                  category, priority, tags, diagram_id, document_id, workflow_step_id, analysis):
    """
    Save feedback to DynamoDB
    """
    try:
        table = dynamodb.Table(FEEDBACKS_TABLE)
        
        feedback_record = {
            'feedback_id': feedback_id,
            'user_id': user_id,
            'user_info': user_info,
            'feedback_type': feedback_type,
            'title': title,
            'content': content,
            'rating': rating,
            'category': category,
            'priority': priority,
            'tags': tags,
            'analysis': analysis,
            'status': 'received',
            'created_timestamp': datetime.utcnow().isoformat(),
            'updated_timestamp': datetime.utcnow().isoformat()
        }
        
        # Add optional references
        if diagram_id:
            feedback_record['diagram_id'] = diagram_id
        if document_id:
            feedback_record['document_id'] = document_id
        if workflow_step_id:
            feedback_record['workflow_step_id'] = workflow_step_id
        
        table.put_item(Item=feedback_record)
        
        return feedback_record
        
    except Exception as e:
        logger.error(f"Error saving feedback: {str(e)}")
        raise e

def update_diagram_feedback(diagram_id, feedback_id, rating, category):
    """
    Update diagram record with feedback information
    """
    try:
        table = dynamodb.Table(DIAGRAMS_TABLE)
        
        # Get current feedback list
        response = table.get_item(Key={'diagram_id': diagram_id})
        diagram = response.get('Item', {})
        
        feedback_list = diagram.get('feedback_list', [])
        feedback_list.append({
            'feedback_id': feedback_id,
            'rating': rating,
            'category': category,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        # Calculate average rating
        ratings = [f['rating'] for f in feedback_list if f.get('rating')]
        avg_rating = sum(ratings) / len(ratings) if ratings else None
        
        # Update diagram record
        update_expression = 'SET feedback_list = :feedback_list, updated_timestamp = :updated'
        expression_values = {
            ':feedback_list': feedback_list,
            ':updated': datetime.utcnow().isoformat()
        }
        
        if avg_rating:
            update_expression += ', average_rating = :avg_rating'
            expression_values[':avg_rating'] = round(avg_rating, 2)
        
        table.update_item(
            Key={'diagram_id': diagram_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values
        )
        
    except Exception as e:
        logger.warning(f"Could not update diagram feedback: {str(e)}")

def trigger_feedback_events(feedback_record):
    """
    Trigger events for feedback processing
    """
    try:
        eventbridge_client.put_events(
            Entries=[
                {
                    'Source': 'vpflow.feedback',
                    'DetailType': 'Feedback Submitted',
                    'Detail': json.dumps({
                        'feedback_id': feedback_record['feedback_id'],
                        'user_id': feedback_record['user_id'],
                        'feedback_type': feedback_record['feedback_type'],
                        'category': feedback_record['category'],
                        'priority': feedback_record['priority'],
                        'urgency_score': feedback_record['analysis'].get('urgency_score', 0),
                        'timestamp': feedback_record['created_timestamp']
                    }),
                    'EventBusName': EVENT_BUS_NAME
                }
            ]
        )
        
    except Exception as e:
        logger.warning(f"Failed to trigger feedback events: {str(e)}")

def generate_auto_response(feedback_record):
    """
    Generate automated response based on feedback analysis
    """
    try:
        category = feedback_record.get('category', 'general')
        sentiment = feedback_record.get('analysis', {}).get('sentiment', 'neutral')
        urgency_score = feedback_record.get('analysis', {}).get('urgency_score', 0)
        
        responses = {
            'bug': {
                'positive': "Thank you for reporting this issue. We're glad you took the time to help us improve!",
                'neutral': "Thank you for the bug report. Our team will investigate and address this issue.",
                'negative': "We sincerely apologize for this bug. Our team will prioritize fixing this issue."
            },
            'improvement': {
                'positive': "Thank you for your valuable suggestion! We appreciate your input for making VPFlow better.",
                'neutral': "Thank you for your improvement suggestion. We'll consider this for future updates.",
                'negative': "We understand your frustration and appreciate your suggestion for improvement."
            },
            'complaint': {
                'positive': "Thank you for your feedback. We're working to address your concerns.",
                'neutral': "Thank you for bringing this to our attention. We'll review and address your concerns.",
                'negative': "We sincerely apologize for your experience. We're committed to resolving this issue."
            }
        }
        
        base_response = responses.get(category, responses['improvement']).get(sentiment, 
            "Thank you for your feedback. We value your input and will review it carefully.")
        
        if urgency_score > 5:
            base_response += " Due to the urgency of your feedback, we'll prioritize this for immediate review."
        
        return base_response
        
    except Exception as e:
        logger.warning(f"Could not generate auto response: {str(e)}")
        return "Thank you for your feedback. We appreciate your input and will review it carefully."

def get_estimated_response_time(priority, category):
    """
    Calculate estimated response time based on priority and category
    """
    try:
        base_times = {
            'bug': {'high': '2-4 hours', 'medium': '1-2 days', 'low': '3-5 days'},
            'complaint': {'high': '1-2 hours', 'medium': '4-8 hours', 'low': '1-2 days'},
            'improvement': {'high': '1-2 days', 'medium': '3-5 days', 'low': '1-2 weeks'},
            'general': {'high': '4-8 hours', 'medium': '1-3 days', 'low': '3-7 days'}
        }
        
        return base_times.get(category, base_times['general']).get(priority, '1-3 days')
        
    except Exception:
        return '1-3 days'
