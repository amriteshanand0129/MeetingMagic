const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    meeting_summarys: {
      type: Object,
    },
    calendar_events: {
      type: Array,
      default: []
    },
    todo_tasks: {
      type: Array,
      default: []
    },
    emails: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
