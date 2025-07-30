import { userModel } from "../../models/userSchema.js"

export const getAllStudent = async(req,res)=>{
    try{
        const student = await userModel.find().select("-password")
        res.status(200).json({student})
    }
    catch(error){
        return res.status(500).json({message:"failed to get student"})
    }
}

export const BlockUnblockStudent = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isBlocked } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { isBlocked },
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: isBlocked ? "User blocked successfully" : "User unblocked successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update status" });
  }
};
