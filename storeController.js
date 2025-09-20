 // controllers/storeController.js
const pool = require('../config/db');

// Helpers
const NAME_MIN = 1; // store name length was enforced earlier at DB; keep minimal here
const NAME_MAX = 60;

const getStores = async (req, res) => {
  try {
    const userId = req.user.id; // authenticated user
    const {
      name,
      address,
      sortBy = 'name',
      sortOrder = 'asc',
      limit = 100,
      offset = 0
    } = req.query;

    const allowedSort = {
      name: 's.name',
      email: 's.email',
      address: 's.address',
      avg_rating: 'overall_rating'
    };
    const orderCol = allowedSort[sortBy] || allowedSort['name'];
    const orderDir = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // params start with userId so subquery for user's rating can use $1
    const params = [userId];

    let sql = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
             u.name AS owner_name,
             COALESCE(sr.avg_rating, 0)::numeric(10,2) AS overall_rating,
             ur.user_rating
      FROM stores s
      LEFT JOIN users u ON u.id = s.owner_id
      LEFT JOIN (
        SELECT store_id, AVG(rating) AS avg_rating
        FROM ratings
        GROUP BY store_id
      ) sr ON sr.store_id = s.id
      LEFT JOIN (
        SELECT store_id, rating AS user_rating
        FROM ratings
        WHERE user_id = $1
      ) ur ON ur.store_id = s.id
      WHERE 1=1
    `;

    if (name) {
      params.push(`%${name}%`);
      sql += ` AND s.name ILIKE $${params.length}`;
    }
    if (address) {
      params.push(`%${address}%`);
      sql += ` AND s.address ILIKE $${params.length}`;
    }

    // push pagination
    params.push(limit);
    params.push(offset);
    sql += ` ORDER BY ${orderCol} ${orderDir} LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getStores err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStoreById = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.id;

    const sql = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id, u.name AS owner_name,
             COALESCE(sr.avg_rating,0)::numeric(10,2) AS overall_rating,
             ur.user_rating
      FROM stores s
      LEFT JOIN users u ON u.id = s.owner_id
      LEFT JOIN (
        SELECT store_id, AVG(rating) AS avg_rating
        FROM ratings
        GROUP BY store_id
      ) sr ON sr.store_id = s.id
      LEFT JOIN (
        SELECT store_id, rating AS user_rating
        FROM ratings
        WHERE user_id = $1
      ) ur ON ur.store_id = s.id
      WHERE s.id = $2
      LIMIT 1
    `;
    const result = await pool.query(sql, [userId, storeId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Store not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getStoreById err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id, 10);
    const { rating } = req.body;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    // Ensure store exists
    const storeQ = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeQ.rows.length === 0) return res.status(404).json({ message: 'Store not found' });

    // Check if user already submitted rating
    const existing = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Rating already exists. Use PUT to modify.' });
    }

    // Insert rating
    const insert = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1,$2,$3) RETURNING id, rating',
      [userId, storeId, rating]
    );

    // Get updated average
    const avgQ = await pool.query('SELECT COALESCE(AVG(rating),0)::numeric(10,2) AS avg_rating FROM ratings WHERE store_id = $1', [storeId]);

    res.status(201).json({
      message: 'Rating submitted',
      rating: insert.rows[0],
      overall_rating: avgQ.rows[0].avg_rating
    });
  } catch (err) {
    console.error('submitRating err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const modifyRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = parseInt(req.params.id, 10);
    const { rating } = req.body;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    // Ensure rating exists for this user & store
    const existing = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'No existing rating found. Use POST to submit one.' });
    }

    const upd = await pool.query(
      'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3 RETURNING id, rating',
      [rating, userId, storeId]
    );

    const avgQ = await pool.query('SELECT COALESCE(AVG(rating),0)::numeric(10,2) AS avg_rating FROM ratings WHERE store_id = $1', [storeId]);

    res.json({
      message: 'Rating updated',
      rating: upd.rows[0],
      overall_rating: avgQ.rows[0].avg_rating
    });
  } catch (err) {
    console.error('modifyRating err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStores, getStoreById, submitRating, modifyRating };

