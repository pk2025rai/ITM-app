const Member = require('../models/Member');

// Create a new Member
exports.createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('mentor');
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get members by mentor
exports.getMembersByMentor = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const members = await Member.find({ mentor: mentorId }).populate('mentor');
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members for mentor' });
  }
};


// Mark attendance with leave option
exports.markAttendance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { date, present, leaveReason } = req.body;

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    // Optional: prevent duplicate attendance on the same date
    const alreadyMarked = member.attendance.find(entry =>
      new Date(entry.date).toDateString() === new Date(date).toDateString()
    );

    if (alreadyMarked) {
      return res.status(400).json({ error: 'Attendance already marked for this date' });
    }

    member.attendance.push({ 
      date, 
      present, 
      leaveReason: leaveReason ? leaveReason : '',
       status: 'pending'
    });
    await member.save();

    res.status(200).json({ message: 'Attendance recorded successfully!', attendance: member.attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get attendance history for a member
exports.getAttendance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId);

    if (!member) return res.status(404).json({ error: 'Member not found' });

    res.status(200).json({ attendance: member.attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAllMembersToIntern = async (req, res) => {
  try {
    await Member.updateMany({}, { $set: { role: "intern" } });

    res.status(200).json({ message: "All members updated to role: intern" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// in your member controller (say in memberController.js)
exports.deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    await Member.findByIdAndDelete(memberId);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/attendance/:memberId/:attendanceId/review
 // Review (approve/reject) an attendance entry
exports.reviewAttendance = async (req, res) => {
  try {
    const { memberId, attendanceId } = req.params;
    const { status } = req.body;

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const attendance = member.attendance.id(attendanceId);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    // Set status
    attendance.status = status;

    // If rejected, also set present = false
    if (status === 'rejected') {
      attendance.present = false;
    }

    await member.save();

    res.status(200).json({ message: `Attendance ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/mentors/:mentorId/pending-attendance
exports.getPendingAttendanceForMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Find all interns under this mentor
    const interns = await Member.find({ mentor: mentorId });

    let pendingAttendance = [];

    interns.forEach(intern => {
      intern.attendance.forEach(record => {
        if (record.status === 'pending') {
          pendingAttendance.push({
            internId: intern._id,
            internName: intern.name,
            attendanceId: record._id,
            date: record.date,
            present: record.present,
            leaveReason: record.leaveReason,
            status: record.status
          });
        }
      });
    });

    res.status(200).json({ pending: pendingAttendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
