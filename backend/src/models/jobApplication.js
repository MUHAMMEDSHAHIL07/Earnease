import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  job:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"job"
  },
  employer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"employer"
  },
  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
  },
  status:{
    type:String,
    default:"Pending"
  },
  appliedAt:{
    type:Date,
    default:Date.now()
  }
})
export const jobApplicationModel = mongoose.model("jobapplication",jobApplicationSchema)