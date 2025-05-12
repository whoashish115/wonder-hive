const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    recipients: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    url: String,
    text: String,
    content: String,
    media: {type:Object},
    readBy: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    removedFrom: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    deleted: { type: Boolean, default:false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notify", notifySchema);
