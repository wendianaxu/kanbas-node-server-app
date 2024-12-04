import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    title: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
    "description": String,
    "points": Number,
    "due": Date,
    "availableFrom": Date,
    "availableUntil": Date,
  },
  { collection: "assignments" }
);
export default schema;

