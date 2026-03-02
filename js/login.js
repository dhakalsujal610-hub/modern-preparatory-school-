document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('error-msg');
  errEl.classList.add('hidden');
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });
    if (res.ok) {
      window.location.href = '/admin.html';
    } else {
      const data = await res.json();
      errEl.textContent = data.error || 'Login failed';
      errEl.classList.remove('hidden');
    }
  } catch (err) {
    console.error(err);
    errEl.textContent = 'Network error';
    errEl.classList.remove('hidden');
  }
});