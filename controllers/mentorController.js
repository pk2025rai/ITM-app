const Mentor = require('../models/Mentor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Create a new mentor
exports.createMentor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(409).json({ error: 'Mentor with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const mentor = await Mentor.create({
      name,
      email,
      password,
      role: 'mentor'
    });

    res.status(201).json({
      message: 'Mentor created successfully',
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all mentors
exports.getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().select('-password');
    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
};

// Mentor login
exports.loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: mentor._id, role: mentor.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE /api/mentors/:id
exports.deleteMentor = async (req, res) => {
  try {
    const mentorId = req.params.id;

    const mentor = await Mentor.findByIdAndDelete(mentorId);

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.status(200).json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// PUT /api/mentors/mentor/update-password
exports.updateMentorPasswordByEmail = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // ✅ Get mentor from token (req.mentor set by auth middleware)
    const mentor = await Mentor.findById(req.mentor.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // ✅ Check old password
    const isMatch = await bcrypt.compare(oldPassword, mentor.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // ✅ Update password (will be hashed via schema pre-save)
    mentor.password = newPassword;
    await mentor.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
