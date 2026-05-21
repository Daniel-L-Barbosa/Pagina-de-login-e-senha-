const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'contador_secret_key_mude_em_producao';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados SQLite
const db = new sqlite3.Database('./contador.db', (err) => {
  if (err) console.error('Erro ao abrir banco:', err.message);
  else console.log('Banco de dados conectado.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS counter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    added INTEGER NOT NULL,
    total_after INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Middleware de autenticação
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido.' });
  }
}

// Registro
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Preencha todos os campos.' });
  if (password.length < 4) return res.status(400).json({ error: 'Senha deve ter ao menos 4 caracteres.' });

  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
    if (err) return res.status(409).json({ error: 'Usuário já existe.' });
    const userId = this.lastID;
    db.run('INSERT INTO counter (user_id, value) VALUES (?, 0)', [userId]);
    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  });
});

// Buscar contador + histórico
app.get('/api/counter', auth, (req, res) => {
  db.get('SELECT value FROM counter WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar contador.' });
    const value = row ? row.value : 0;
    if (!row) db.run('INSERT INTO counter (user_id, value) VALUES (?, 0)', [req.user.id]);

    db.all(
      'SELECT added, total_after, created_at FROM history WHERE user_id = ? ORDER BY id DESC LIMIT 20',
      [req.user.id],
      (err2, history) => {
        res.json({ value, history: history || [] });
      }
    );
  });
});

// Adicionar valor ao contador
app.post('/api/counter/add', auth, (req, res) => {
  const n = parseInt(req.body.value) || 1;
  if (n <= 0) return res.status(400).json({ error: 'Valor deve ser positivo.' });

  db.get('SELECT value FROM counter WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro.' });
    const current = row ? row.value : 0;
    const newVal = current + n;

    db.run('UPDATE counter SET value = ? WHERE user_id = ?', [newVal, req.user.id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Erro ao atualizar.' });
      db.run(
        'INSERT INTO history (user_id, added, total_after) VALUES (?, ?, ?)',
        [req.user.id, n, newVal],
        () => res.json({ value: newVal })
      );
    });
  });
});

// Resetar contador
app.post('/api/counter/reset', auth, (req, res) => {
  db.run('UPDATE counter SET value = 0 WHERE user_id = ?', [req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao resetar.' });
    db.run('DELETE FROM history WHERE user_id = ?', [req.user.id], () => {
      res.json({ value: 0 });
    });
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
