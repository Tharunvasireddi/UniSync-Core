import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./configs/database.js";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import { templateRouter } from "./routes/interviewRoutes.js";
import sessionRouter from "./routes/interviewSession.js";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const server = http.createServer(app);
export  const socketIo = new Server(server);

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
