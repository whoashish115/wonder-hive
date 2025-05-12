const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    media: {type: Object},
    hearts: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    views: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    archive: { type: Date, required:true },
    deleted: { type: Boolean, default:false },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("story", storySchema);
