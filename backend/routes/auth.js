const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../db');

const router = express.Router();

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid login' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid login' });
    req.session.userId = user.id;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;