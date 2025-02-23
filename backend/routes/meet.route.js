// Controllers and Middlewares
const auth_middleware = require("../middlewares/auth.middleware");
const meet_controller = require("../controllers/meet.controller");

// Meeting Routes
module.exports = (app) => {
  app.post("/analyze", [auth_middleware.validateToken], meet_controller.analyze);
  app.put("/save-analysis", [auth_middleware.validateToken], meet_controller.saveAnalysis);
  app.get("/calendar-events", [auth_middleware.validateToken], meet_controller.getCalendarEvents);
  app.get("/todo-tasks", [auth_middleware.validateToken], meet_controller.getTodoTasks);
  app.get("/emails", [auth_middleware.validateToken], meet_controller.getEmails);
  app.get("/meeting-summarys", [auth_middleware.validateToken], meet_controller.getMeetingSummary);
  app.post("/mark-email-as-sent/:id", [auth_middleware.validateToken], meet_controller.markEmailAsSent);
  app.put("/todo-tasks/:id", [auth_middleware.validateToken], meet_controller.markTodoAsDone);
};
