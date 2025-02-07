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
