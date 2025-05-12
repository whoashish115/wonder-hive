const Users = require("../models/userModel");
const APIfeatures = require("../utils/features");

const userCtrl = {
    getAllUsers: async (req, res) => {
        try {
            const feature = new APIfeatures(Users.find(), req.query).paginating()
            const users = await feature.query.sort('-createdAt').select('-password')

            return res.json({ result: users.length, users })
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getUserSuggestions: async (req, res) => {
        try {
            const newArr = [...req.user.followings, req.user._id]

            const num = req.query.num || 10

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } , requests :{$nin:[req.user._id]}} },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'followings', foreignField: '_id', as: 'followings' } },
            ]).project('-password')

             const newUsers =await Users.populate(users, {path: "followers followings requests"});

            return res.json({
                users:newUsers,
                result: newUsers.length
            })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    getProfileSuggestions: async (req, res) => {
        try {
            const profileUser = await Users.findOne({_id:req.params.id})
            const userArr = [...req.user.followings, req.user._id, , profileUser._id]
            const profileArr = [...profileUser.followings, ...profileUser.followers]
            const num = req.query.num || 10
            const users = await Users.aggregate([
                { $match: {_id: { $nin: userArr,$in: profileArr}} },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'followings', foreignField: '_id', as: 'followings' } },
            ]).project("-password")

            const newUsers =await Users.populate(users, {path: "followers followings requests"});

            return res.json({
                users:newUsers,
                result: newUsers.length
            })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },
    searchUsers: async (req, res) => {
        try {
            const users = await Users.find({ $username: { $search: req.query.username } }).select("fullname username profileImage bio lastActive followers followings requests accountPrivate")
            res.json({ users })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    checkUsername: async (req, res) => {
        try {
            const user = await Users.findOne({ username:req.params.username })
            if(user){
                return res.json({ isAvailable:false })
            }
            else{
                return res.json({ isAvailable:true })

            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    delete: async (req, res) => {
        try {
            res.json({ message: "profile update" })
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getProfileById: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select("-password").populate("followers followings requests", '-password')
            if (!user) return res.status(500).json({ error: "User does not exists" })
            res.json({ user })
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getProfileByUsername: async (req, res) => {
        try {
            const user = await Users.findOne({ username: req.params.username }).select("-password").populate("followers followings requests", '-password')
            if (!user) return res.status(500).json({ error: "User does not exists" })
            res.json({ user })
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    updateUserProfle: async (req, res) => {
        const { profileImage, fullname, username, gender, website, bio, accountPrivate, showActivity } = req.body;

        const users = await Users.find({ username })
        if (users.length >1) {
            return res.status(500).json({ error: "username already exists" })
        }

        if (!fullname) return res.status(500).json({ error: "Please add your fullname" })
        await Users.findOneAndUpdate({ _id: req.user._id }, { profileImage, fullname, username, gender, bio, website, showActivity, accountPrivate })

        res.json({ message: "Profile Updated" })

    },
    addNoteProfile: async (req, res) => {
        const { note } = req.body;

        const user = await Users.findOneAndUpdate({ _id:req.user._id }, {note}, {new:true})
        if (!user) return res.status(500).json({ error: "this user doesn't exist" })

        return res.json({ message: "Note added" })
    },
    deleteNoteProfile: async (req, res) => {
        const user = await Users.findOneAndUpdate({ _id:req.user._id }, {note:''})
        if (!user) return res.status(500).json({ error: "this user doesn't exist" })
            return res.json({ message: "Note deleted" })
    },

    followRequestProfile: async (req, res) => {
        try {
            const user = await Users.findOne({ _id: req.params.id })
            if (user.followers.filter(id => id == req.user._id).length > 0) return res.status(500).json({ error: "You already followed this user" })
            if (user.requests.filter(id => id == req.user._id).length > 0) return res.status(500).json({ error: "You already requested this user" })
            
                if (user.accountPrivate) {
                await Users.findOneAndUpdate({ _id: req.params.id }, { $push: { requests: req.user._id } }, { new: true })
                return res.json({ message: "Follow Request Send" })
            }
            else {
                await Users.findOneAndUpdate({ _id: req.params.id }, { $push: { followers: req.user._id } }, { new: true })
                await Users.findOneAndUpdate({ _id: req.user._id }, { $push: { followings: req.params.id } }, { new: true })
                return res.json({ message: "User Followed" })
            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    followRequestAcceptProfile: async (req, res) => {
        try {
            const user = await Users.findOne({ _id: req.user._id })
            if (user.followers.filter(id => id == req.params.id).length > 0) return res.status(500).json({ error: "You have already  this user followed" })
           
            await Users.findOneAndUpdate({ _id: req.params.id }, { $push: { followings: req.user._id }, }, { new: true })
            await Users.findOneAndUpdate({ _id: req.user._id }, { $push: { followers: req.params.id }, $pull: { requests: req.params.id } }, { new: true })

            res.json({ message: "Sucess" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    followRequestDeclineProfile: async (req, res) => {
        try {
            await Users.findOneAndUpdate({ _id: req.user._id }, { $pull: { requests: req.params.id }}, { new: true })
            res.json({ message: "Sucess" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    unfollowUserProfile: async (req, res) => {
        try {
            await Users.findOneAndUpdate({ _id: req.params.id }, { $pull: { followers: req.user._id, requests: req.user._id } }, { new: true })
            await Users.findOneAndUpdate({ _id: req.user._id }, { $pull: { followings: req.params.id }, }, { new: true })

            res.json({ message: "User UnFollowed" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
};


module.exports = userCtrl;
