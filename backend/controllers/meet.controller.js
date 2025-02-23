const { GoogleGenerativeAI } = require("@google/generative-ai");
const user_model = require("../models/user.model");
const mongoose = require("mongoose");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = `You are an AI that processes user input and extracts structured information. Given a text input, return a JSON object with the following fields:

1. **summary**: A concise summary of the text.
2. **calendar_events**: A list of events mentioned in the text, including date, time, and description.
3. **emails**: A list of emails that need to be sent, with recipient names and email bodies.
4. **todo_tasks**: A list of tasks extracted from the text.

If dates are like tomorrow or next week, convert them to the corresponding dates.
Strictly follow the date format as "YYYY-MM-DD".

Ensure the output is strictly in JSON format without any additional text.

Example output:
{
  "summary": "Team meeting scheduled for Monday. John needs to email the client. Buy office supplies.",
  "calendar_events": [
    {
      "title": "Team Meeting",
      "start": "2025-02-22"
    }
  ],
  "emails": [
    {
      "to": "john@example.com",
      "subject": "Follow-up with client",
      "body": "John, please send a follow-up email to the client regarding the project status."
    }
  ],
  "todo_tasks": [
    title: "Buy office supplies",
    due_date: "2025-02-20"
  ]
}

Now, process the following input and return the JSON output:
 `;

const analyzeTranscript = async (transcript) => {
  try {
    const result = await model.generateContent(prompt + transcript);
    const responseText = result.response.candidates[0].content.parts[0].text;
    const trimmedResponse = responseText.slice(7, -3);
    const jsonResponse = JSON.parse(trimmedResponse);
    return jsonResponse;
  } catch (err) {
    console.log(err);
    return { error: "Transcript analysis failed" };
  }
};
const analyze = async (req, res) => {
  try {
    const transcript = req.body.transcript;
    const analysis = await analyzeTranscript(transcript);
    if (analysis.error) {
      return res.status(500).send({
        error: "Transcript Analysis Failed",
      });
    }
    res.status(200).send({
      message: "Transcript analyzed successfully. Scroll down to view the analysis.",
      analysis,
    });
  } catch (error) {
    res.status(501).send({
      error: "Transcript Analysis Failed",
    });
  }
};

const saveAnalysis = async (req, res) => {
  try {
    const analysis = req.body;

    const updatedUser = await user_model.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          meeting_summarys: {
            summary: analysis.summary,
            date: new Date(),
          },
          calendar_events: { $each: analysis.calendar_events },
          todo_tasks: {
            $each: analysis.todo_tasks.map((task) => ({
              _id: new mongoose.Types.ObjectId(),
              ...task,
            })),
          },
          emails: {
            $each: analysis.emails.map((email) => ({
              _id: new mongoose.Types.ObjectId(),
              ...email,
            })),
          },
        },
      },
      { new: true }
    );

    res.status(200).send({
      message: "Analysis saved successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Analysis Saving Failed",
    });
  }
};

const getCalendarEvents = async (req, res) => {
  try {
    const calendarEvents = req.user.calendar_events;
    res.status(200).send({
      calendarEvents,
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to fetch calendar events",
    });
  }
};

const getTodoTasks = async (req, res) => {
  try {
    const todoTasks = req.user.todo_tasks;
    res.status(200).send({
      todoTasks,
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to fetch todo tasks",
    });
  }
};

const getEmails = async (req, res) => {
  try {
    const emails = req.user.emails;
    res.status(200).send({
      emails,
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to fetch emails",
    });
  }
};

const getMeetingSummary = async (req, res) => {
  try {
    const meetingSummarys = req.user.meeting_summarys;
    res.status(200).send({
      meetingSummarys,
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to fetch meeting summary",
    });
  }
};

const markTodoAsDone = async (req, res) => {
  try {
    const todoId = new mongoose.Types.ObjectId(req.params.id);
    const updatedUser = await user_model.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          todo_tasks: { _id: todoId },
        },
      },
      { new: true }
    );
    res.status(200).send({
      message: "Todo task marked as done successfully.",
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to mark todo task as done",
    });
  }
};

const markEmailAsSent = async (req, res) => {
  try {
    const emailId = new mongoose.Types.ObjectId(req.params.id);
    const updatedUser = await user_model.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          emails: { _id: emailId },
        },
      },
      { new: true }
    );
    res.status(200).send({
      message: "Email marked as sent successfully.",
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to mark email as sent",
    });
  }
};

module.exports = {
  analyze,
  saveAnalysis,
  getCalendarEvents,
  getTodoTasks,
  getEmails,
  getMeetingSummary,
  markTodoAsDone,
  markEmailAsSent,
};
