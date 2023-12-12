const mysql = require('mysql2');
const express = require('express');

function connectToSql(host, username, password, databaseName) {
  const app = express();
  const port = 5000;

  const pool = mysql.createPool({
    host: host,
    user: username,
    password: password,
    database: databaseName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }

    console.log('Connected to MySQL!');
    connection.release();
  });

  pool.on('error', (err) => {
    console.error('MySQL Pool Error:', err);
  });

  process.on('exit', () => {
    pool.end();
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    pool.end(() => process.exit(1));
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    pool.end(() => process.exit(1));
  });

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  return app;
}

module.exports = {connectToSql};
