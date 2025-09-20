// controllers/adminController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Helpers: basic validation
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
const NAME_MIN = 20;
const NAME_MAX = 60;

const addUser = async (req, res) => {
  try {
    const { name, email, password, address = null, role = 'user' } = req.body;

    if (!name || name.length < NAME_MIN || name.length > NAME_MAX) {
      return res.status(400).json({ message: `Name must be ${NAME_MIN}-${NAME_MAX} characters` });
    }
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and a special char' });
    }
    if (!['admin', 'user', 'owner'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin, user, or owner' });
    }

    // Check unique email
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const insert = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, address, role`,
      [name, email, hashed, address, role]
    );
    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error('addUser err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addStore = async (req, res) => {
  try {
    const { name, email, address = null, owner_id = null } = req.body;

    if (!name || name.length < NAME_MIN || name.length > NAME_MAX) {
      return res.status(400).json({ message: `Store name must be ${NAME_MIN}-${NAME_MAX} characters` });
    }
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Optional: if owner_id provided, verify owner exists and has role 'owner'
    if (owner_id) {
      const ownerQ = await pool.query('SELECT id, role FROM users WHERE id = $1', [owner_id]);
      if (ownerQ.rows.length === 0) {
        return res.status(400).json({ message: 'owner_id does not exist' });
      }
      if (ownerQ.rows[0].role !== 'owner') {
        return res.status(400).json({ message: 'Provided user is not a store owner (role must be owner)' });
      }
    }

    // Check unique store email
    const exists = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(400).json({ message: 'Store email already exists' });

    const insert = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1,$2,$3,$4) RETURNING id, name, email, address, owner_id`,
      [name, email, address, owner_id]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error('addStore err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const usersQ = await pool.query('SELECT COUNT(*) FROM users');
    const storesQ = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingsQ = await pool.query('SELECT COUNT(*) FROM ratings');

    res.json({
      total_users: parseInt(usersQ.rows[0].count, 10),
      total_stores: parseInt(storesQ.rows[0].count, 10),
      total_ratings: parseInt(ratingsQ.rows[0].count, 10)
    });
  } catch (err) {
    console.error('getDashboard err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /admin/users  (supports filtering and sorting)
const getUsers = async (req, res) => {
  try {
    const {
      name, email, address, role,
      sortBy = 'name', sortOrder = 'asc',
      limit = 100, offset = 0
    } = req.query;

    // allowlist for sortBy
    const allowedSort = {
      name: 'u.name',
      email: 'u.email',
      address: 'u.address',
      role: 'u.role',
      owner_rating: 'owner_rating'
    };
    const orderCol = allowedSort[sortBy] || allowedSort['name'];
    const orderDir = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Base query: include owner average rating (avg of ratings across stores owned by user)
    let sql = `
      SELECT u.id, u.name, u.email, u.address, u.role,
             COALESCE(ar.avg_rating, 0)::numeric(10,2) AS owner_rating
      FROM users u
      LEFT JOIN (
        SELECT s.owner_id, AVG(r.rating) AS avg_rating
        FROM stores s
        LEFT JOIN ratings r ON r.store_id = s.id
        GROUP BY s.owner_id
      ) ar ON ar.owner_id = u.id
      WHERE 1=1
    `;

    const params = [];
    if (name) { params.push(`%${name}%`); sql += ` AND u.name ILIKE $${params.length}`; }
    if (email) { params.push(`%${email}%`); sql += ` AND u.email ILIKE $${params.length}`; }
    if (address) { params.push(`%${address}%`); sql += ` AND u.address ILIKE $${params.length}`; }
    if (role) { params.push(role); sql += ` AND u.role = $${params.length}`; }

    params.push(limit);
    params.push(offset);
    sql += ` ORDER BY ${orderCol} ${orderDir} LIMIT $${params.length-1} OFFSET $${params.length}`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getUsers err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /admin/users/:id  (user details, if owner -> include their stores and rating)
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userQ = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [userId]);
    if (userQ.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = userQ.rows[0];

    if (user.role === 'owner') {
      // Get stores owned and each store's average rating
      const storesQ = await pool.query(`
        SELECT s.id, s.name, s.email, s.address,
               COALESCE(ar.avg_rating, 0)::numeric(10,2) AS avg_rating
        FROM stores s
        LEFT JOIN (
          SELECT store_id, AVG(rating) AS avg_rating
          FROM ratings
          GROUP BY store_id
        ) ar ON ar.store_id = s.id
        WHERE s.owner_id = $1
      `, [userId]);

      user.stores = storesQ.rows;
      // overall owner rating: average across all their stores (already computed per store; compute aggregate)
      const ownerAvgQ = await pool.query(`
        SELECT COALESCE(AVG(r.rating),0)::numeric(10,2) as owner_avg
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id = $1
      `, [userId]);

      user.owner_rating = ownerAvgQ.rows[0].owner_avg;
    }

    res.json(user);
  } catch (err) {
    console.error('getUserById err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//GET ALL USERS with filters + owner rating
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    // Build dynamic filters
    let conditions = [];
    let values = [];
    let idx = 1;

    if (name) {
      conditions.push(`u.name ILIKE $${idx++}`);
      values.push(`%${name}%`);
    }
    if (email) {
      conditions.push(`u.email ILIKE $${idx++}`);
      values.push(`%${email}%`);
    }
    if (address) {
      conditions.push(`u.address ILIKE $${idx++}`);
      values.push(`%${address}%`);
    }
    if (role) {
      conditions.push(`u.role = $${idx++}`);
      values.push(role);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT u.id, u.name, u.email, u.role, u.address,
        CASE WHEN u.role = 'owner'
          THEN (
            SELECT COALESCE(AVG(r.rating), 0)::numeric(10,2)
            FROM stores s
            LEFT JOIN ratings r ON r.store_id = s.id
            WHERE s.owner_id = u.id
          )
          ELSE NULL
        END AS avg_rating
      FROM users u
      ${whereClause}
      ORDER BY u.id ASC
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getUsers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /admin/stores (filter, sort, include avg rating and owner info)
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc', limit = 100, offset = 0 } = req.query;

    const allowedSort = {
      name: 's.name',
      email: 's.email',
      address: 's.address',
      avg_rating: 'avg_rating'
    };
    const orderCol = allowedSort[sortBy] || allowedSort['name'];
    const orderDir = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let sql = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
             u.name AS owner_name,
             COALESCE(sr.avg_rating, 0)::numeric(10,2) AS avg_rating
      FROM stores s
      LEFT JOIN users u ON u.id = s.owner_id
      LEFT JOIN (
        SELECT store_id, AVG(rating) AS avg_rating
        FROM ratings
        GROUP BY store_id
      ) sr ON sr.store_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (name) { params.push(`%${name}%`); sql += ` AND s.name ILIKE $${params.length}`; }
    if (email) { params.push(`%${email}%`); sql += ` AND s.email ILIKE $${params.length}`; }
    if (address) { params.push(`%${address}%`); sql += ` AND s.address ILIKE $${params.length}`; }

    params.push(limit);
    params.push(offset);
    sql += ` ORDER BY ${orderCol} ${orderDir} LIMIT $${params.length-1} OFFSET $${params.length}`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getStores err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL STORES with filters
exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;

    let conditions = [];
    let values = [];
    let idx = 1;

    if (name) {
      conditions.push(`s.name ILIKE $${idx++}`);
      values.push(`%${name}%`);
    }
    if (email) {
      conditions.push(`s.email ILIKE $${idx++}`);
      values.push(`%${email}%`);
    }
    if (address) {
      conditions.push(`s.address ILIKE $${idx++}`);
      values.push(`%${address}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating),0)::numeric(10,2) as avg_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY s.id ASC
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getStores:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addUser,
  addStore,
  getDashboard,
  getUsers,
  getUserById,
  getStores
};
