const app = require('./app');
const sequelize = require('./config/database');
const port = process.env.PORT || 3000;

// Handle uncaught exceptions and rejections
process.on('unhandledRejection', (err) => {
    console.log(`Logged Error: ${err}`);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log(`Logged Error: ${err}`);
    process.exit(1);
});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables synced');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Sync error:', err));