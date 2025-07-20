# VPFlow Lambda Deployment (PowerShell)
# This script helps deploy the VPFlow Lambda functions to AWS on Windows

param(
    [string]$Environment = "dev",
    [string]$OpenAIApiKey = "",
    [string]$BucketName = "vpflow-documents"
)

Write-Host "🚀 VPFlow Lambda Deployment Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is required but not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if SAM CLI is installed
try {
    sam --version | Out-Null
    Write-Host "✅ SAM CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS SAM CLI is required but not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if Python is installed
try {
    python --version | Out-Null
    Write-Host "✅ Python found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python 3.9+ is required but not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Get user input if not provided as parameters
if ($Environment -eq "") {
    $Environment = Read-Host "Enter environment (dev/staging/prod) [dev]"
    if ($Environment -eq "") { $Environment = "dev" }
}

if ($OpenAIApiKey -eq "") {
    $OpenAIApiKey = Read-Host "Enter OpenAI API Key (optional, press Enter to skip)" -AsSecureString
    $OpenAIApiKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($OpenAIApiKey))
}

if ($BucketName -eq "") {
    $BucketName = Read-Host "Enter S3 bucket name for documents [vpflow-documents]"
    if ($BucketName -eq "") { $BucketName = "vpflow-documents" }
}

# Validate AWS credentials
Write-Host "Validating AWS credentials..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS credentials validated" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS credentials not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Build the SAM application
Write-Host "Building SAM application..." -ForegroundColor Yellow
try {
    sam build
    Write-Host "✅ SAM build completed" -ForegroundColor Green
} catch {
    Write-Host "❌ SAM build failed" -ForegroundColor Red
    exit 1
}

# Deploy the application
Write-Host "Deploying to AWS..." -ForegroundColor Yellow

$stackName = "vpflow-lambda-$Environment"
$artifactsBucket = "$BucketName-sam-artifacts"

# Create S3 bucket for SAM artifacts if it doesn't exist
try {
    aws s3 mb "s3://$artifactsBucket" 2>$null
} catch {
    Write-Host "S3 bucket already exists or creation failed (continuing...)" -ForegroundColor Yellow
}

# Build deployment parameters
$deployParams = @(
    "--stack-name", $stackName,
    "--s3-bucket", $artifactsBucket,
    "--capabilities", "CAPABILITY_IAM",
    "--parameter-overrides",
    "Environment=$Environment",
    "DocumentBucketName=$BucketName"
)

if ($OpenAIApiKey -ne "") {
    $deployParams += "OpenAIApiKey=$OpenAIApiKey"
}

# Deploy with parameters
try {
    & sam deploy @deployParams
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    
    # Get stack outputs
    Write-Host ""
    Write-Host "📋 Stack Outputs:" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    
    aws cloudformation describe-stacks --stack-name $stackName --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' --output table
    
} catch {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 VPFlow Lambda functions deployed successfully!" -ForegroundColor Green
Write-Host "You can now test the API endpoints using the provided API Gateway URL." -ForegroundColor Yellow
