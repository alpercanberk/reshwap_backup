const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema and model

const bookSchema = new schema({
  title: String,
  pages: Number
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

const authorSchema = new schema({
  name: String,
  age: Number,
  books: [bookSchema]//this makes the objects inside this array follow the schema we just linked into it
  //every field does not have to be filled out
  //if a property exists, it needs to be the right type(num vs string)
});

const Author = mongoose.model("author", authorSchema);

module.exports = Author;
