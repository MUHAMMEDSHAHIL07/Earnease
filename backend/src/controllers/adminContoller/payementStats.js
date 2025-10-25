import { paymentModel } from "../../models/paymentSchema.js"

export const PaymentStats = async (req, res) => {
    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const payment = await paymentModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ])
        const monthlyRevenue = months.map((month, index) => {
            const found = payment.find(p => p._id === index + 1)
            return { month, revenue: found ? found.revenue : 0 }
        })

        let growthRate = 0
        if (payment.length >= 2) {
            const prev = payment[payment.length - 2].revenue
            const current = payment[payment.length - 1].revenue
            if (prev > 0) {
                growthRate = ((current - prev) / prev) * 100
            }
            else {
                growthRate = 0
            }

        }
        const totalRevenue = payment?.reduce((sum, p) => sum + p.revenue, 0)
        res.json({
            monthlyRevenue,
            totalRevenue,
            growthRate: Number(growthRate.toFixed(2))
        })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}