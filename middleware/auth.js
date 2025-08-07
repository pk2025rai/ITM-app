// middleware/auth.js
const jwt = require('jsonwebtoken');
const Member = require('../models/Member'); // Make sure path is correct

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports = async function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Fetch full member data from DB
    const member = await Member.findById(decoded.id);
    if (!member) return res.status(404).json({ error: 'User not found.' });

    req.member = member; // Store full member object in request
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};
