const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader); // 👈 log it

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token part:', token); // 👈 log token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // 👈 log decoded
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
