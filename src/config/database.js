const { Sequelize } = require('sequelize');
require('dotenv').config();

const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;

const connectionString = process.env.NODE_ENV === 'production' ? prodConnection : devConnection;

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
