const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema and model

const mattSchema = new schema({
  user: String,
  category: String,
  title: String,
  email: String,
  image: String,
  description: String,
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

const mModel = mongoose.model("mModel", mattSchema);
console.log("reshwap model online");
module.exports = mModel;
