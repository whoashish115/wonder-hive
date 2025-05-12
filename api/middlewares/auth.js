const Users = require("../models/userModel")
const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        const token = req.header("authorization")
        if (!token) return res.status(500).json({ error: "invalid authentication" })

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decoded) return res.status(500).json({ error: "invalid authentication" })

        const user = await Users.findOne({ _id: decoded.id })
        if (!user) return res.status(500).json({ error: "invalid authentication" })
        
        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = auth