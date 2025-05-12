const mongoose = require("mongoose");

const highlightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    picture: {
      type: Object,
    },
    stories: [{ type: mongoose.Types.ObjectId, ref: 'story' }],
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default:false },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("highlight", highlightSchema);
