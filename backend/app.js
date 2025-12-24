import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./configs/database.js";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import { templateRouter } from "./routes/interviewRoutes.js";
import sessionRouter from "./routes/interviewSession.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/carrer", templateRouter);
app.use("api/session", sessionRouter);

await connectDb();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on the port ${port} `);
});
