const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const taskRoutes = require('./routes/taskRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const memberRoutes = require('./routes/memberRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/members', memberRoutes);
// app.use('/api', memberRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', memberRoutes); // Protected routes go here
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
