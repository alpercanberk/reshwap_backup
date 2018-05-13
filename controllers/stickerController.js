var sModel = require("../models/stickerSchema.js");
const user = require("../models/users.js");

const conf = require("../config/auth.js");

'use strict';//helps with nodemailer, nothing beyond that
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

exports.stickerHome = function(req, res){
  sModel.find({email: req.user.matthew.email}).then(function(data){
    console.log("sticker system launched");
    req.session.sticker = "";//sets up a session so when we go to lookup it doesn't crash
    res.render("stickers/stickerHome", {data: data, user: req.user.matthew, message: req.flash("sentMessage")});
  })
}

exports.stickerRegister = function(req, res){
  res.render("stickers/stickerRegister", {user: req.user.matthew, message: req.flash("succcessfulUpload")});
}

exports.stickerSend = function(req, res){
  console.log("reached");
  new sModel ({
    title: req.body.title,
    user: req.body.user,
    number: req.body.number,
    email: req.body.email
  }).save().then(function(result){
    //issue is I cannot find the collection entitled: sModel in my mongoDB!!!!!
    console.log(result);
    req.flash("succcessfulUpload", "Successfully added in "+result.title+" #"+result.number);
    res.redirect("/stickers/upload");//back to get route
  })
}

exports.stickerLook = function(req, res){

  if(req.session.sticker == null){//makes sure we don't crash if not data is found
    console.log(req.user);
    res.render("stickers/stickerLookup", {user: req.user.matthew, data: null});
  }else{
    console.log(req.user);
    res.render("stickers/stickerLookup", {user: req.user.matthew, data: req.session.sticker});
    }
}

exports.stickerFind = function(req, res){
  console.log(req.body.sticker);
  sModel.find({number: req.body.sticker}).then(function(data){
    req.session.sticker = data;//finds data then stores it in the session variable
    console.log(data);
    res.redirect("/stickers/lookup");
  })

}

exports.deleteSticker = function (req, res){
  sModel.findOneAndRemove({number: req.body.number}).then(function(){
    console.log('sticker '+req.body.number+' removed');
    res.redirect("/stickers/upload");
  })
}

exports.sendMail = function(req, res){//sends email to the owner once it is found
  var sticker = req.body.stickerNumber;
  sModel.findOne({number: sticker}).then(function(data){
    var email = data.email;
    var title = data.title;
    console.log("this is "+email);
    user.findOne({'matthew.email': email}).then(function(result){

      if(!result){
        console.log("this fool typed in the handle @lawrenceville.org along with it");
      }

      var receiver = result.matthew;
      var sender = req.user.matthew.name.givenName+" "+req.user.matthew.name.familyName;
      console.log(sender);
      var fullname = receiver.name.givenName+" "+receiver.name.familyName;
      var stickerMessage = fullname+", \r We are so happy to tell you that we were able to find your "+title+"!!!\r"+sender+" was able to find it. To claim your item, go to: . If the item is not yours, then go to the Dean of Students Office to pick it up. \r\n-Reshwap Sticker Team";

      const msg = {
          to: receiver.email,
          from: '"Reshwap Stickers" <reshwapatlawrenceville@gmail.com>',
          subject: '😊 We Found Your Item 😊',
          text: stickerMessage,
          // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        console.log('sent');
        sgMail.send(msg);
        req.flash("sentMessage", "Good work, we have notified the owner");
        res.redirect("/stickers")
    })
  })
}
