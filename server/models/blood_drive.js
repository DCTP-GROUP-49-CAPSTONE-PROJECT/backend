const mongoose = require("mongoose");
const User = require("./user");
const { Schema } = mongoose;

const DriveSchema = new Schema(
  {
    title: { type: "String", required: true },
    tokenAmount: { type: "String", required: true },
    userId: { type: mongoose.Types.ObjectId, ref:User, required: true },
    startDate: { type: "String", required: true },
    endDate: { type:"String", required: true }
  },
  { timestamps: true }
);

const Drive = mongoose.model("blood_drive", DriveSchema);

module.exports = Drive;
