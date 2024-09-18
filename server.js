// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handle voting POST request
app.post('/vote', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        // Insert into the database
        const query = `INSERT INTO votes (email, password) VALUES (?, ?)`;
        db.query(query, [email, password], (err, result) => {
            if (err) {
                console.error('Error inserting into database:', err.message);
                res.status(500).send('Failed to submit vote.');
            } else {
                console.log('Data inserted successfully:', result);
                res.status(200).send('Vote submitted successfully.');
            }
        });
    } else {
        res.status(400).send('Invalid input.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
