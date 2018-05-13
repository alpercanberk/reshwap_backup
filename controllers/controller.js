const mattModel = require("../models/reshwapSchema.js");//allows us to post the database and store in useful data
var fs = require('fs');//allows us to move the files for fileupload
var User = require("../models/users.js");//allows us to search the userbase, and register new ones

var passport = require("passport");//because we cannot pass it through on app.js

//un-comment the bottom sharp regarding 'sharp' for DO
var sharp = require("sharp");

//time variables

var whole = new Date();

var year = whole.getFullYear();
var day = whole.getDate();
var month = whole.getMonth()+1;
var hour = whole.getHours();
var minute = whole.getMinutes();
var seconds = whole.getSeconds();

exports.indexPage = function(req, res){
  res.render("index", {message: req.flash("loginMessage")});
}

exports.login = passport.authenticate('local-login', {
  //this lets passport take over in authentication
  successRedirect: '/home',//lets us add in the user for a shortterm solution
  failureRedirect: '/',//if it fails, let's us flash the message of "login failed"
});

exports.facebookLogin = passport.authenticate('facebook', {scope: ['profile', 'email']});

exports.facebookCallback = passport.authenticate('facebook', {
  successRedirect: '/home',
  failureRedirect: '/',
});

exports.googleLogin = passport.authenticate('google', {scope: ['profile', 'email']});

exports.googleCallback = passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true
})

exports.logout = function (req, res){
  console.log(req.user.matthew.name.givenName+" logged out");
  req.logout();
  res.redirect("/");
}

exports.register = function (req, res){
  res.render("register", {message: req.flash('signupMessage') });
}

exports.signUp = passport.authenticate('local-signup', {
  //this lets passport take over in authentication
    successRedirect: "/home",//lets us add in the user for a shortterm solution
    failureRedirect: "/register",
    failureFlash: true//if it fails, let's us flash the message of "registration failed"
  });

exports.homePage = function(req, res){
  mattModel.find({email: req.user.matthew.email}).then(function(data){//has us find data and then bring it into the page
    console.log(req.user);
    res.render("home", {user: req.user.matthew, data: data, message: req.flash("homeMessage")});
  })
}

exports.upload = function(req, res){
  res.render("upload", {user: req.user.matthew, message: req.flash("successMessage"), link: req.flash("categoryMessage")})
}

exports.toDB = function(req, res){

  if(req.files.image){//lets us save the reshwap form whether or not there is an image
      new mattModel ({//this saves the new reshwap form to the db
        user: req.user.matthew.fullName,
        category: req.body.category,
        title: req.body.title,
        email: req.user.matthew.email,
        image: req.user.matthew.email+"_"+req.body.title+"_"+year+"_"+month+"_"+day+"_"+hour+"_"+minute+"_"+seconds,
        description: req.body.description
      }).save().then(function(result){
        console.log("successfully saved: "+result);
        var image = req.files.image,
          filename = image.name;

          image.mv("./userImages/"+filename, function(err){//puts image in place where we can find it easily
          if(err){
          throw err;}
        });

          sharp(image.data)//makes image small for storage sake
            .resize(400, 300)
            .toFile('./userImages/'+filename)

        console.log(req.files);

        fs.rename("./userImages/"+filename, "./userImages/"+req.user.matthew.email+"_"+req.body.title+"_"+year+"_"+month+"_"+day+"_"+hour+"_"+minute+"_"+seconds, function(err){
          if(err){throw err}else{//renames image so we can find it easily
            console.log(req.user.matthew.name.givenName+' saved with image');
            req.flash('successMessage', "successfully uploaded "+req.body.title+" to ");
            req.flash("categoryMessage", req.body.category)
            res.redirect("/upload");
          }
        });
      })
}//end of if image file is sent
else{
  new mattModel ({//this saves the new reshwap form to the db
    user: req.user.matthew.fullName,
    category: req.body.category,
    title: req.body.title,
    email: req.user.matthew.email,
    image: null,
    description: req.body.description
  }).save().then(function(result){
    console.log("successfully saved: "+result);
    req.flash('successMessage', "successfully uploaded "+req.body.title+" to ");
    req.flash("categoryMessage", req.body.category)
    res.redirect("/upload");
})

}
}

exports.books = function(req, res){//displays books by pulling from db
  mattModel.find({category: "Books"}).then(function(data){
  console.log("went to books");
  res.render("books", {user: req.user.matthew, data: data});
})
}

exports.furniture = function(req, res){//displays furniture by pulling from db
  mattModel.find({category: "Furniture"}).then(function(data){
  console.log("went to furniture");
  res.render("furniture", {user: req.user.matthew, data: data});
})
}

exports.electronics = function(req, res){//displays electronics by pulling from db
  mattModel.find({category: "Electronics"}).then(function(data){
  console.log("went to electronics");
  res.render("electronics", {user: req.user.matthew, data: data});
})
}

exports.other = function(req, res){//displays other by pulling from db
  mattModel.find({category: "Other"}).then(function(data){
  console.log("went to other");
  res.render("other", {user: req.user.matthew, data: data});
})
}

exports.editCatch = function(req, res){//this lets us edit
  mattModel.find({title: req.body.editTitle, email: req.user.matthew.email}, function(err, result){
    req.session.result = {//finds what we want to be edited and puts it into a session variable
      data: result
    }
    res.redirect("/edit");
  })
}

exports.editSend = function(req, res){
  console.log(req.session.result);
  res.render('edit', {data: req.session.result.data, user: req.user.matthew});
}

exports.updateDB = function(req, res){
  console.log("make sure session is acessible "+req.session.result.data[0]._id);
  if(req.files.image){//same as in toDB lets us edit a form whether or not it has an image
  mattModel.findOneAndUpdate({title: req.session.result.data[0].title, email: req.user.matthew.email}, {
    category: req.body.category,
    title: req.body.title,//replaces what the stuff was before with what it has now
    description: req.body.description,
    image: req.user.matthew.email+"_"+req.body.title+"_"+year+"_"+month+"_"+day+"_"+hour+"_"+minute+"_"+seconds
  }).then(function(){

    console.log("successfully saved: "+req.session.result.data[0].title);
    var image = req.files.image,
      filename = image.name;

      image.mv("./userImages/"+filename, function(err){
      if(err){
      throw err;}
    });

      sharp(image.data)
        .resize(400, 300)
        .toFile('./userImages/'+filename)

    console.log("successful saved "+image.name);

    fs.rename("./userImages/"+filename, "./userImages/"+req.user.matthew.email+"_"+req.body.title+"_"+year+"_"+month+"_"+day+"_"+hour+"_"+minute+"_"+seconds, function(err){
      if(err){throw err}else{
        console.log(req.user.matthew.name.givenName+' saved with image');
        mattModel.findOne({email: req.user.matthew.email, _id: req.session.result.data[0]._id}).then(function(result){
          console.log("successful edit "+result);
          req.flash("homeMessage", "successfully edited "+req.body.title);
          res.redirect("/home");
           })
      }
    });
     })
   }else{
     mattModel.findOneAndUpdate({title: req.session.result.data[0].title, email: req.user.matthew.email}, {
       category: req.body.category,
       title: req.body.title,
       description: req.body.description
     }).then(function(){
        mattModel.findOne({email: req.user.matthew.email, _id: req.session.result.data[0]._id}).then(function(result){
          console.log("successful edit "+result);
          req.flash("homeMessage", "successfully edited "+req.body.title);
          res.redirect("/home");
           })
        })
   }
}

exports.deleteUserReshwap = function(req, res){
  mattModel.findOneAndRemove({email: req.user.matthew.email, title: req.body.deleteTitle}).then(function(){
    mattModel.findOne({email: req.user.matthew.email, title: req.body.title}).then(function(result){
      if(result ===  null){//makes sure that the reshwap form was deleted
        console.log(req.user.matthew.name.givenName+" deleted "+req.body.deleteTitle);
        req.flash("homeMessage", "successfully deleted "+req.body.deleteTitle);
        res.redirect("/home");
      }
      else{
        console.log("delte error");
      }
    })

  })
}


//ALL EXPERIMENTAL, needs to be worked on more
var chatModel = require("../models/chatModel.js");

exports.chatroomMatin = function(req, res){
  res.render("chatroom", {user: req.user.matthew})
}

exports.chatroomSent = function(rqe, res){
  new chatModel({
    user: req.user.matthew.email,
    item: req.session.item.title,
    message: req.body.chatInput
  }).save().then(function(err, data){
    if(err) {throw err;}
    else{
      res.redirect("/chatroom");
    }

  })
}
