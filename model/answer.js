/*
* More details here http://mongoosejs.com/docs/guide.html
*/

var mongoose = require("mongoose");

//connect to database
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/poll');

//create schema for blog post
var answerSchema = new mongoose.Schema({
  question_id:  String,
  answer_content: String, 
  answer_vote: Number,
  answer_value: Number
});

//compile schema to model
module.exports = db.model('answer', answerSchema)
