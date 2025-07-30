import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
    employer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"employer",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true 
    },
    Location:{
        type:String,
        required:true
    },
    Salary:{
        type:Number,
        required:true
    },
    Category:{
        type:String,
        required:true
    },
    WorkHour:{
        type:String,
        required:true
    },
    Gender:{
        type:String,
        required:true
    }
})
export const jobModel = mongoose.model("job",jobSchema)