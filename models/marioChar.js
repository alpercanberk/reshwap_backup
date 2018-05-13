const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema and model

const marioKartSchema = new schema({
  name: String,
  weight: Number
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

const marioKart = mongoose.model("marioKart", marioKartSchema);

module.exports = marioKart;
