const assert = require("assert");
const mongoose = require("mongoose");
const Author = require("../models/author.js");//passes in schemas

//tests
describe("nesting records in mattDB", function(){

  beforeEach(function(done){
    mongoose.connection.collections.authors.drop(function(){
      done();
    });//mongoose pluralizes all connection names
  })

  it("creates an author with sub-hyphen documents", function(done){

    var pat = new Author({
      name: "Patrick Ruffus",
      books: [
        {
          title: "Name of the Wind",
          pages: 400
        }
      ]
    });

    pat.save().then(function(){
      Author.findOne({name: "Patrick Ruffus"}).then(function(result){
        assert(result.books.length === 1);
        done();
      })
    })

  })

  it("adds a book to an Author", function(done){

    var pat = new Author({
      name: "Patrick Ruffus",
      books: [
        {
          title: "Name of the Wind",
          pages: 400
        }
      ]
    });

    pat.save().then(function(){
      Author.findOne({name: "Patrick Ruffus"}).then(function(result){
        //now we want to add a book to Patrick Ruffus
        result.books.push({title: "Wise Man's Fear",pages: 500});
        result.save().then(function(){
          Author.findOne({name: "Patrick Ruffus"}).then(function(result){
            assert(result.books.length === 2);
            done();
          })
        });
      })
    })

  })

});
