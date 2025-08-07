// middleware/authMember.js
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.authAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const member = await Member.findById(decoded.id);

    if (!member) return res.status(404).json({ error: 'Member not found' });

    // ✅ Explicit role check
    if (member.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    req.member = member; // attach the logged-in admin
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
