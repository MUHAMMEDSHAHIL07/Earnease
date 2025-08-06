import { employerModel } from "../models/employerSchema.js"

export const checkJobLimit = async (req, res, next) => {
    const employer = await employerModel.findById(req.user.id)
    if (!employer) return res.status(404).json({ message: "no employer found" })
    const isSubscribed = employer.isSubscribed && employer.subscriptionExpiry > newDate()
    if (isSubscribed) return next()
    if (employer.jobPostCount < 3) {
        employer.jobPostCount += 1
        await employer.save()
        return next()
    }
    return res.status(403).json({ message: "You have used your 3 free job posts. Please subscribe or pay to post more" })
}