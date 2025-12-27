import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./configs/database.js";
import authRouter from "./routes/auth.js";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { templateRouter } from "./routes/interviewRoutes.js";
import { Template } from "./models/template.js";
import { InterviewSession } from "./models/interviewsession.js";
import { InterviewAIService } from "./services/interviewAiService.js";
import { GeminiResponder } from "./services/geminiResponder.js";

const exchangeStore = new Map();
const gemini = new GeminiResponder();
const ai = new InterviewAIService(gemini);


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  return res.send();
});

app.use("/api/carrer", templateRouter);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("startInterview", async ({ templateId, userId }) => {
    try {
      console.log(
        "Starting interview for user:",
        userId,
        "with template:",
        templateId
      );
      const template = await Template.findById(templateId);
      if (!template) {
        return socket.emit("error", "Invalid template");
      }
      let session = await InterviewSession.findOne({
        userId,
        status: "inProgress",
      });
      if (!session) {
        console.log("no session found creating now oneeeeeeeeeeee:", userId);
        session = await InterviewSession.create({
          userId: new mongoose.Types.ObjectId(userId),
          templateId: template._id,
          status: "inProgress",
          endedAt: null,
          finalReport: {},
          questions: [],
          answers: [],
        });
      }
      console.log(`session got is ${session}`);
      console.log(
        `the template is ${template} and length of metrics is ${template.evaluationMetrics.length}`
      );
      let exchange = {
        templateSnapshot: {
          templateId: template._id,
          domain: template.domain,
          evaluationMetrics: template.evaluationMetrics.map(
            (metric) => `${metric.topic}: ${metric.description}`
          ),
          targetCompany: "Not Specified",
        },

        meta: {
          questionsAsked: 0,
          startedAt: new Date(),
          lastActivityAt: new Date(),
        },

        interviewState: "ASKING",

        questions: [],
        answers: [],

        limits: 10,

        systemPrompt: "",
      };

      console.log("Exchange object created:", exchange);

      // here ai logic to generate system prompt based on template and user profile can be added
      // then update the exchange object with generated system prompt
      // then update the qsn to ask
      // if followup needed ask the foloowup qsn
      // and other things also

      exchange.systemPrompt = await new InterviewAIService(
        gemini
      ).buildSystemPrompt(exchange.templateSnapshot);
      console.log("System Prompt generated:", exchange.systemPrompt);
      exchange.questions.push({
        text: await new InterviewAIService(gemini).generateQuestion(exchange),
      });
      exchange.meta.questionsAsked += 1;
      exchangeStore.set(session._id.toString(), exchange);

      socket.join(session._id.toString());

      console.log(exchange.questions);

      io.to(session._id.toString()).emit("questionAsked", {
        sessionId: session._id,
        exchange: exchange,
        question: exchange.questions.at(-1).text,
      });
    } catch (err) {
      console.error("START INTERVIEW ERROR:", err);
      socket.emit("error", {
        message: "Failed to start interview session." + err,
      });
    }
  });

  socket.on("submitAnswer", async ({ answerTranscript, sessionId }) => {
    try {
      console.log(
        "Answer received for session:",
        sessionId,
        "Answer:",
        answerTranscript
      );
      const exchange = exchangeStore.get(sessionId);
      console.log("Exchange fetched for session:", exchange);
      if (!exchange) {
        return socket.emit("error", "Invalid session");
      }

      if (!answerTranscript || answerTranscript.trim() === "") {
        // return socket.emit("error", "Empty answer received");
      }

      // ab llm decides the next question

     


      exchange.answers.push({
        transcript: answerTranscript,
      });

      await InterviewSession.findByIdAndUpdate(sessionId, {
  questions: exchange.questions,
  answers: exchange.answers,
});


       const isLastTurn = exchange.questions.length >= exchange.limits;


   if (isLastTurn) {
      const outro = await ai.generateOutro(exchange);

      exchange.questions.push({ text: outro });
      exchange.meta.questionsAsked += 1;
      exchange.interviewState = "COMPLETED";

      io.to(sessionId).emit("interviewOutro", {
        sessionId,
        outro,
      });
      const report = await ai.generateFinalReport(exchange);

  await InterviewSession.findByIdAndUpdate(sessionId, {
    status: "completed",
    endedAt: new Date(),
    finalReport: report,
    questions: exchange.questions,
    answers: exchange.answers,
  });

  io.to(sessionId).emit("interviewCompleted", {
    sessionId,
    report,
  });

      exchangeStore.delete(sessionId);
      return;
   }

      exchange.questions.push({
        text: await new InterviewAIService(gemini).generateQuestion(exchange),
      });
      exchange.meta.questionsAsked += 1;
      exchange.meta.lastActivityAt = new Date();

      io.to(sessionId).emit("questionAsked", {
        sessionId: sessionId,
        exchange: exchange,
        question: exchange.questions.at(-1).text,
      });
    } catch (e) {
      console.error("SUBMIT ANSWER ERROR:", e);
      socket.emit("error", { message: "Failed to submit  answer." + e });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

await connectDb();

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`server is running on the port ${port} `);
});
