// Creating user schema
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

 export const User = mongoose.model("User",userSchema);
