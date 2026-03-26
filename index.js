require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

// This sends your database info to the website
app.get('/api/me', (req, res) => {
    db.query('SELECT * FROM my_portfolio LIMIT 1', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0]);
    });
});

app.use(express.static('public'));

app.listen(3000, () => console.log('Server: http://localhost:3000'));