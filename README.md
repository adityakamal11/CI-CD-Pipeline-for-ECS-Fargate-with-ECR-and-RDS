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
