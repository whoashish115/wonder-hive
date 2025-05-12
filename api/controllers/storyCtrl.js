const Story = require('../models/storyModel')
const APIfeatures = require('../utils/features')

const storyCtrl = {
    createStory: async (req, res) => {
        try {
            const { media } = req.body
            if (!media.url) return res.status(400).json({ error: "Media is required to create Story" })

            let currentDate = new Date();
            let futureDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
            const newStory = new Story({ media, user: req.user, archive: futureDate })
            await newStory.save()
            res.json({
                message: 'Story Created!',
                newStory: {
                    ...newStory._doc,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deleteStory: async (req, res) => {
        try {
            await Story.findOneAndDelete({ _id: req.params.id, user: req.user._id })
            res.json({ message: 'Deleted Story!' })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    viewStory: async (req, res) => {
        try {
            const isViewedStory = await Story.findOne({ _id: req.params.id, views: req.user._id })
            if (isViewedStory) return 

            const view = await Story.findOneAndUpdate({ _id: req.params.id }, { $push: { views: req.user._id } }, { new: true })
            if (!view) return res.status(400).json({ error: 'This story does not exist.' })

            res.json({ message: 'Story Viewed!' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    heartStory: async (req, res) => {
        try {
            const isHeartStory = await Story.findOne({ _id: req.params.id, hearts: req.user._id })
            if (isHeartStory) return res.status(400).json({ error: "You already hearted this story." })

            const heart = await Story.findOneAndUpdate({ _id: req.params.id }, { $push: { hearts: req.user._id } }, { new: true })
            if (!heart) return res.status(400).json({ error: 'This story does not exist.' })

            res.json({ message: 'Story Hearted!' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    removeHeartStory: async (req, res) => {
        try {
            const heart = await Story.findOneAndUpdate({ _id: req.params.id }, { $pull: { hearts: req.user._id } }, { new: true })
            if (!heart) return res.status(400).json({ error: 'This story does not exist.' })

            res.json({ message: 'Remove heart from story!' })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getFeedStories: async (req, res) => {
        try {
            const stories = await Story.find({ user: [...req.user.followings, req.user._id], archive: { $gte: new Date() } }).populate("user views hearts", "profileImage username fullname followers requests")
            res.json({ message: 'Success!', stories})
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getProfileStories: async (req, res) => {
        try {
            const stories = await Story.find({ user: req.params.id, archive: { $gte: new Date() } }).populate("user views hearts", "profileImage username fullname followers requests")
            res.json({ message: 'Success!',stories})
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getArchiveStories: async (req, res) => {
        try {
            const features = new APIfeatures(Story.find({
                user: [req.user._id], archive: { $lte: new Date() }
            }), req.query).paginating()

            const stories = await features.query.sort('-createdAt')
                .populate("user hearts views", "profileImage username fullname followers requests")

            res.json({
                message: 'Success!',
                result: stories.length,
                stories
            })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
}

module.exports = storyCtrl