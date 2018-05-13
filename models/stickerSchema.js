const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema and model

const stickerSchema = new schema({
  title: String,
  user: String,
  number: Number,
  email: String
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

const sModel = mongoose.model("sModel", stickerSchema);
console.log("sticker model online");
module.exports = sModel;
