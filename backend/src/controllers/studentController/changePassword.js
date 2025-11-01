import bcrypt from "bcryptjs"
import { userModel } from "../../models/userSchema.js"


export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    if (!currentPassword || !newPassword || !confirmNewPassword)
      return res.status(400).json({ message: "All fields are required" })

    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "passwords do not match" })

    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch)
      return res.status(400).json({ message: "passwords do not match" })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword

    await user.save()
    res.status(200).json({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
