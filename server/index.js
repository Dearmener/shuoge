const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const foodEntriesRouter = require('./routes/foodEntries');

const app = express();
const port = process.env.PORT || 3331;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 初始化数据库表
const initDatabase = async () => {
  try {
    // 创建表
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS food_entries (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      average_cost DECIMAL(10,2),
      review TEXT,
      image_url TEXT,
      recommended_by VARCHAR(255),
      visit_date DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await db.query(createTableSQL);

    // 检查列是否存在
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
    `, [process.env.DB_NAME, 'food_entries', 'average_cost']);

    // 如果列不存在，添加它
    if (columns.length === 0) {
      const alterTableSQL = `
      ALTER TABLE food_entries
      ADD COLUMN average_cost DECIMAL(10,2) AFTER rating;
      `;
      await db.query(alterTableSQL);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// 路由
app.use('/api/food-entries', foodEntriesRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
