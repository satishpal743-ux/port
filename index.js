require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Middleware to handle form data and JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the 'public' folder (this is where your index.html lives)
app.use(express.static('public'));

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to TiDB Cloud!');
});

// 1. GET: Fetch ALL profile data (Name, Major, About, Skills, Experience, Achievements, Projects)
app.get('/api/profile', (req, res) => {
    const sql = 'SELECT * FROM profile LIMIT 1';
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result[0]);
    });
});

// 2. POST: Handle Contact Form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = 'INSERT INTO messages (sender_name, sender_email, message) VALUES (?, ?, ?)';
    
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("<h1>Error saving message</h1>");
        }
        // Redirect back to home after success
        res.send(`
            <div style="text-align:center; padding:50px; font-family:sans-serif;">
                <h1>Message Sent Successfully, Satish!</h1>
                <p>Your visitor's data is now in TiDB.</p>
                <a href="/">Return to Portfolio</a>
            </div>
        `);
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});