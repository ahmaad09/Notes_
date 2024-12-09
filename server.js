const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Konfigurasi database
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

// Koneksi ke database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Endpoint untuk membuat notes baru
app.post('/notes', (req, res) => {
    const { title, datetime, note } = req.body;
    const sql = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
    db.query(sql, [title, datetime, note], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Note created', id: result.insertId });
    });
});

// Endpoint untuk menampilkan semua notes
app.get('/notes', (req, res) => {
    const sql = 'SELECT * FROM notes';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
    });
});

// Endpoint untuk menampilkan salah satu note
app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM notes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) return res.status(404).json({ message: 'Note not found' });
        res.status(200).json(result[0]);
    });
});

// Endpoint untuk mengubah note
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, datetime, note } = req.body;
    const sql = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
    db.query(sql, [title, datetime, note, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
        res.status(200).json({ message: 'Note updated' });
    });
});

// Endpoint untuk menghapus note
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
        res.status(200).json({ message: 'Note deleted' });
    });
});

// Jalankan server
const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
