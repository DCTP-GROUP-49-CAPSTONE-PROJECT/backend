const mongoose = require("mongoose");
const { Schema } = mongoose;

const LikeCommentSchema = new Schema(
  {
    comment_id: { type: "String", required: true },
    user_id: { type: "String", required: true },
  },
  { timestamps: true }
);

const LikeComment = mongoose.model("like_comment", LikeCommentSchema);

module.exports = LikeComment;