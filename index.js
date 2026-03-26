require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json()); // Allows the server to read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

// GET: Fetch your profile info
app.get('/api/profile', (req, res) => {
    db.query('SELECT * FROM profile LIMIT 1', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// POST: Save a new contact message
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = 'INSERT INTO messages (sender_name, sender_email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) return res.status(500).send("Error saving message");
        res.send("<h1>Message Sent!</h1><a href='/'>Go Back</a>");
    });
});

app.listen(3000, () => console.log('Portfolio running at http://localhost:3000'));