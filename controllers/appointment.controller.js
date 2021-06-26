const db = require("../models");
const Appointment = db.appointment;
const Slot = db.slot;

require("dotenv").config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

//Templates from sendGrid account
const templates = {
  rendezvousConfirmed: "d-07dd92f729b6434794bb3ed6cfff85e0",
  rendezvousCancelled: "d-e1ba2bd0352f4c62a860a5a54bf2723c",
};

exports.allAppointments = (req, res) => {
  // Returns all appointments
  Appointment.find({})
    .populate("slots")
    .exec((err, appointments) => res.json(appointments));
};

exports.getUserAppointments = (req, res) => {
  return Appointment.find({ user: req.user.id })
    .populate("slots")
    .exec((err, appointments) => res.json(appointments));
};

exports.createAppointment = async (req, res) => {
  const requestBody = req.body;

  const emailPatrick = "marwa.rekik.pro@gmail.com";

  const msgRVConfirmed = {
    from: `Equipe IKDO <${emailPatrick}>`,
    templateId: templates.rendezvousConfirmed,
    personalizations: [
      {
        to: [{ email: req.user.email }],
      },
    ],
  };

  const newSlot = new Slot({
    slot_time: requestBody.slot_time,
    slot_date: requestBody.slot_date,
    created_at: Date.now(),
    user: req.user.id,
  });

  await newSlot.save();

  const newAppointment = new Appointment({
    prestation: requestBody.prestation,
    slots: newSlot._id,
    user: req.user.id,
  });

  newAppointment.save((err, saved) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    sendGridMail
      .send(msgRVConfirmed)
      .then((res) => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.log(error);
      });

    Appointment.find({ _id: saved._id })
      .populate("slots")
      .exec((err, appointment) => res.json(appointment));
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  const emailPatrick = "marwa.rekik.pro@gmail.com";

  Appointment.find({ id: id }).then((appointment) => {
    Slot.findOneAndDelete(appointment.slots).then(() => {
      Appointment.findOneAndDelete(id)
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Impossible de supprimer le rendez vous!`,
            });
          } else {
            res.send({
              message: "Votre rendez vous est annulé avec succès!",
            });

            const msgRVCancelled = {
              from: `Equipe IKDO <${emailPatrick}>`,
              templateId: templates.rendezvousCancelled,
              personalizations: [
                {
                  to: [{ email: appointment.user.email }],
                },
              ],
            };

            sendGridMail
              .send(msgRVCancelled)
              .then((res) => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Erreur lors de la suppression",
          });
        });
    });
  });
};
