import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "job"
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer"
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected","completed"],
    default: "pending"
  },
  appliedAt: {
    type: Date,
    default: Date.now()
  },
   paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  completedAt: {
    type: Date
  }
})
export const jobApplicationModel = mongoose.model("jobapplication", jobApplicationSchema)