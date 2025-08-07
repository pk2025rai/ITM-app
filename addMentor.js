// addMentorPasswords.js
const Mentor = require("./models/Mentor");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://yeswanth:yeswanth@cluster0.3whyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Function to update mentor passwords
async function updateMentorPasswords(defaultPassword = "Mentor@123") {
  try {
    const hashed = await bcrypt.hash(defaultPassword, 10);

    // Update mentors with missing or empty password
    const result = await Mentor.updateMany(
      { $or: [{ password: { $exists: false } }, { password: "" }] },
      { $set: { password: hashed } }
    );

    console.log(`✅ Passwords updated for ${result.modifiedCount} mentor(s).`);
  } catch (error) {
    console.error("❌ Error updating mentor passwords:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Connect and run the update
async function connectAndRun() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    await updateMentorPasswords();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

connectAndRun();
