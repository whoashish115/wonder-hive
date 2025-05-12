const PostsGlimpses = require('../models/postGlimpseModel')
const Users = require('../models/userModel')
const Comments = require('../models/commentModel')
const Tools = require('../utils/tools')
const APIfeatures = require('../utils/features')

const postGlimpseCtrl = {
    createPostGlimpse: async (req, res) => {
        try {
            const { content, medias } = req.body
            if (medias.length < 0) return res.status(400).json({ error: 'Atleast one media is required' })
            const glimpse = medias.length == 1 && Tools.mediaTools.isVideo(medias[0].url) ? true : false
            const newPostGlimpse = new PostsGlimpses({ content, medias, user: req.user._id, glimpse })
            await newPostGlimpse.save()

            if (glimpse) await Users.findOneAndUpdate({ _id: req.user._id }, { $inc: { glimpsesCount: 1 } }, { new: true })
            else await Users.findOneAndUpdate({ _id: req.user._id }, { $inc: { postsCount: 1 } }, { new: true })

            res.json({
                message: glimpse ? 'Glimpse Created!' : 'Post Created!',
                newPostGlimpse: {
                    ...newPostGlimpse._doc,
                    user: req.user
                }
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    updatePostGlimpse: async (req, res) => {
        try {
            const { content, medias } = req.body
            if (medias.length < 0) return res.status(400).json({ error: 'Atleast one media is required' })
            const glimpse = medias.length == 1 && Tools.mediaTools.isVideo(medias[0].url) ? true : false

            const postGlimpse = await PostsGlimpses.findOneAndUpdate({ _id: req.params.id }, {
                content, medias, glimpse
            }).populate("user likes", "profileImage username fullname")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                message: glimpse ? "Updated Glimpse!" : "Updated Post!",
                updatedPostGlimpse: {
                    ...postGlimpse._doc,
                    content, images
                }
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    deletePostGlimpse: async (req, res) => {
        try {
            const deletedPostGlimpse = await PostsGlimpses.findOneAndDelete({ _id: req.params.id, user: req.user._id })
            await Comments.deleteMany({ _id: { $in: deletedPostGlimpse.comments } })
            res.json({ message: deletedPostGlimpse.glimpse ? 'Deleted Glimpse' : 'Deleted Post!', deletedPostGlimpse })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    likePostGlimpse: async (req, res) => {
        try {
            // checking if user already liked
            const isLikePostGlimpse = await PostsGlimpses.findOne({ _id: req.params.id, likes: req.user._id })
            if (isLikePostGlimpse) return res.status(400).json({ error: "You already liked this post/glimpse." })

            const likePostGlimpse = await PostsGlimpses.findOneAndUpdate({ _id: req.params.id }, { $push: { likes: req.user._id } }, { new: true })
            if (!likePostGlimpse) return res.status(400).json({ error: 'This post/glimpse does not exist.' })

            res.json({ message: 'post/glimpse Liked!' })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    removeLikePostGlimpse: async (req, res) => {
        try {
            const removelikePostGlimpse = await PostsGlimpses.findOneAndUpdate({ _id: req.params.id }, { $pull: { likes: req.user._id } }, { new: true })
            if (!removelikePostGlimpse) return res.status(400).json({ error: 'This post/glimpse does not exist.' })

            res.json({ message: 'Remove Like from post/glimpse!' })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    savePostGlimpse: async (req, res) => {
        try {

            const isSavePostGlimpse = await PostsGlimpses.findOne({ _id: req.params.id, saves: req.user._id })
            if (isSavePostGlimpse) return res.status(400).json({ error: "You already saved this post/glimpse." })

            const savePostGlimpse = await PostsGlimpses.findOneAndUpdate({ _id: req.params.id }, { $push: { saves: req.user._id } }, { new: true })
            if (!savePostGlimpse) return res.status(400).json({ error: 'This post/glimpse does not exist.' })

            res.json({ message: 'Saved Post/Glimpse!' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    removeSavePostGlimpse: async (req, res) => {
        try {
            const removeSavePostGlimpse = await PostsGlimpses.findOneAndUpdate({ _id: req.params.id }, { $pull: { saves: req.user._id } }, { new: true })
            if (!removeSavePostGlimpse) return res.status(400).json({ error: 'This post/glimpse does not exist.' })

            res.json({ message: 'unSaved from post/glimpse!' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    getPostGlimpseById: async (req, res) => {
        try {
            const postGlimpse = await PostsGlimpses.findById(req.params.id)
                .populate("user likes", "profileImage username fullname followers requests")

            const newPostGlimpse = await postGlimpse.populate({ path: "comments", populate: { path: "user likes", select: "-password " } })

            if (!newPostGlimpse) return res.status(400).json({ error: 'This post/glimpse does not exist.' })
            res.json({ postGlimpse: newPostGlimpse })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getPostById: async (req, res) => {
        try {
            const post = await PostsGlimpses.findOne({ _id: req.params.id, glimpse: false })
            .populate("user likes", "profileImage username fullname followers requests")
            .populate({ path: "comments", populate: { path: "user likes", select: "-password " } })
        if (!post) return res.status(400).json({ error: 'This post does not exist.' })
        res.json({ post })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getGlimpseById: async (req, res) => {
        try {
            const glimpse = await PostsGlimpses.findOne({ _id: req.params.id, glimpse: true })
            .populate("user likes", "profileImage username fullname followers requests")
            .populate({ path: "comments", populate: { path: "user likes", select: "-password " } })

            if (!glimpse) return res.status(400).json({ error: 'This glimpse does not exist.' })
            res.json({ glimpse })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getFeedPostsGlimpses: async (req, res) => {
        try {
            const features = new APIfeatures(PostsGlimpses.find({
                user: [...req.user.followings, req.user._id]
            }), req.query).paginating()

            const postsGlimpses = await features.query.sort('-createdAt')
                .populate("user likes", "profileImage username fullname followers requests")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                message: 'Success!',
                result: postsGlimpses.length,
                postsGlimpses
            })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getSavePostsGlimpses: async (req, res) => {
        try {
            const features = new APIfeatures(PostsGlimpses.find({
                saves: req.user._id
            }), req.query).paginating()

            const savePostsGlimpses = await features.query.sort("-createdAt").populate("user likes", "profileImage username fullname followers requests")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })
            res.json({ savePostsGlimpses, result: savePostsGlimpses.length })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(PostsGlimpses.find({ user: req.params.id, glimpse: false }), req.query)
            .paginating()
            const posts = await features.query.sort("-createdAt").populate('user likes','profileImage  username fullname followers requests')
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })
            res.json({ posts, result: posts.length })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getUserGlimpses: async (req, res) => {
        try {
            const features = new APIfeatures(PostsGlimpses.find({ user: req.params.id, glimpse: true }), req.query)
                .paginating()
            const glimpses = await features.query.sort("-createdAt").populate('user likes',"profileImage username fullname followers requests")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })
            res.json({ glimpses, result: glimpses.length })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getExplorePosts: async (req, res) => {
        try {
            const newArr = [...req.user.followings, req.user._id]
            const num = req.query.num || 9


            let posts = await PostsGlimpses.aggregate([
                { $match: { user: { $nin: newArr }, glimpse: false } },
                { $sample: { size: Number(num) } },
            ])
            if(posts.length == 0){
                posts = await PostsGlimpses.aggregate([
                    { $match: { user: { $in: newArr }, glimpse: false } },
                    { $sample: { size: Number(num) } },
                ])
            }

            const populatedPosts = await PostsGlimpses.populate(posts, { path: "user likes", select: "profileImage requests username fullname followers" })
            const commentPopulatedPosts = await PostsGlimpses.populate(populatedPosts, {
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })
            return res.json({ message: 'Success!', result: commentPopulatedPosts.length, posts: commentPopulatedPosts })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getExploreGlimpses: async (req, res) => {
        try {
            const newArr = [...req.user.followings, req.user._id]
            const num = req.query.num || 9

            let glimpses = await PostsGlimpses.aggregate([
                { $match: { user: { $nin: newArr }, glimpse: true } },
                { $sample: { size: Number(num) } },
            ])
            if(glimpses.length == 0){
                glimpses = await PostsGlimpses.aggregate([
                    { $match: { user: { $in: newArr }, glimpse: true } },
                    { $sample: { size: Number(num) } },
                ])
            }

            const populatedGlimpses = await PostsGlimpses.populate(glimpses, { path: "user likes", select: "profileImage requests username fullname followers" })
            const commentPopulatedGlimpses = await PostsGlimpses.populate(populatedGlimpses, {
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            return res.json({ message: 'Success!', result: commentPopulatedGlimpses.length, glimpses: commentPopulatedGlimpses })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
}

module.exports = postGlimpseCtrl