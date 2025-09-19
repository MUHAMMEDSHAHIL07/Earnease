export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: "/",
        })
        res.status(200).json({ message: "logout succesfully" })
    }
    catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
}