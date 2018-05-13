var express = require("express");
var sendRoutes = express.Router();//required to make this separate file works

const controller = require("../controllers/controller.js");//where all the functions reside for normal reshwap
const sticker = require("../controllers/stickerController.js");//where all the functions reside for stickers

//these specify which routes the user goes to will send something

sendRoutes.route("/")
  .get(controller.indexPage)
  .post(controller.login);

sendRoutes.route("/auth/facebook")
  .get(controller.facebookLogin);

sendRoutes.route("/auth/facebook/callback")
  .get(controller.facebookCallback);

sendRoutes.route("/auth/google")
  .get(controller.googleLogin);

sendRoutes.route("/auth/google/callback")
  .get(controller.googleCallback);

sendRoutes.route("/logout")
  .get(controller.logout);

sendRoutes.route("/register")
  .get(controller.register)
  .post(controller.signUp);

sendRoutes.route("/home")
  .get(isLoggedIn, controller.homePage);

sendRoutes.route("/upload")
  .get(isLoggedIn, controller.upload)
  .post(isLoggedIn, controller.toDB);

sendRoutes.route("/novaUpload")
  .post(isLoggedIn, controller.updateDB);

sendRoutes.route("/delete")
  .post(isLoggedIn, controller.deleteUserReshwap);

sendRoutes.route("/books")
  .get(isLoggedIn, controller.books);

sendRoutes.route("/furniture")
  .get(isLoggedIn, controller.furniture);

sendRoutes.route("/electronics")
  .get(isLoggedIn, controller.electronics);

sendRoutes.route("/other")
  .get(isLoggedIn, controller.other);

sendRoutes.route("/chatroom")
  .get(isLoggedIn, isMatthew, controller.chatroomMatin);

sendRoutes.route("/edit")
  .post(isLoggedIn, controller.editCatch)
  .get(isLoggedIn, controller.editSend);
  //need to fix the edit portion still

sendRoutes.route("/stickers/")
  .get(isLoggedIn, sticker.stickerHome);

  sendRoutes.route("/stickers/upload")
    .get(isLoggedIn, isAdmin, sticker.stickerRegister)
    .post(isLoggedIn, isAdmin, sticker.stickerSend);

sendRoutes.route("/stickers/lookup")
  .get(isLoggedIn, isAdmin, sticker.stickerLook)
  .post(isLoggedIn, isAdmin, sticker.stickerFind);

sendRoutes.route("/stickers/delete")
  .post(isLoggedIn, isAdmin, sticker.deleteSticker);

sendRoutes.route("/mail")
  .post(isLoggedIn, isAdmin, sticker.sendMail);

//THIS FUNCTION CHECKS IF USER IS LOGGED IN
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    console.log("person logged in "+req.user.matthew.name);
    return next();
  }
    res.redirect('/')
}

function isMatthew(req, res, next){
  if(req.user.matthew.name.familyName == "Gunton"){
    return next();
  }
  console.log('not matthew');
  res.redirect("/");
}

function isAdmin (req, res, next){
  var administrators = ['mgunton18@lawrenceville.org', 'beldridge@lawrenceville.org', 'echeng18@lawrenceville.org'];
  for(var i = 0; i<administrators.length; i++){
    var guy = req.user.matthew.email;
    if(guy == administrators[i]){
      return next();
    }
  }
  console.log('not administrator');
  res.redirect("/");
}

module.exports = sendRoutes;
