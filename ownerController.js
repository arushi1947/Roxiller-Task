// controllers/ownerController.js
const pool = require('../config/db');

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get all stores owned by this user
    const storesQ = await pool.query(
      `SELECT id, name, email, address
       FROM stores
       WHERE owner_id = $1`,
      [ownerId]
    );

    if (storesQ.rows.length === 0) {
      return res.json({ message: 'No stores registered for this owner', stores: [] });
    }

    const stores = storesQ.rows;

    // For each store, get list of users who rated + average rating
    const storeDetails = [];
    for (const store of stores) {
      const ratingsQ = await pool.query(
        `SELECT u.id AS user_id, u.name, u.email, r.rating
         FROM ratings r
         JOIN users u ON u.id = r.user_id
         WHERE r.store_id = $1`,
        [store.id]
      );

      const avgQ = await pool.query(
        `SELECT COALESCE(AVG(rating),0)::numeric(10,2) AS avg_rating
         FROM ratings
         WHERE store_id = $1`,
        [store.id]
      );

      storeDetails.push({
        store_id: store.id,
        store_name: store.name,
        address: store.address,
        avg_rating: avgQ.rows[0].avg_rating,
        users_who_rated: ratingsQ.rows
      });
    }

    res.json({ owner_id: ownerId, stores: storeDetails });
  } catch (err) {
    console.error('getOwnerDashboard err', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getOwnerDashboard };
