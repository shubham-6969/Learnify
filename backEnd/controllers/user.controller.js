import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signUp = async (req, res) => {
  //  {server side authentication}
  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 6 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 6 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "password must be atleast 6 char long" }),
  });

  // now validate parrsing
  const validateData = userSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  const { firstName, lastName, email, password } = req.body;

  // Check if email is provided

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // check if data alleady exist in database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exits" });
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save(); // saving new user in database
    res.status(201).json({ message: "signUp scuccessfuly", newUser }); // sending response to client
  } catch (error) {
    res.status(500).json({ errors: "Error in signUp" });
    console.log("Error in signUp", error);
  }
};

// login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const isPassword = await bcrypt.compare(password, user.password);

    if (!user || !isPassword) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }
    // generate jwt token
    const token = jwt.sign(
      {
        id: user._id,
      },
      Config.JWT_SECRET,
      { expiresIn: "8d" }
    );
    const cookieOption = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true, // cookie cannot be accessed by client side script {security purpose}
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // prevent csrf attack {security purpose}
    };
    res.cookie("jwt", token, cookieOption);
    res.status(201).json({ message: "login successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
    console.log("error in login", error);
  }
};

// logout function
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("error in logout", error);
  }
};

export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchased = await Purchase.find({ userId });

    let purchasedCourseId = [];

    for (let i = 0; i < purchased.length; i++) {
      purchasedCourseId.push(purchased[i].courseId);
    }
    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });
    res.status(200).json({ purchased, courseData });
  } catch (error) {
    res.status(500).json({ errors: "Error in purchases" });
    console.log("Error in purchase".error);
  }
};
