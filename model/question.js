/*
* More details here http://mongoosejs.com/docs/guide.html
*/

var mongoose = require("mongoose");

//connect to database
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/poll');

//create schema for blog post
var questionSchema = new mongoose.Schema({
  question_id:  String,
  question_content: String, 
  question_type: String,
  question_username: String,
  question_email: String,
  question_date: { type: Date, default: Date.now }
});

//compile schema to model
module.exports = db.model('question', questionSchema)
