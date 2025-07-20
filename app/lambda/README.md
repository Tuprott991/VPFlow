# VPFlow Lambda Functions

This directory contains all the AWS Lambda functions for the VPFlow application, providing serverless backend functionality for banking workflow management.

## Overview

VPFlow uses a serverless architecture with Lambda functions handling different aspects of the application:

- **Document Processing**: Upload, analysis, and retrieval of workflow documents
- **AI-Powered Diagram Generation**: Convert text workflows into interactive visual diagrams
- **Intelligent Chatbot**: Conversational AI for workflow guidance and support
- **User Authentication**: Secure login and user management
- **Feedback Processing**: Collect and analyze user feedback for continuous improvement

## Lambda Functions

### 1. Upload Handler (`upload_handler.py`)
- **Endpoint**: `POST /upload`
- **Purpose**: Handle document uploads and initiate processing
- **Features**:
  - Secure file upload to S3
  - Metadata extraction and storage
  - Textract integration for document parsing
  - Event-driven processing pipeline

### 2. Retrieval Handler (`retrieval_handler.py`)
- **Endpoint**: `POST /retrieval`
- **Purpose**: Search and retrieve workflow documents
- **Features**:
  - Semantic search using vector embeddings
  - Keyword-based search
  - Document similarity matching
  - Context-aware retrieval

### 3. Diagram Handler (`diagram_handler.py`)
- **Endpoint**: `POST /diagram`
- **Purpose**: Generate interactive workflow diagrams
- **Features**:
  - AI-powered diagram generation from text
  - Swimlane and flowchart formats
  - Role and step extraction
  - Customizable diagram layouts

### 4. Feedback Handler (`feedback_handler.py`)
- **Endpoint**: `POST /feedback`
- **Purpose**: Process user feedback and suggestions
- **Features**:
  - Feedback categorization and analysis
  - Sentiment analysis
  - Priority scoring
  - Integration with improvement loop

### 5. Chatbot Handler (`chatbot_handler.py`)
- **Endpoint**: `POST /chat`
- **Purpose**: Provide AI-powered conversational assistance
- **Features**:
  - Context-aware responses
  - Workflow-specific guidance
  - Integration with LightRAG knowledge graph
  - Multi-turn conversation support

### 6. Auth Handler (`auth_handler.py`)
- **Endpoint**: `POST /auth`
- **Purpose**: Handle user authentication and authorization
- **Features**:
  - JWT token-based authentication
  - User registration and login
  - Password management
  - Integration with AWS Cognito (optional)

## Architecture Integration

### AWS Services Used
- **Lambda**: Serverless function execution
- **API Gateway**: RESTful API endpoints
- **DynamoDB**: Document and user data storage
- **S3**: File storage and static assets
- **EventBridge**: Event-driven orchestration
- **Textract**: Document text extraction
- **SageMaker**: AI model inference (optional)
- **Cognito**: User pool management (optional)

### Data Flow
1. **Upload**: Documents → S3 → Textract → DynamoDB → EventBridge
2. **Processing**: EventBridge → Lambda → AI Analysis → Knowledge Graph
3. **Retrieval**: Query → Vector Search → Neptune/DynamoDB → Results
4. **Generation**: Text → SageMaker/AI → Diagram Data → Frontend
5. **Feedback**: User Input → Analysis → Storage → ML Learning Loop

## Deployment

### Prerequisites
- AWS CLI configured
- AWS SAM CLI installed
- Python 3.9+
- Required Python packages (see requirements.txt)

### Using AWS SAM
```bash
# Build the application
sam build

# Deploy to AWS
sam deploy --guided

# For subsequent deployments
sam deploy
```

### Environment Variables
Set the following environment variables:
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `DOCUMENT_BUCKET`: S3 bucket name for documents
- `ENVIRONMENT`: dev/staging/prod

### Manual Deployment
You can also deploy individual functions using the AWS CLI or console.

## Configuration

### DynamoDB Tables
- `vpflow-documents`: Document metadata and processed content
- `vpflow-diagrams`: Generated diagram data and versions
- `vpflow-feedbacks`: User feedback and analysis
- `vpflow-chat-history`: Conversation history
- `vpflow-users`: User accounts and profiles

### S3 Buckets
- `vpflow-documents`: Uploaded files and processed content
- `vpflow-assets`: Static assets and generated diagrams

### EventBridge Rules
- Document processing events
- Diagram generation events
- Feedback processing events
- User activity tracking

## Security

### Authentication
- JWT tokens for API access
- AWS IAM roles for service permissions
- Optional Cognito integration for user pools

### Data Protection
- Encryption at rest (DynamoDB, S3)
- Encryption in transit (HTTPS/TLS)
- Secure parameter storage (Systems Manager)

### Access Control
- Role-based access control (RBAC)
- Resource-level permissions
- API rate limiting

## Monitoring and Logging

### CloudWatch Integration
- Function execution logs
- Performance metrics
- Error tracking and alerting

### X-Ray Tracing
- End-to-end request tracing
- Performance bottleneck identification
- Service map visualization

## Testing

### Unit Tests
```bash
# Install test dependencies
pip install pytest moto

# Run tests
pytest tests/
```

### Integration Tests
```bash
# Test against AWS services
python -m pytest tests/integration/
```

### Load Testing
Use tools like Artillery or Locust to test API endpoints under load.

## Performance Optimization

### Cold Start Reduction
- Connection pooling for database clients
- Lambda layers for common dependencies
- Provisioned concurrency for critical functions

### Memory and Timeout Tuning
- Monitor CloudWatch metrics
- Adjust based on actual usage patterns
- Balance cost vs. performance

## Cost Optimization

### Pay-per-Use Model
- Lambda charges per request and execution time
- DynamoDB on-demand pricing
- S3 intelligent tiering

### Optimization Strategies
- Right-size function memory allocation
- Use DynamoDB efficiently
- Implement proper caching strategies

## Troubleshooting

### Common Issues
1. **Cold Start Latency**: Consider provisioned concurrency
2. **Memory Errors**: Increase function memory allocation
3. **Timeout Errors**: Optimize code or increase timeout
4. **Permission Errors**: Check IAM policies and roles

### Debugging
- Use CloudWatch Logs for error investigation
- Enable X-Ray tracing for complex issues
- Test functions locally with SAM CLI

## Development

### Local Development
```bash
# Start local API
sam local start-api

# Invoke function locally
sam local invoke UploadHandler -e events/upload.json
```

### Code Organization
- Each Lambda function in separate file
- Shared utilities in common modules
- Environment-specific configurations
- Comprehensive error handling

## Future Enhancements

### Planned Features
- Real-time WebSocket support
- Advanced AI model integration
- Multi-language support
- Enhanced analytics and reporting

### Scalability Improvements
- Function splitting for better modularity
- Caching layer implementation
- Database optimization
- CDN integration for static content

---

This Lambda infrastructure provides a robust, scalable foundation for VPFlow's AI-powered banking workflow management system.
