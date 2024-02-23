const mongoose = require("mongoose");
const { Schema } = mongoose;

const DiscussionSchema = new Schema(
  {
    title: { type: "String", required: true },
    posted_by: { type: "String", required: true },
    status: { type: "String", required: true, default:"Active" }
  },
  { timestamps: true }
);

const Discussion = mongoose.model("discussion", DiscussionSchema);

module.exports = Discussion;
