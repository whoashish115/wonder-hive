const Highlight = require('../models/highlightModel')
const APIfeatures = require('../utils/features')

const highlightCtrl = {
    createHighlight: async (req, res) => {
        try {
            const { title, picture, stories } = req.body
            if (stories.length ==0) return res.status(400).json({ error: "Atleast one story is required to create highlight" })
            if (!picture || !title) return res.status(400).json({ error: "picture and title is required" })

            const newHighlight = new Highlight({ user: req.user,title, picture, stories })
            await newHighlight.save()

            res.json({
                message: 'Highlight Created!',
                newHighlight: {
                    ...newHighlight._doc,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    updateHighlight: async (req, res) => {
        try {
            await Highlight.findOneAndDelete({ user: req.user.id })
            res.json({ message: 'Deleted Highlight!' })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deleteHighlight: async (req, res) => {
        try {
            await Highlight.findOneAndDelete({ user: req.user.id })
            res.json({ message: 'Deleted Highlight!' })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getUserHighlights: async (req, res) => {
        try {
            const highlights = await Highlight.find({ user: req.params.id}).populate("user", "profileImage username fullname note").populate({path:'stories', populate: {path:'user views hearts'}})
            res.json({
                result: highlights.length,
                highlights
            })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
}

module.exports = highlightCtrl