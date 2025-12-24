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

export const getInterViewControllers = async (req, res) => {
  const userId = req.userId;

  const userTemplates = await Session.findMany({ userId: userId });

  res.status(200).json({
    success: true,
    message: "user templates are fetched successfully",
    data: userTemplates,
  });
};
