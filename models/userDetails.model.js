const mongoose = require("mongoose");

ObjectId = mongoose.Schema.Types.ObjectId;

const userDetails = mongoose.model(
  "userDetails",
  new mongoose.Schema({
    name: { type: String, unique: true, required: true, trim: true },
    phone: { type: Number, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String },
    roles: [
      {
        type: ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = userDetails;