import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"job"
    },
    employer:{
         type:mongoose.Schema.Types.ObjectId,
          ref:"employer"
    },
    savedAt:{
        type:Date,
        default:Date.now
    }
},
    {timestamps:true}
)
export const SavedJobModel = mongoose.model("savedjob",savedJobSchema)