import express from "express";
import {
  createSessionController,
  getInterViewControllers,
} from "../controllers/sessionInterviewControllers";

const sessionRouter = express.Router();

sessionRouter.post("/create-session", createSessionController);
sessionRouter.get("/get-session", getInterViewControllers);

export default sessionRouter;
