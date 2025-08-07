// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Mentor = require('./models/Mentor');
const Member = require('./models/Member');

const mentorData = {
  Abhijit: ['Amandeep Singh', 'Harish', 'Neha Shrama', 'Arpankumar Sasmal', 'Shivani', 'Imran', 'Asmi', 'sudeep', 'Praveen M'],
  Piyush: ['Aneesh Mukkamala', 'Yash Jumde', 'Samridhi Raj Sinha', 'Punit Kaushik', 'Karthikeya Varma Ayinaparthi', 'Ruban S'],
  Sahil: [],
  Abhishek: ['Shreeyans Arora', 'Kanak', 'gourav Joshi', 'Rishab', 'Elango'],
  Pralay: ['Anant', 'Pranav', 'Gopinath', 'Parth', 'Selva'],
  'Prachii K': ['Tarun', 'Mohd Arsh', 'Shabarish', 'Hitesh']
};

const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Mentor.deleteMany({});
    await Member.deleteMany({});
    console.log('Cleared previous data');

    for (const mentorName in mentorData) {
      const prefix = mentorName === 'Prachii K' ? 'Ms.' : 'Mr.';
      const mentor = await Mentor.create({
        name: `${prefix} ${mentorName}`, 
        email: `${mentorName.replace(/ /g, '').toLowerCase()}@example.com`
      });

      const members = mentorData[mentorName];
      for (const memberName of members) {
        await Member.create({
          name: memberName,  // No prefix for members
          email: `${memberName.replace(/ /g, '').toLowerCase()}@example.com`,
          mentor: mentor._id
        });
      }
    }

    console.log('Seeding complete 🎉');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeeder();
