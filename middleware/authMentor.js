const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authMentor = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const mentor = await Mentor.findById(decoded.id);

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    req.mentor = mentor;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMentor;
