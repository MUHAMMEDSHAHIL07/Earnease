import mongoose, { Schema } from "mongoose";

const employerSchema = new Schema({
  companyname: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
  },
  phonenumber: {
    type: String,
  },
  role: {
    type: String,
    default: "employer"
  },
  avatarUrl: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },

  jobPostCount: {
    type: Number,
    default: 0 
  },

  isSubscribed: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ["single", "monthly", "yearly"],
    default: null
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  subscriptionPostCount: {
    type: Number,
    default: 0 
  },
  singlePostLimit:{
    type:Number,
    default:1
  },
  monthlyPostLimit: {
    type: Number,
    default: 8 
  },
  yearlyPostLimit: {
    type: Number,
    default: 100 
  },

  isBlocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const employerModel = mongoose.model("employer", employerSchema);