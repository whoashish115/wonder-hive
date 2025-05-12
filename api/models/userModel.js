const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/programminghero/image/upload/v1641816261/Profile%20Images/User_Blue_zsb2vt.png",
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      default: "male",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    note: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    accountPrivate: {type: Boolean,default: false,},
    lastActive: { type: Date, default: Date.now },
    showActivity: { type: Boolean, default:true },
    postsCount: { type: Number, default:0 },
    glimpsesCount: { type: Number, default:0 },
    followers: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    followings: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    blocked: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    requests: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    verified: { type: Boolean, default:false },
    deleted: { type: Boolean, default:false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
