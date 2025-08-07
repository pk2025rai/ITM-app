// addPasswords.js
const Member = require("./models/Member");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://yeswanth:yeswanth@cluster0.3whyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function updateInternPasswords(defaultPassword = "Pass@123") {
  try {
    const hashed = await bcrypt.hash(defaultPassword, 10);

    // Update only members with role 'intern'
    const result = await Member.updateMany(
      { role: "intern" },
      { $set: { password: hashed } }
    );

    console.log(`✅ Passwords updated for ${result.modifiedCount} intern(s).`);
  } catch (error) {
    console.error("❌ Error updating intern passwords:", error);
  } finally {
    mongoose.connection.close();
  }
}

async function connectAndRun() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    await updateInternPasswords();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

connectAndRun();
