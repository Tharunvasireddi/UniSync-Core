import { socketIo } from "../app";

import { Session } from "../models/interviewsession";

const joinInterviewController = async (req, res) => {
  const {templateId} = req.answer;
const 
  socketIo.on("connected", async (socket) => {
    const newInterviewSession = await Session.create({
      userId: userId,
      templateId: templateId,
      createdAt: Date.now,
    });

  });
};
