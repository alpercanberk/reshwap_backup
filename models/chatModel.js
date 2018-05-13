const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema and model

const chatSchema = new schema({
  user: String,
  item: String,
  message: String
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

const mModel = mongoose.model("chatModel", chatSchema);
console.log("chat model online");
module.exports = mModel;
