InterviewExchange = {
  sessionId: ObjectId,

  templateSnapshot: {
    templateId: ObjectId,
    domain: String,
    evaluationMetrics: [String],
    targetCompany: {
        type: String,
        deafult: "Not Specified"
    }
  },

  systemPrompt: String,

  phase: "ASKING" | "WAITING_FOR_ANSWER" | "EVALUATING" | "COMPLETED",

  questions: [
    {
      index: Number,
      text: String,
      askedAt: Date,
      followUp: Boolean,
    }
  ],

  answers: [
    {
      questionIndex: Number,
      transcript: String,
      durationSec: Number,
      receivedAt: Date,
    }
  ],

  currentQuestionIndex: Number,

  limits: {
    maxQuestions: Number,
  },

  meta: {
    questionsAsked: Number,
    startedAt: Date,
    lastActivityAt: Date,
  }
};
