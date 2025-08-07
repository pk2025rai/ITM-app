// updateRolesToInterns.js
const Member = require("./models/Member"); // your Member model
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://yeswanth:yeswanth@cluster0.3whyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function updateAllMembersToInterns() {
  try {
    // Update all members' role to "intern"
    await Member.updateMany(
      {},
      { $set: { role: "intern" } }
    );

    console.log("All members updated to role: intern.");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

async function connectAndUpdateRoles() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    await updateAllMembersToInterns();
  } catch (error) {
    console.error(error);
  }
}

connectAndUpdateRoles();

