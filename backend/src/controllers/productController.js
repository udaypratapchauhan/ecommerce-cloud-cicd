const db = require('../config/db');
const pool = db.pool || db;

const getProducts = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  const { title, category, price, original_price, description, image_url, rating, rating_count, stock } = req.body;
  if (!title || price === undefined) {
    return res.status(400).json({ error: 'Title and price are required' });
  }
  try {
    const query = 'INSERT INTO products (title, category, price, original_price, description, image_url, rating, rating_count, stock) VALUES (, , , , , , , , ) RETURNING *';
    const values = [title, category || 'General', price, original_price || null, description || '', image_url || '', rating || 4.5, rating_count || 0, stock !== undefined ? stock : 20];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getProducts, createProduct };
