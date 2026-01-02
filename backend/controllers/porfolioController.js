import { Document } from "../models/Document.js";
import { portAi } from "../services/ai.js";

export const generatePortfolioController = async (req, res) => {
  try {
    // sddfgewjhg
    const { userId } = req.body;
    console.log(userId);
    const document = await Document.findOne({ UserId: userId });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "document is not found",
      });
    }
    const response = await portAi.generateFile(document.extractedText);
    console.log(response);
  } catch (error) {
    console.log("errir while  :", error);
    res.status(500).json({
      success: false,
      message: "error while generating files",
      error: error,
    });
  }
};
