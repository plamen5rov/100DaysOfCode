const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'blog',
    password: 'MySQL2022!'
  });

  module.exports = pool;