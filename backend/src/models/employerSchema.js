import mongoose, { Schema } from "mongoose"
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
    phonenumber:{
        type:String,
    },
    role: {
        type: String,
        default: "employer"
    },
    avatarUrl:{
      type:String
   },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetToken:{
      type:String,
      default:null
    } ,
    resetTokenExpiry:{
      type:Date,
      default:null
    },
     isBlocked: { type: Boolean, default: false } 
},{ timestamps:true })
export const employerModel = mongoose.model("employer", employerSchema)