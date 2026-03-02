require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');

const { sequelize, User, Application } = require('./db');

// test connection early
sequelize.authenticate()
  .then(() => console.log('Database connection established.'))
  .catch(err => console.warn('Database connection error (continuing):', err.message));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static files served from project root (for simplicity)
app.use(express.static(path.join(__dirname, '../')));

// enable CORS for development, allow credentials
app.use(cors({ origin: true, credentials: true }));

// set up session store with sequelize
const store = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));
store.sync();

// mount API routers
const authRouter = require('./routes/auth');
const appsRouter = require('./routes/applications');

app.use('/api', authRouter);
app.use('/api/applications', appsRouter);

// note: `/api/me` is included in authRouter


// fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});