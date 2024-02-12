const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProviderSchema = new Schema(
  {
    facilityName: { type: "String", required: true },
    email: { type: "String", unique: true },
    password: { type: "String" },
    address: { type: "String" },
  },
  { timestamps: true }
);

const Provider = mongoose.model("provider", ProviderSchema);

module.exports = Provider;
