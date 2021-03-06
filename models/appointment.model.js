const mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema({
    user: { type: ObjectId, ref: "User", required: true },
    prestations: [
      {
        type: ObjectId,
        ref: "Prestation",
      },
    ],
    created_at: Date,
    slots: { type: ObjectId, ref: "Slot" },
  })
);

module.exports = Appointment;
