<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>27BPMM SERVER</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0e0e0e;
      --surface: #161616;
      --surface2: #1f1f1f;
      --border: rgba(255,255,255,0.08);
      --text: #f0ede8;
      --muted: rgba(240,237,232,0.45);
      --accent: #c8f060;
      --accent-dim: rgba(200,240,96,0.12);
      --danger: #ff5f57;
      --radius: 12px;
    }

    body {
      font-family: 'Syne', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }

    /* ── AUTH ── */
    #auth-screen {
      width: 100%;
      max-width: 380px;
      animation: fadeUp 0.4s ease both;
    }

    .auth-logo {
      font-size: 13px;
      font-family: 'DM Mono', monospace;
      color: var(--accent);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .auth-tabs {
      display: flex;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .auth-tab {
      flex: 1;
      padding: 10px;
      background: none;
      border: none;
      color: var(--muted);
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .auth-tab.active {
      background: var(--surface2);
      color: var(--text);
    }

    .auth-form { display: flex; flex-direction: column; gap: 12px; }

    .auth-form input {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      color: var(--text);
      font-family: 'DM Mono', monospace;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .auth-form input:focus { border-color: var(--accent); }
    .auth-form input::placeholder { color: var(--muted); }

    .btn-primary {
      background: var(--accent);
      color: #0e0e0e;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 4px;
      transition: opacity 0.2s, transform 0.1s;
    }

    .btn-primary:hover { opacity: 0.88; }
    .btn-primary:active { transform: scale(0.98); }

    .auth-error {
      font-size: 13px;
      font-family: 'DM Mono', monospace;
      color: var(--danger);
      text-align: center;
      min-height: 20px;
    }

    /* ── APP ── */
    #app-screen {
      display: none;
      width: 100%;
      max-width: 480px;
      animation: fadeUp 0.4s ease both;
    }

    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 3rem;
    }

    .user-badge {
      font-family: 'DM Mono', monospace;
      font-size: 12px;
      color: var(--muted);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 5px 14px;
    }

    .user-badge span { color: var(--accent); }

    .btn-logout {
      background: none;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      font-size: 12px;
      padding: 5px 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-logout:hover { color: var(--danger); border-color: var(--danger); }

    .counter-display {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .counter-label {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .counter-number {
      font-size: clamp(80px, 20vw, 120px);
      font-weight: 800;
      line-height: 1;
      color: var(--text);
      font-variant-numeric: tabular-nums;
      transition: transform 0.12s ease, color 0.2s;
    }

    .counter-number.bump {
      transform: scale(1.06);
      color: var(--accent);
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 1.5rem;
    }

    .controls input {
      flex: 1;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0 16px;
      height: 46px;
      color: var(--text);
      font-family: 'DM Mono', monospace;
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s;
      text-align: center;
    }

    .controls input:focus { border-color: var(--accent); }
    .controls input::placeholder { color: var(--muted); }

    .btn-add {
      height: 46px;
      padding: 0 22px;
      background: var(--accent);
      color: #0e0e0e;
      border: none;
      border-radius: 8px;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.2s, transform 0.1s;
    }

    .btn-add:hover { opacity: 0.88; }
    .btn-add:active { transform: scale(0.97); }

    .btn-reset {
      height: 46px;
      padding: 0 16px;
      background: none;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-reset:hover { color: var(--danger); border-color: var(--danger); }

    /* History */
    .history-title {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 240px;
      overflow-y: auto;
    }

    .history-list::-webkit-scrollbar { width: 4px; }
    .history-list::-webkit-scrollbar-track { background: transparent; }
    .history-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    .history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      animation: fadeUp 0.2s ease both;
    }

    .h-added {
      font-family: 'DM Mono', monospace;
      font-size: 13px;
      color: var(--accent);
    }

    .h-total {
      font-family: 'DM Mono', monospace;
      font-size: 13px;
      color: var(--muted);
    }

    .h-date {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      color: rgba(240,237,232,0.25);
    }

    .empty-history {
      font-family: 'DM Mono', monospace;
      font-size: 12px;
      color: rgba(240,237,232,0.2);
      text-align: center;
      padding: 1.5rem 0;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

<!-- AUTH -->
<div id="auth-screen">
  <p class="auth-logo">⬡ SOP DO ZUBACZ</p>

  <div class="auth-tabs">
    <button class="auth-tab active" id="tab-login" onclick="switchTab('login')">Entrar</button>
    <button class="auth-tab" id="tab-register" onclick="switchTab('register')">Criar conta</button>
  </div>

  <div class="auth-form">
    <input type="text" id="auth-user" placeholder="usuário" autocomplete="username" />
    <input type="password" id="auth-pass" placeholder="senha" autocomplete="current-password" />
    <p class="auth-error" id="auth-error"></p>
    <button class="btn-primary" id="auth-btn" onclick="submitAuth()">Entrar</button>
  </div>
</div>

<!-- APP -->
<div id="app-screen">
  <div class="app-header">
    <div class="user-badge">olá, <span id="username-display">—</span></div>
    <button class="btn-logout" onclick="logout()">sair</button>
  </div>

  <div class="counter-display">
    <p class="counter-label">contador</p>
    <div class="counter-number" id="counter-num">0</div>
  </div>

  <div class="controls">
    <input type="number" id="add-val" placeholder="valor (padrão: 1)" min="1" />
    <button class="btn-add" onclick="addValue()">+ adicionar</button>
    <button class="btn-reset" onclick="resetCounter()" title="Zerar">↺</button>
  </div>

  <p class="history-title">histórico</p>
  <div class="history-list" id="history-list">
    <p class="empty-history">nenhuma adição ainda.</p>
  </div>
</div>

<script>
  const API = '';
  let token = localStorage.getItem('token') || null;
  let mode = 'login';

  function switchTab(t) {
    mode = t;
    document.getElementById('tab-login').classList.toggle('active', t === 'login');
    document.getElementById('tab-register').classList.toggle('active', t === 'register');
    document.getElementById('auth-btn').textContent = t === 'login' ? 'Entrar' : 'Criar conta';
    document.getElementById('auth-error').textContent = '';
  }

  async function submitAuth() {
    const username = document.getElementById('auth-user').value.trim();
    const password = document.getElementById('auth-pass').value;
    const errEl = document.getElementById('auth-error');
    errEl.textContent = '';

    if (!username || !password) { errEl.textContent = 'Preencha todos os campos.'; return; }

    const endpoint = mode === 'login' ? '/api/login' : '/api/register';
    try {
      const res = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { errEl.textContent = data.error || 'Erro.'; return; }
      token = data.token;
      localStorage.setItem('token', token);
      document.getElementById('username-display').textContent = data.username;
      showApp();
      loadCounter();
    } catch {
      errEl.textContent = 'Erro de conexão com o servidor.';
    }
  }

  document.getElementById('auth-pass').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAuth();
  });

  document.getElementById('add-val').addEventListener('keydown', e => {
    if (e.key === 'Enter') addValue();
  });

  function showApp() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
  }

  function showAuth() {
    document.getElementById('auth-screen').style.display = 'block';
    document.getElementById('app-screen').style.display = 'none';
  }

  function logout() {
    localStorage.removeItem('token');
    token = null;
    showAuth();
  }

  async function loadCounter() {
    try {
      const res = await fetch(API + '/api/counter', { headers: { Authorization: 'Bearer ' + token } });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      document.getElementById('counter-num').textContent = data.value;

      // decode username from token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        document.getElementById('username-display').textContent = payload.username;
      } catch {}

      renderHistory(data.history);
    } catch {
      console.error('Erro ao carregar contador.');
    }
  }

  async function addValue() {
    const raw = document.getElementById('add-val').value.trim();
    const n = raw === '' ? 1 : parseInt(raw);
    if (isNaN(n) || n <= 0) return;

    const res = await fetch(API + '/api/counter/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ value: n })
    });
    if (res.status === 401) { logout(); return; }
    const data = await res.json();
    const el = document.getElementById('counter-num');
    el.textContent = data.value;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
    document.getElementById('add-val').value = '';
    loadCounter();
  }

  async function resetCounter() {
    if (!confirm('Zerar o contador e apagar o histórico?')) return;
    const res = await fetch(API + '/api/counter/reset', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.status === 401) { logout(); return; }
    document.getElementById('counter-num').textContent = '0';
    renderHistory([]);
  }

  function renderHistory(list) {
    const el = document.getElementById('history-list');
    if (!list || list.length === 0) {
      el.innerHTML = '<p class="empty-history">nenhuma adição ainda.</p>';
      return;
    }
    el.innerHTML = list.map(h => {
      const d = new Date(h.created_at);
      const fmt = d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
      return `<div class="history-item">
        <span class="h-added">+${h.added}</span>
        <span class="h-total">total: ${h.total_after}</span>
        <span class="h-date">${fmt}</span>
      </div>`;
    }).join('');
  }

  // Auto-login se token existir
  if (token) { showApp(); loadCounter(); }
</script>
</body>
</html>
