import { Session } from "../models/interviewsession";

export const createSessionController = async (req, res) => {
  const { templateId, status } = req.body;

  const newSession = await Session.create({
    templateId: templateId,
    userId: req.userId,
    status: status,
  });

  res.status(200).json({
    message: "newSession is created success fully",
    newSession,
  });
};
