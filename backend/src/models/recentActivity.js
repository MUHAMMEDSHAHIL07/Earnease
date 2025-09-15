import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employer',
    required: true,
  },
  type: {
    type: String,
    enum: ['Job Post', 'Job Edit','Delete Job', 'Application Accept', 'Application Reject', 'Payment', 'Profile Edit'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const recentActivityModel = mongoose.model("Activity",activitySchema)