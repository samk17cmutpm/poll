/*
* More details here http://mongoosejs.com/docs/guide.html
*/

var mongoose = require("mongoose");

//connect to database
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/poll');

//create schema for blog post
var userSchema = new mongoose.Schema({
  useremail:  String,
  userpassword: String,
  username: String
});

//compile schema to model
module.exports = db.model('user', userSchema)
