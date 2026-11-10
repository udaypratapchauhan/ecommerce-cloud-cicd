const pool = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  const { title, price, description, stock } = req.body;

  if (!title || price === undefined) {
    return res.status(400).json({ error: 'Title and price are required' });
  }

  try {
    const query = `
      INSERT INTO products (title, price, description, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [title, price, description || '', stock || 0];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  createProduct,
};

