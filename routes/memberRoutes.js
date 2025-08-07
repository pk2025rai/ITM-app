const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const memberController = require('../controllers/memberController');
const {
  createMember,
  getMembers,
  getMembersByMentor
} = require('../controllers/memberController');

// Create a new Member
router.post("/", createMember);

// Get all Members
router.get("/", getMembers);

// Get Members by Mentor
router.get('/mentor/:mentorId', getMembersByMentor);

// Mark attendance for a single Member
router.post('/members/:memberId/attendance', memberController.markAttendance);

// Get attendance for a Member
router.get('/members/:memberId/attendance', memberController.getAttendance);
// Backend route for fetching members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().populate('mentor');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Batch attendance update
router.post('/attendance', async (req, res) => {
  try {
    const { updates } = req.body;

    // Process each update
    const updatePromises = updates.map(async (update) => {
      const member = await Member.findById(update.memberId);
      if (!member) {
        throw new Error(`Member not found: ${update.memberId}`);
      }

      // Add new attendance record with leaveReason if provided
      member.attendance.push({ 
        date: update.date, 
        present: update.present, 
        leaveReason: update.leaveReason ? update.leaveReason : '' 
      });

      await member.save();
    });

    await Promise.all(updatePromises);
    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
router.patch('/members/updateAllToIntern', memberController.updateAllMembersToIntern);
router.delete('/members/:id', memberController.deleteMember);
router.put('/attendance/:memberId/:attendanceId/review', memberController.reviewAttendance);
router.get('/mentors/:mentorId/pending-attendance', memberController.getPendingAttendanceForMentor);

// Export router
module.exports = router;
