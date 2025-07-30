import mongoose from "mongoose";

const employerVerificationSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer",
    required: true,
    unique: true,
  },
  companyType:
  {
    type: String,
    required: true
  },
  industry:
  {
    type: String,
    required: true
  },
  address:
  {
    type: String,
    required: true
  },
  contactPerson:
  {
    type: String,
    required: true
  },
  contactEmail:
  {
    type: String,
    required: true
  },
  licenseUrl:
  {
    type: String,
    required: true
  },
  websiteUrl:{
    type:String,
  },
  aboutCompany:{
    type:String,
    required:true
  },
  foundedYear:{
    type:Number,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isVerified:
  {
    type: Boolean,
    default: false
  },
  submittedAt:
  {
    type: Date,
    default: Date.now
  },
});

const EmployerVerification = mongoose.model("EmployerVerification", employerVerificationSchema);
export default EmployerVerification; 