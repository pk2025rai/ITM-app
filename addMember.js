// changeMemberPassword.js
const Member = require("./models/Member"); // your Member model
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://yeswanth:yeswanth@cluster0.3whyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function changeMemberPassword(email, newPassword) {
  try {
    // Hash the new password first
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password for the specified member
    const result = await Member.findOneAndUpdate(
      { email }, // Filter by email
      { password: hashed },
      { new: true } // Return updated document
    );

    if (result) {
      console.log("Member password updated successfully.");
    } else {
      console.log("Member not found.");
    }
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

async function connectAndChangeMemberPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Change these with your details
    await changeMemberPassword("Pralay@example.com", "NewPass@123");

  } catch (error) {
    console.error(error);
  }
}

connectAndChangeMemberPassword();

