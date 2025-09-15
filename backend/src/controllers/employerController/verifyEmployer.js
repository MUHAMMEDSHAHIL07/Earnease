import {employerModel} from "../../models/employerSchema.js"
import EmployerVerification from "../../models/employerVerifiySchema.js"
export const verifyEmployer = async (req, res) => {

  try {
    const {employerId,companyType,industry,address,contactPerson,contactEmail,websiteUrl,aboutCompany,foundedYear} = req.body;

    if (
      !employerId ||
      !companyType ||
      !industry ||
      !address ||
      !contactPerson ||
      !contactEmail ||
      !websiteUrl ||
      !aboutCompany ||
      !foundedYear
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "License file is required" });
    }

    const employer = await employerModel.findById(employerId);
    if (!employer) return res.status(404).json({ message: "Employer not found" });

    const existing = await EmployerVerification.findOne({ employerId });
    if (existing) return res.status(400).json({ message: "Verification already submitted" });

    await EmployerVerification.create({
      employerId,
      companyType,
      industry,
      address,
      contactPerson,
      contactEmail,
      licenseUrl: req.file.path,
      websiteUrl,
      aboutCompany,
      foundedYear 
    });

    employer.isVerified = false;
    await employer.save();

    return res.status(201).json({ message: "Verification submitted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};