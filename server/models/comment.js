const mongoose = require("mongoose");
const Discussion = require('./discussion')
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    discussion_id: { type: mongoose.Types.ObjectId, ref: Discussion, required: true },
    commented_by: { type: "String", required: true },
    comment: { type: "String", required: true },
    vote: { type: "Number", required: true, default: 0 }
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
