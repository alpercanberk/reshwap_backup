var localStrategy = require("passport-local").Strategy;//imports authentication safeties from passport
var facebookStrategy = require("passport-facebook").Strategy;
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users.js');//allows me to store only things I care about, as specified in the model, ont random things passed through

var configAuth = require("./auth.js");

module.exports = function(passport){

  //takes the enormous file from db and makes it simple for my server
  passport.serializeUser(function(user, done){
    return done(null, user.id);
  });

  //for when you want to log out, prevents anything from logging you back in
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    })
  });


  //THIS FUNCTION USED TO AUTHENTICATE NEW SIGNUPS
  passport.use('local-signup', new localStrategy({
    //these rename predetermined variable names to the one specified in register.ejs name tags
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, user, password, done){
    process.nextTick(function(){//makes sure we wait until the data passes through
      User.findOne({'matthew.user': user}, function(err, foundUser){
        if(err){
          return done(err);
        }
        //checks if the user is already registered
        if(foundUser){
          return done(null, false, req.flash("signupMessage", "That email has already been signed up for Reshwap"))
        }else{
          //create new user
          var newUser = new User();
          console.log("in else "+user);
            newUser.matthew.user = user;
            newUser.matthew.name.givenName = givenName;
            newUser.matthew.name.familyName = familyName
            newUser.matthew.password = newUser.generateHash(password);
            newUser.save(function(err, result){
              if(err){
                throw err;}
              console.log("success! "+result);
              return done(null, newUser);
            });
        }

      })
    });
  }
))

//THIS FUNCTION USED TO AUTHENTICATE NORMAL LOGIN REQUESTS
passport.use("local-login", new localStrategy({
  //these rename predetermined variable names to the one specified in index.ejs name tags
  usernameField: 'user',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, user, password, done){
    process.nextTick(function(){//used to make sure the data doesn't go through until it is all loaded
      User.findOne({'local.user': user}, function(err, foundUser){
        if(err){
          return done(err);
        }
        //checks if the user exists, if not, they deny access
        if(!foundUser){
          console.log('no user');
          return done(null, false, req.flash("loginMessage", "Wrong username or password") );
        }
        //checks if user exists, but the password was wrong, denies access
        if(!foundUser.validPassword(password)){
          console.log('wrong password');
          return done(null, false, req.flash("loginMessage", "Wrong username or password"))
        }
        //if all else is OK, then the login attempt succeeds
        return done(null, foundUser);
      })
    })
  }
))

passport.use(new facebookStrategy({
  clientID: configAuth.facebookAuth.clientId,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL
},
  function(accessToken, refreshToken, profile, done){
    process.nextTick(function(){
      User.findOne({'matthew.id': profile.id}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, user);
        }else{
          var newUser = new User();
          newUser.matthew.provider = 'facebook'
          newUser.matthew.id = profile.id;
          newUser.matthew.token = accessToken;
          newUser.matthew.name.givenName = profile.name.givenName;
          newUser.matthew.name.familyName = profile.name.familyName;
          newUser.matthew.email = profile.emails[0].value;

          newUser.save(function(err, result){
            if(err){
              throw err;
            }
            else{
              console.log("new facebook "+result);
              return done(null, newUser);
            }
          })
        }
      })
    })
  }
))

passport.use(new googleStrategy({
  clientID: configAuth.googleAuth.clientId,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL
},
  function(accessToken, refreshToken, profile, done){
    process.nextTick(function(){
      User.findOne({'matthew.id': profile.id}, function(err, user){
        if(err){
          return done(err);
        }
        if(user){
          return done(null, user);
        }else{
          console.log('new google user');
          var newUser = new User();
          newUser.matthew.id = profile.id;
          newUser.matthew.token = accessToken;
          newUser.matthew.name.givenName = profile.name.givenName;
          newUser.matthew.name.familyName = profile.name.familyName;
          newUser.matthew.name.fullName = profile.name.givenName+" "+profile.name.familyName;
          newUser.matthew.email = profile.emails[0].value;

          newUser.save(function(err, result){
            if(err){
              throw err;
            }
            else{
              console.log("new google "+result);
              return done(null, newUser);
            }
          })
        }
      })
    })
  }
))


  console.log("passport has loaded");

}
