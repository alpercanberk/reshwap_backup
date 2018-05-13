const assert = require("assert");
const marioKart = require("../models/marioChar.js");

describe('updating records', function(){
  //create tests

  var character; //otherwise the variable only exists within the beforeEach

  beforeEach(function(done){

    character = new marioKart({
    name: "Matthew",
    weight: 50
  });

  character.save().then(function(){//waits for the save function to end
      done();
  });
});

  it('updates one record in mattDB', function(done){//this is put here to win
    marioKart.findOneAndUpdate({name: "Matthew"}, {name: "John"}).then(function(){
      marioKart.findOne({_id: character._id}).then(function(result){
        assert(result.name === "John");
        done();
      })
    })
  });

  it('increments weight by one in mattDB', function(done){

    marioKart.update({}, {$inc:{weight: 1}}).then(function(){//take current weight and add one by it
      marioKart.findOne({name: "Matthew"}).then(function(result){
        assert(result.weight === 51);
        done();
      })//https://docs.mongodb.com/manual/reference/operator/update/---> for full list of operators
    });

  });


  });

//if testing saving, write 'saving' there
