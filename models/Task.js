const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({ 
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['pending', 'in progress', 'completed'], 
    default: 'pending' 
  },
  dueDate: Date,
  dueDate1: Date, // <- new field
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });


module.exports = mongoose.model('Task', taskSchema);
