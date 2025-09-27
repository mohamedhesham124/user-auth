require('dotenv').config()


const express = require('express');
const cors = require('cors');
const { default: helmet } = require('helmet');
const errorHandler = require('./middlewares/error.handler');
const path = require('path');

// Import routes
const usersRoute = require('./routes/user.route');


const app = express();
const sequelize = require('./config/database');
const port =  process.env.PORT ||  3000;


// Error handling
process.on('unhandledRejection', (err) => {
    console.log(`Logged Error: ${err}`);
    process.exit(1);
});

process.on('uncaughtException', (err)  => {
    console.log(`Logged Error: ${err}`);
    process.exit(1);
});

// 3rd party Middleware
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Custom middleware

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use routes
app.use('/api/v1/user', usersRoute);

// error handling middleware
app.use(errorHandler);

sequelize.sync({ alter: true }) // or { force: true } for development only
  .then(() => console.log('Database & tables synced'))
  .catch(err => console.error('Sync error:', err));
  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api/v1`);
});
