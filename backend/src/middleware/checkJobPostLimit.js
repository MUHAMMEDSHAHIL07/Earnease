import { employerModel } from "../models/employerSchema.js";

export const checkJobLimit = async (req, res) => {
  try {
    const employer = await employerModel.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ message: "No employer found" });
    }
    if (employer.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const now = new Date();
    if (!employer.isSubscribed || !employer.subscriptionExpiry || employer.subscriptionExpiry < now) {
      if (employer.jobPostCount < 3) {
        return res.json({ canPost: true });
      } else {
        return res.status(403).json({ canPost: false, message: "You have used 3 free job posts. Please subscribe to post more." });
      }
    }
    let limitMap = {
      single: employer.singlePostLimit,
      monthly: employer.monthlyPostLimit,
      yearly: employer.yearlyPostLimit
    };

    if (employer.subscriptionPostCount < (limitMap[employer.subscriptionType] || 0)) {
      return res.json({ canPost: true });
    } else {
      return res.status(403).json({ canPost: false, message: "Post limit for your subscription reached. Please upgrade." });
    }

  } catch (error) {
    return res.status(500).json({ message: "Internal server error: " + error.message });
  }
};