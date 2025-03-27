import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstName: {
    type:String,
    required:true,
  },
  lastName: {
    type:String,
    required:true,
  },
  email: {
    type:String,
    required:true,
    unique:true,  // no duplicate email allowed
  },
  password: {
    type:String,
    required: true,
  }
 });

 export const Admin = mongoose.model("Admin",adminSchema);
