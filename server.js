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
    res.send('Today Date is 03rd Jan 2025 <br> App running on ECS Fargate with RDS!');
});

app.listen(80, () => {
    console.log('Server running on port 80');
});
