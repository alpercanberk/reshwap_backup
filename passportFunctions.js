var User = require("./models/users.js")
passport.use(new GoogleStrategy({
    clientID: '317178716286-e9eqadcfpns8jkpajocs5lctd14r8nc4.apps.googleusercontent.com',
    clientSecret: 'Gns9E-6hlGeLwtbNFMqNFwQ9',
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.find({ googleId: profile.id }, function (err, user) {
         console.log(user);
         return done(err, user);
       });
  }
)); // pass passport for configuration//piggybacks off session, needs to go after
app.use(passport.session());

///
app.use(passport.initialize());


sendRoutes.route("/auth/google")
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

sendRoutes.route("/auth/google/callback")
  .get(passport.authenticate('google', { failureRedirect: '/'},
  function(req, res) {
    console.log("success!!!");
    console.log(req.user);
    //the deserializeUser is not being reached in time for some reason
    res.redirect('/home/matthew');
  })

passport.serializeUser(function(user, done) {
  console.log("this is"+user);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log(user);
    done(err, user);
  });
});







/////////////////////////

passport.serializeUser(function(user, done){
    console.log('reached');
    done(null, user);
  });

passport.deserializeUser(function(obj, done){
      done(null, obj);
  });

passport.use(new GoogleStrategy({
    clientID: '317178716286-e9eqadcfpns8jkpajocs5lctd14r8nc4.apps.googleusercontent.com',
    clientSecret: 'Gns9E-6hlGeLwtbNFMqNFwQ9',
    callbackURL: "http://localhost:5000/auth/google/callback",
    //when  passReqToCallback   : true data fails to pass for some reason, crashes app
  },
  function(accessToken, refreshToken, profile, done) {
     process.nextTick(function () {
       User.find({ id: profile.id }, function (err, user) {
         if(!user){
           console.log("first time user");
           new User({
             provider: "Google",
             id: profile.id,
             displayName: profile.displayName,
             name:{
               familyName: profile.name.familyName,
               givenName: profile.name.givenName,
               middleName: profile.name.middleName
             },
             emails: [
               {value: profile.emails.value,
               type: profile.emails.type}
             ]
           }).save(function(err){
             if(err) console.log(error);
            return done(err, user);
           })

         }
         if(user){
           console.log("normal user");
           console.log("this is"+user);
           return done(err, user);
         }
         else{
           console.log("Something messed up in the passport.use");
         }
       });
    });
  })); // pass passport for configuration//piggybacks off session, needs to go after

  
