const mongoose = require("mongoose");

const postGlimpseSchema = new mongoose.Schema(
  {
    content: String,
    medias: {
        type: Array,
        default:[]
    },
    tags: [],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    saves: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    archive: { type: Boolean, default:false },
    glimpse: { type: Boolean, default:false },
    deleted: { type: Boolean, default:false },


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post-glimpse", postGlimpseSchema);
