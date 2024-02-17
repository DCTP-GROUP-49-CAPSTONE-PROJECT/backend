const mongoose = require("mongoose");
const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    donor_id: { type: "String", ref: 'User', required: true },
    drive_id: { type: "String", ref: 'Drive', required: true },
    provider_id: { type: "String", ref: 'Provider', required: true },
    date: { type: "String", required: true },
    time: { type: "String", required: true },
    status: { type: "String", required: true, default: "Pending" },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("schedule", ScheduleSchema);

module.exports = Schedule;
