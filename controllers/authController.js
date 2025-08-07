const Member = require("../models/Member");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ✅ Register a new member
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, mentor, dateOfJoining } = req.body;

    // Check if a member with this email already exists
    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    // Hash password before saving
    const hashed = await bcrypt.hash(password, 10);

    // Create a new Member with hashed password and role
    const member = new Member({ 
      name, 
      email, 
      password,
      role: role ? role : "intern",// fallback to 'intern'
      mentor,
      dateOfJoining 
    });

    await member.save();

    res.status(201).json({ message: "Member registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Login member
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ email });

    if (!member) {
      console.log("❌ User not found");
      return res.status(404).json({ error: "Invalid email or password" });
    }

    console.log("✅ Member found:", member.email);
    console.log("🔑 Provided Password:", password);
    console.log("🔐 Stored Hash:", member.password);

    const isMatch = await bcrypt.compare(password, member.password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: member._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        dateOfJoining: member.dateOfJoining,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ error: error.message });
  }
};



// ✅ Update password
exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const member = await Member.findOne({ email });
    if (!member) return res.status(404).json({ error: "Member not found" });

    const isMatch = await bcrypt.compare(oldPassword, member.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    // Backup current dateOfJoining
    const currentDate = member.dateOfJoining;

    // Update password (relies on pre('save') middleware)
    member.password = newPassword;
    member.markModified("password");

    // Prevent unwanted date update
    member.dateOfJoining = currentDate;

    await member.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






// PUT /api/members/update-password (Protected)
exports.updatePasswords = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const member = await Member.findById(req.member._id);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const isMatch = await bcrypt.compare(oldPassword, member.password);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    member.password = newPassword; // Will be hashed by pre-save hook
    await member.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
