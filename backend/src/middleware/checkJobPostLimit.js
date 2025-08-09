import { employerModel } from "../models/employerSchema.js"

export const checkJobLimit = async (req, res, next) => {
    try {
        const employer = await employerModel.findById(req.user.id)
        if (!employer) {
            return res.status(404).json({ message: "no employer found" })
        }
        if (employer.isBlocked) {
            return res.status(403).json({ message: "Your accout have been blocked" })
        }

        const now = new Date()
        if (!employer.isSubscribed || !employer.subscriptionExpiry || employer.subscriptionExpiry < now) {
            if (employer.jobPostCount < 3) {
                employer.jobPostCount += 1
                await employer.save()
                return next()
            }
            else {
                return res.status(403).json({ message: "Your have used 3 free job for free,please subscribe for post job" })
            }
        }
        if (employer.subscriptionType == "single") {
            if (employer.subscriptionPostCount < employer.singlePostLimit) {
                employer.subscriptionPostCount += 1
                await employer.save()
                return next()
            }
            else {
                return res.status(403).json({ message: "Try a plan to post a job" })
            }
        }
        if (employer.subscriptionType == "monthly") {
            if (employer.subscriptionPostCount < employer.monthlyPostLimit) {
                employer.subscriptionPostCount += 1
                await employer.save()
                return next()
            }
            else {
                return res.status(403).json({ message: "Your monthly subscription has been expired , subscribe for more to post" })
            }
        }
        if (employer.subscriptionType == "yearly") {
            if (employer.subscriptionPostCount < employer.yearlyPostLimit) {
                employer.subscriptionPostCount += 1
                await employer.save()
                return next()
            }
            else {
                return res.status(403).json({ message: "Your monthly subscription has been expired , subscribe for more to post" })
            }
        }
        return res.status(400).json({ message: "Invalid subscription type." })
    }
    catch (error) {
        return res.status(500).json({ message: "internal server error" + error.message })
    }
}