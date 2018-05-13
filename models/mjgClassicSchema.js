const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema and model

const mattSchema = new schema({
  school: String,
  email: String,
  debaterNum: Number,
  time: Number
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

const mModel = mongoose.model("mModel", mattSchema);

module.exports = mModel;
