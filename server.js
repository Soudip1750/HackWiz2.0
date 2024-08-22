const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Your database username
    password: 'Soudip@2004',      // Your database password
    database: 'museum_chatbot'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Create new user
app.post('/create-user', (req, res) => {
    const username = req.body.username || 'Anonymous';
    const query = 'INSERT INTO users (username) VALUES (?)';
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        res.send({ userId: result.insertId });
    });
});

// Save chat message
app.post('/save-message', (req, res) => {
    const { userId, sender, message } = req.body;
    const query = 'INSERT INTO chat_history (user_id, sender, message) VALUES (?, ?, ?)';
    db.query(query, [userId, sender, message], (err, result) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

// Get chat history
app.get('/chat-history/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM chat_history WHERE user_id = ? ORDER BY timestamp';
    db.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
