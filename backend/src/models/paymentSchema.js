import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  employer: { type: mongoose.Schema.Types.ObjectId,
     ref: "employer", 
     required: true }, 
  amount: Number,
  status: String,
  method: String,
  description: String,
  createdAt: Date
});

export const paymentModel = mongoose.model("Payment", paymentSchema);