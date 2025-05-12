const Notify = require('../models/notifyModel')

const notifyCtrl = {
    createNotify: async (req, res) => {
        try {
            const { id, recipients, url, text, content, media } = req.body
            if (recipients.includes(req.user._id.toString())) return

            const notify = new Notify({ id, recipients, url, text, content, media, user: req.user._id })
            await notify.save()
            return res.json({ message: "success", notify })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    readAllNotify: async (req, res) => {
        try {
            await Notify.updateMany({ recipients: req.user._id }, { $push: { readBy: req.user._id } })
            return res.json({ message: "success" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    removeNotify: async (req, res) => {
        try {
            const notify = await Notify.findOneAndUpdate({
                id: req.params.id
            })

            return res.json({ message: "success", notify })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    removeAllNotify: async (req, res) => {
        try {
            await Notify.updateMany({ recipients: req.user._id })
            return res.json({ message: "success" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getAllNotify: async (req, res) => {
        try {
            const notifies = await Notify.find({ recipients: req.user._id }).sort('-createdAt').populate('user', 'profileImage  username')
            return res.json({ message: "success", notifies })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
 
   
}


module.exports = notifyCtrl