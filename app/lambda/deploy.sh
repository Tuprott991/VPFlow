#!/bin/bash

# VPFlow Lambda Deployment Script
# This script helps deploy the VPFlow Lambda functions to AWS

set -e  # Exit on any error

echo "🚀 VPFlow Lambda Deployment Script"
echo "=================================="

# Check prerequisites
echo "Checking prerequisites..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is required but not installed. Please install it first."
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ AWS SAM CLI is required but not installed. Please install it first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3.9+ is required but not installed. Please install it first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Get environment
read -p "Enter environment (dev/staging/prod) [dev]: " ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-dev}

# Get OpenAI API Key
read -s -p "Enter OpenAI API Key (optional, press Enter to skip): " OPENAI_API_KEY
echo ""

# Get S3 bucket name
read -p "Enter S3 bucket name for documents [vpflow-documents]: " BUCKET_NAME
BUCKET_NAME=${BUCKET_NAME:-vpflow-documents}

# Validate AWS credentials
echo "Validating AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi
echo "✅ AWS credentials validated"

# Build the SAM application
echo "Building SAM application..."
if ! sam build; then
    echo "❌ SAM build failed"
    exit 1
fi
echo "✅ SAM build completed"

# Deploy the application
echo "Deploying to AWS..."

DEPLOY_PARAMS="--stack-name vpflow-lambda-${ENVIRONMENT}"
DEPLOY_PARAMS="${DEPLOY_PARAMS} --s3-bucket ${BUCKET_NAME}-sam-artifacts"
DEPLOY_PARAMS="${DEPLOY_PARAMS} --capabilities CAPABILITY_IAM"
DEPLOY_PARAMS="${DEPLOY_PARAMS} --parameter-overrides"
DEPLOY_PARAMS="${DEPLOY_PARAMS} Environment=${ENVIRONMENT}"
DEPLOY_PARAMS="${DEPLOY_PARAMS} DocumentBucketName=${BUCKET_NAME}"

if [ ! -z "$OPENAI_API_KEY" ]; then
    DEPLOY_PARAMS="${DEPLOY_PARAMS} OpenAIApiKey=${OPENAI_API_KEY}"
fi

# Create S3 bucket for SAM artifacts if it doesn't exist
aws s3 mb s3://${BUCKET_NAME}-sam-artifacts 2>/dev/null || echo "S3 bucket already exists"

# Deploy with parameters
if sam deploy ${DEPLOY_PARAMS}; then
    echo "✅ Deployment completed successfully!"
    
    # Get stack outputs
    echo ""
    echo "📋 Stack Outputs:"
    echo "=================="
    aws cloudformation describe-stacks \
        --stack-name vpflow-lambda-${ENVIRONMENT} \
        --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
        --output table
        
else
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "🎉 VPFlow Lambda functions deployed successfully!"
echo "You can now test the API endpoints using the provided API Gateway URL."
