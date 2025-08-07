// models/Member.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const attendanceSchema = new mongoose.Schema({ 
  date: { type: Date, required: true },
  present: { type: Boolean, required: true },
  leaveReason: { type: String, default: '' } ,// NEW
   status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, 
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null }, // NEW
  reviewedAt: { type: Date, default: null }
});

// Member Schema with role
const memberSchema = new mongoose.Schema({ 
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String }, // hashed password
  role: { 
    type: String, 
    enum: ['admin', 'intern'], 
    default: 'intern' // new
  },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  attendance: [attendanceSchema],
  dateOfJoining: { type: Date, default: Date.now } 
});

// Hash password before saving
memberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Export
module.exports = mongoose.model('Member', memberSchema);
