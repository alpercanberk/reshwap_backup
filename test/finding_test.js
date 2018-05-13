const assert = require("assert");
const marioKart = require("../models/marioChar.js");

describe('finding records', function(){
  //create tests

  var character; //otherwise the variable only exists within the beforeEach

  beforeEach(function(done){

    character = new marioKart({
    name: "Matthew",
  });

  character.save().then(function(){//waits for the save function to end
      done();
  });
});

  it('finds one record from mattDB', function(done){
    marioKart.findOne({name: "Matthew"}).then(function(result){
      assert(result.name === "Matthew");
      done()``
    });

  });

  it('finds one record by id from mattDB', function(done){
    marioKart.findOne({_id: character._id}).then(function(result){
      assert(result._id.toString() === character._id.toString()); //only when you use assert, do you need to call toString, otherwise it is very difficult to compare the 2, as the _id is an object, not a string
      done();//best way to find something via id when you cannot access it before
      //search for username when there are multiples of the same??
    });



  });

});//if testing saving, write 'saving' there
