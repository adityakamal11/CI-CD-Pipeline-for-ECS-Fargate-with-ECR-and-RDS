# CI-CD-Pipeline-for-ECS-Fargate-with-ECR-and-RDS

In this project, we will deploy a Dockerized Node.js application on AWS ECS Fargate. We'll use Amazon RDS for database management and configure a CI/CD pipeline using AWS CodePipeline and AWS CodeBuild to automate the deployment of Docker images to Fargate. The application will communicate with the RDS database.

This architecture leverages serverless compute for containers using Fargate, allowing seamless scalability and management without worrying about the underlying infrastructure.

# Prerequisites
An AWS Account with necessary permissions.
AWS CLI installed and configured.
Docker installed locally.
GitHub repository for storing application code.
Basic knowledge of Docker, Node.js, and AWS Services.

# Step 1: Setting Up Dockerized Application
In this step, we will create a simple Node.js application and Dockerize it.

1.1. Create a Node.js Application
