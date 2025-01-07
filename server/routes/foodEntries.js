const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 获取所有美食记录
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM food_entries ORDER BY visit_date DESC'
    );
    res.json({ data: rows });
  } catch (error) {
    console.error('Error getting entries:', error);
    res.status(500).json({ message: error.message });
  }
});

// 创建新的美食记录
router.post('/', async (req, res) => {
  try {
    const { id, name, location, rating, review, imageUrl, recommendedBy, visitDate } = req.body;
    console.log('Received data:', req.body);

    const [result] = await db.query(
      `INSERT INTO food_entries (id, name, location, rating, review, image_url, recommended_by, visit_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, location, rating, review, imageUrl, recommendedBy, new Date(visitDate)]
    );

    const [newEntry] = await db.query(
      'SELECT * FROM food_entries WHERE id = ?',
      [id]
    );

    console.log('Saved entry:', newEntry[0]);
    res.status(201).json({ data: newEntry[0] });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(400).json({ message: error.message });
  }
});

// 删除美食记录
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM food_entries WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '记录未找到' });
    }

    res.json({ message: '记录已删除' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
