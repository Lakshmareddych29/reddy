require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend')); // if serving frontend from Express

// Basic API: create/list notes
app.post('/api/notes', async (req,res) => {
  try {
    const {title, content} = req.body;
    const [result] = await pool.execute(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [title, content]
    );
    res.json({id: result.insertId, title, content});
  } catch(err){
    console.error(err);
    res.status(500).json({error:'server error'});
  }
});

app.get('/api/notes', async (req,res) => {
  try {
    const [rows] = await pool.execute('SELECT id, title, content, created_at FROM notes ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch(err){
    console.error(err);
    res.status(500).json({error:'server error'});
  }
});

app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
