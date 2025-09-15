import { userModel } from "../../models/userSchema.js"

export const updateStudentProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const updates = req.body

        if (req.file) {
            updates.avatarUrl = req.file.path
        }

        const profile = await userModel.findByIdAndUpdate(userId, updates, { new: true })

        if (!profile) {
            return res.status(404).json({ message: "User not found" })
        }

        const requiredFields = [
            "name",
            "email",
            "phonenumber",
            "location",
            "availability",
            "education",
            "skills",
            "bio",
            "experience",
            "avatarUrl"
        ];

        const filledCount = requiredFields.filter((field) => {
            const value = profile[field]
            return value && value.toString().trim() !== ""
        }).length

        const percent = Math.round((filledCount / requiredFields.length) * 100)
        profile.profileCompletionPercent = percent
        profile.profileCompleted = percent === 100

        await profile.save()

        res.status(200).json({
            message: "Profile updated successfully",
            updatedProfile: profile
        })
    } catch (error) {
        return res.status(500).json({ message: "Error: " + error.message })
    }
}