const assert = require("assert");

const marioKart = require("../models/marioChar.js");

describe('saving records', function(){
  //create tests
  it('Saves a record to mattDB', function(done){

    var character = new marioKart({
      name: "Matthew",
    });

    character.save().then(function(){//waits for the save function to end
        assert(character.isNew === false);
        done();
    });

  });
});//if testing saving, write 'saving' there
