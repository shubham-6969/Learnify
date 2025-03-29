import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Config from "../config.js";
import { Admin } from "../models/admin.model.js";

export const signUp = async (req, res) => {   
  const { firstName, lastName, email, password } = req.body;

  //  {server side authentication}
  const adminSchema = z.object({
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
  const validateData = adminSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ errors: validateData.error.issues.map((err) => err.message) });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // check if data alleady exist in database
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ errors: "Admin already exits" });
    }
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newAdmin.save(); // saving new Admin in database
    res.status(201).json({ message: "signUp scuccessfuly", newAdmin }); // sending response to client
  } catch (error) {
    res.status(500).json({ errors: "Error in signUp" });
    console.log("Error in signUp", error);
  }
};

// login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!admin || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    // generate jwt token
    const token = jwt.sign(
      {
        id: admin._id,
      },
      Config.JWT_ADMIN_PASSWORD,
      { expiresIn: "8d" }
    );
    const cookieOption = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true, // cookie cannot be accessed by client side script {security purpose}
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // prevent csrf attack {security purpose}
    };
    res.cookie("jwt", token, cookieOption);
    res.status(201).json({ message: "login successful", admin, token });
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
