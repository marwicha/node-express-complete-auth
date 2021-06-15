const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.userDetails = require("./userDetails.model");
db.role = require("./role.model");
db.appointment = require("./appointment.model");
db.slot = require("./slot.model");
db.prestation = require("./prestation.model");
db.formation = require("./formation.model");
db.tokens = require("./tokens.model");
db.ROLES = ["user", "admin"];

module.exports = db;
