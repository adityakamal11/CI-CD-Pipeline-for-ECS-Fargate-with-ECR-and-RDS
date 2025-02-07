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
```
mkdir fargate-app
cd fargate-app
npm init -y
npm install express mysql
```
1.2. Application Code
Create a server.js file with the following code:
```
const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.send('App running on ECS Fargate with RDS!');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```
1.3. Create Dockerfile
```
touch Dockerfile
```
Add the following contents to the Dockerfile:
```
FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```
1.4. Build Docker Image Locally
```
docker build -t fargate-app .
```
Test the application locally by running:
```
docker run -p 3000:3000 fargate-app
```

# Step 2: Creating an ECR Repository
To deploy the Docker image on ECS Fargate, you need to store the image in Amazon Elastic Container Registry (ECR).

2.1. Create ECR Repository
```
aws ecr create-repository --repository-name fargate-app
```
2.2. Authenticate Docker to ECR
```
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
```
2.3. Tag and Push Docker Image to ECR
```
docker tag fargate-app:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/fargate-app:latest
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/fargate-app:latest
```

# Step 3: Launching an RDS Database
3.1. Create an RDS Instance
```
Go to AWS Management Console > RDS > Create Database.
Choose MySQL as the engine.
Select the free-tier option and configure the database name, username, and password.
```
3.2. Note Down RDS Endpoint
```
Once the RDS instance is available, note the Endpoint URL, which will be used in the application code.
```
# Step 4: Setting Up ECS Fargate
4.1. Create a Task Definition
```
Go to ECS Console > Task Definitions > Create New Task Definition.
Choose Fargate as the launch type.
Add a container and specify the Docker image URL from ECR.
```
4.2. Set Environment Variables
```
Add the following environment variables for connecting to the RDS database:

DB_HOST: Your RDS endpoint.
DB_USER: Database username.
DB_PASS: Database password.
DB_NAME: Database name.
```
4.3. Create an ECS Cluster
```
Go to ECS Console > Clusters > Create Cluster.
Choose Networking Only for Fargate.
Name your cluster (e.g., fargate-cluster).
```
4.4. Create a Service
```
Go to ECS Cluster > Create Service.
Choose the task definition created earlier.
Configure the service with desired tasks, load balancers, and VPC settings.
```
# Step 5: Creating a CI/CD Pipeline Using CodePipeline
We’ll now automate the deployment process using AWS CodePipeline.

5.1. Create an IAM Role for CodePipeline
```
Ensure your pipeline has the necessary permissions to interact with ECS, ECR, and CodeBuild.
```
5.2. BuildSpec for CodeBuild
Create a buildspec.yml file in the root of your repository to define build instructions:
```
version: 0.2

phases:
  install:
    commands:
      - echo "Installing dependencies"
      - npm install
  pre_build:
    commands:
      - echo "Logging into Amazon ECR"
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
  build:
    commands:
      - echo "Building Docker image"
      - docker build -t fargate-app .
      - docker tag fargate-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/fargate-app:latest
  post_build:
    commands:
      - echo "Pushing Docker image to ECR"
      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/fargate-app:latest
artifacts:
  files:
    - "**/*"
```
5.3. Creating the Pipeline
```
Go to CodePipeline > Create Pipeline.
Set up the Source Stage with your GitHub repository.
Add a Build Stage using AWS CodeBuild.
Add a Deploy Stage to update your ECS Fargate service with the new image.
```
# Step 6: Testing the Deployment

6.1. Push Code to GitHub
Commit and push the code changes to GitHub:
```
git add .
git commit -m "Initial commit for ECS Fargate app"
git push origin main
```
6.2. Verify Pipeline Execution
Once the code is pushed, the CodePipeline will be triggered, building the Docker image, pushing it to ECR, and deploying it to ECS Fargate.

# Monitoring and Logging with CloudWatch
7.1. ECS Fargate Logging
AWS Fargate integrates with CloudWatch Logs, allowing you to monitor application logs directly. Check the logs by going to **CloudWatch** > Logs.

7.2. Set up CloudWatch Alarms
```
Go to CloudWatch Console > Alarms.
Create alarms for CPU, memory usage, or log error patterns to ensure proper monitoring.
```

# Conclusion
In this project, you’ve built a complete DevOps pipeline on AWS, deploying a Dockerized Node.js application using ECS Fargate, RDS, and ECR. You’ve also automated the deployment process using CodePipeline and CodeBuild, integrating robust monitoring via CloudWatch. This setup is scalable, resilient, and adheres to modern DevOps practices.
