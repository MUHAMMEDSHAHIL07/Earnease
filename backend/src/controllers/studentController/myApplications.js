import { jobApplicationModel } from "../../models/jobApplication.js"

export const myApplication = async (req, res) => {
    try {
        const studentId = req.user.id
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 15
        const search = req.query.search?.trim() || ""
        const status = req.query.status?.toLowerCase() || "all"
        const skip = (page - 1) * limit
        let query = { student: studentId }
       if (status !== "all") {
        query.status = status
    }
        let allApplications = await jobApplicationModel
            .find(query)
            .populate("job", "title Location Salary Category")
            .populate("employer", "companyname avatarUrl")
            .sort({ appliedAt: -1 })
            .lean()
        if (search) {
            const searchLower = search.toLowerCase()
            allApplications = allApplications.filter(app => {
                const jobTitle = app.job?.title?.toLowerCase() || ""
                const companyName = app.employer?.companyname?.toLowerCase() || ""
                const jobMatch = jobTitle.includes(searchLower)
                const companyMatch = companyName.includes(searchLower)
                const matches = jobMatch || companyMatch                
                return matches
            })
        } 
        const totalCount = allApplications.length
        const paginatedApplications = allApplications.slice(skip, skip + limit)
        const finalApplications = paginatedApplications.map((app) => ({
            ...app,
            appliedDate: app.appliedAt
                ? new Date(app.appliedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                : "N/A",
        }))

        res.status(200).json({
            applications: finalApplications,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalCount,
        })

    } catch (error) {
        res.status(500).json({ message: "Server error"+error.message })
    }
}

export const getAppliedJobLength =async(req,res)=>{
   try{
    const student = req.user.id
    const pending = await jobApplicationModel.countDocuments({student,status: "pending",})
    const accepted = await jobApplicationModel.countDocuments({student,status: "accepted",})
    const rejected = await jobApplicationModel.countDocuments({student,status: "rejected",})
    return res.status(200).json({
        pending,
        accepted,
        rejected
    })
   }
   catch(err){
       return res.status(500).json({message:err.message})
   }
}