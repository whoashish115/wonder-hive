const Comments = require('../models/commentModel')
const PostsGlimpses = require('../models/postGlimpseModel')


const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { postGlimpseId, content, tag, reply, postGlimpseUserId } = req.body

            const post = await PostsGlimpses.findById(postGlimpseId)
            if(!post) return res.status(400).json({error: "This post/glimpse does not exist."})

            if(reply){
                const cm = await Comments.findById(reply)
                if(!cm) return res.status(400).json({error: "This comment does not exist."})
            }

            const newComment = new Comments({
                user: req.user._id, content, tag, reply, postGlimpseUserId, postGlimpseId
            })

            await PostsGlimpses.findOneAndUpdate({_id: postGlimpseId}, {
                $push: {comments: newComment._id}
            }, {new: true})
            await newComment.save()

            res.json({newComment})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content } = req.body
            
            await Comments.findOneAndUpdate({
                _id: req.params.id, user: req.user._id
            }, {content})

            res.json({message: 'Update Success!'})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    likeComment: async (req, res) => {
        try {
            const comment = await Comments.find({_id: req.params.id, likes: req.user._id})
            if(comment.length > 0) return res.status(400).json({error: "You already liked this comment"})

             const like = await Comments.findOneAndUpdate({_id: req.params.id}, {$push: {likes: req.user._id}}, {new: true})
            if (!like) return res.status(400).json({ error: 'This Comment does not exists' })

            res.json({message: 'Liked Comment!'})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    removeLikeComment: async (req, res) => {
        try {
            const like = await Comments.findOneAndUpdate({_id: req.params.id}, {$pull: {likes: req.user._id}}, {new: true})
            if (!like) return res.status(400).json({ error: 'This post does not exist.' })

            res.json({message: 'UnLiked Comment!'})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    deleteComment: async (req, res) => {
        try {
            await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    {user: req.user._id},
                    {postGlimpseUserId: req.user._id}
                ]
            })
           await Comments.deleteMany({reply:req.params.id, $or: [
                {user: req.user._id},
                {postGlimpseUserId: req.user._id}
            ]})

            res.json({message: 'Deleted Comment!'})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
}


module.exports = commentCtrl