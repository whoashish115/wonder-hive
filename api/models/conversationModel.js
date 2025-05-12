const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    title: { type: String, default:''},
    bio: { type: String, default:'' },
    picture:  { type: String,  default:"https://res.cloudinary.com/programminghero/image/upload/v1641816261/Profile%20Images/User_Blue_zsb2vt.png" },
    isGroup: { type: Boolean, default: false },
    leavedMembers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    inviteLink: { type: String, default:'' },
    creator: { type: mongoose.Types.ObjectId, ref: 'user' },
    admins: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    endMessage: { type: String },
    endMessageDate: { type: Date },
    messagesCount: {},
    unseenMessagesCount: {},
    removedFrom: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    deleted: { type: Boolean, default:false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("conversation", conversationSchema);
