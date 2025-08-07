const express = require('express');
const router = express.Router();
const { createMentor, getMentors, loginMentor, deleteMentor, updateMentorPasswordByEmail } = require('../controllers/mentorController');
const authMentor = require('../middleware/authMentor')

// Create a new mentor
router.post('/', createMentor);

// Get all mentors
router.get('/', getMentors);

// Mentor login
router.post('/login', loginMentor);  // <-- added login route
router.delete('/delete/:id', deleteMentor);  // <-- added login route
router.put('/mentor/update-password', authMentor, updateMentorPasswordByEmail)
// GET /api/mentor/me (returns currently logged-in mentor)
router.get('/me', authMentor, (req, res) => {
  res.status(200).json(req.mentor); // req.mentor set by auth middleware
});


module.exports = router;
