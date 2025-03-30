import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";
import { v2 as cloudinary } from "cloudinary";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();
dotenv.config();

// middelware
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin: process.env.LOCAL_HOST,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const port = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("Error: DB_URI is undefined. Please check your .env file.");
  process.exit(1); // Exit the app if no Mongo URI
}

try {
  await mongoose.connect(DB_URI);
  console.log(chalk.yellow("Connected to the MongoDB database"));
} catch (error) {
  console.log(chalk.red(error));
}

// defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

// cloudinary configuration code
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.listen(port, () => {
  console.log(chalk.blue(`Server is running on port ${port}`));
});
