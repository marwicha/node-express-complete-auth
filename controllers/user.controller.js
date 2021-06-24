const db = require("../models");
const User = db.userDetails;
const Appointment = db.appointment;
const Slot = db.slot;

// update user information
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les informations à mettre à jour ne peuvent pas être vides!",
    });
  }
  const id = req.params.id;

  const reqBody = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  User.findOneAndUpdate(id, reqBody, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour les informations avec id= $ {id}. ce utilisateur n'existe pas!`,
        });
      } else
        res.send({
          message: "Vos informations ont été mises à jour avec succès.",
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour des informations avec id=" + id,
      });
    });
};

exports.deleteUserAndAppointments = async (req, res) => {
  await Appointment.remove({ user: req.user.id });
  await Slot.remove({ user: req.user.id });
  // const slots = await Slot.find({ slots: appointments.slots.id });
  return res.json({ message: "ok" });
  // console.log(slots);
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
