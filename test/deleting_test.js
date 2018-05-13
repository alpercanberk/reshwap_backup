const assert = require("assert");
const marioKart = require("../models/marioChar.js");

describe('deleting records', function(){
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

  it('Deletes one record from mattDB', function(done){//this is put here to win
    marioKart.findOneAndRemove({name: "Matthew"}).then(function(){
      marioKart.findOne({name: "Matthew"}).then(function(result){
        assert(result === null);
        done();
      });
    });
  });



  });

//if testing saving, write 'saving' there
