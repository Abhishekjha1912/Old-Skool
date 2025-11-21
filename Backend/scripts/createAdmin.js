import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

const [,, email, password, nameArg] = process.argv;

if (!email || !password) {
  console.error("Usage: node createAdmin.js <email> <password> [name]");
  process.exit(1);
}

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const name = nameArg || "Admin";
    const existing = await User.findOne({ email });
     if (existing) {
      existing.role = "admin";
      existing.name = name;
      existing.password = await bcrypt.hash(password, 10);
      await existing.save();
      console.log("Updated existing user to admin:", email);
    } else {
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role: "admin" });
      console.log("Created admin user:", user.email);
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

createAdmin();
