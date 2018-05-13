var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

const controller = require("../controllers/controller.js");

sendRoutes.route("/auth/facebook")
  .get(controller.facebookLogin);

sendRoutes.route("/auth/facebook/callback")
  .get(controller.facebookCallback);

sendRoutes.route("/auth/google")
  .get(controller.googleLogin);

sendRoutes.route("/auth/google/callback")
  .get(controller.googleCallback);

module.exports = sendRoutes;
