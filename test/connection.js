//this file houses all the necessary connections for the database

const mongoose = require("mongoose");

//es6 promises
mongoose.Promise = global.Promise;//overwrites the mongoose promise functions with gloabl

//connect to db before tests run
before(function(done){
  //connect to mongoDB
  mongoose.connect("mongodb://localhost/mattDB");

  //make sure that we connect OK
  mongoose.connection.once('open', function(){
    console.log("connection finished");
      done();
  }).on('error', function(err){
    console.log("connection error: "+err);
  });
  //Mocha checks db and other things

});

//makes sure for the test a new record is being produced
beforeEach(function(done){
  //drop the collection, every entry in there
  mongoose.connection.collections.mariokarts.drop(function(){
    done()
  });//mongoose pluralizes the model name

});
