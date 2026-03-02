require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// choose dialect based on environment (sqlite for quick local dev)
// default to sqlite unless DB_DIALECT explicitly set to mysql
const dialect = process.env.DB_DIALECT || 'sqlite';
let sequelize;
if (dialect === 'sqlite') {
  const storage = process.env.DB_FILE || 'database.sqlite';
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false,
  });
} else {
  // try mysql, but if it fails we'll log and fall back to sqlite
  try {
    sequelize = new Sequelize(process.env.DB_NAME || 'scool', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
    });
  } catch (err) {
    console.warn('MySQL initialization failed, falling back to SQLite:', err.message);
    const storage = process.env.DB_FILE || 'database.sqlite';
    sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
  }
}

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false }
});

const Application = sequelize.define('Application', {
  student_name: { type: DataTypes.STRING },
  date_of_birth: { type: DataTypes.DATEONLY },
  grade_applying: { type: DataTypes.STRING },
  parent_name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  previous_school: { type: DataTypes.STRING },
  documents_info: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  submitted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = { sequelize, User, Application };