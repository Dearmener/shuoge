const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'food_entries',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 转换为 Promise 接口
const promisePool = pool.promise();

module.exports = promisePool;
