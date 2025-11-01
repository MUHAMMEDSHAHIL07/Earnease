import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: { 
    type: String, 
    required: true,
    unique: true 
  },
  employer: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "employer", 
     required: true 
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }, 
  job: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "job" 
  },
  amount: Number,
  status: String,
  method: String,
  description: String,
  paymentReceivedDate: {
     type: Date, 
     default: Date.now
  },
  createdAt: Date
})

export const paymentModel = mongoose.model("Payment", paymentSchema)