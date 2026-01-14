import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    tag: { type: String },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assignedUser: { type: String, required: true, index: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Review", "Testing", "Done"],
      default: "Todo",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;