var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var QuestionPost = require("./model/question");
var AnswerPost = require("./model/answer");

//var app = express();


var express = require('express');
app.use(express.static('public'));
// Retrieve


app.get('/', function(req, res){
    //  QuestionPost.remove({}, function(err, users) {
    //   if(err)
    //   {
    //     console.log('not ok');
    //   }
    //   else
    //   {
    //     console.log('ok');
    //   }
    // });
    //   AnswerPost.remove({}, function(err, users) {
    //   if(err)
    //   {
    //     console.log('not ok');
    //   }
    //   else
    //   {
    //     console.log('ok');
    //   }
    // });
  res.sendfile('index.html');
   // res.redirect('http://bbc.co.uk'); 
});

//API to get the answers from question id
app.get('/answer/:id', function (req, res) {
    if (req.params.id) {
        AnswerPost.find({question_id: req.params.id}, function(err, users) {
          res.json(users);
        });
    }
});
var a = "";
app.get('/question/:id', function (req, res) {
    if (req.params.id) {
        //console.log(req.params.id);
        a = req.params.id;
        console.log(a);
        //res.send(req.params.id);
        //res.sendfile('question.html');       
    }
});

app.get('/answerchart/', function (req, res) {
   
         AnswerPost.find({question_id: a}, function(err, users) {
          res.json(users);
        });
    
});



app.get('/questionbyid', function (req, res) {
    QuestionPost.find({question_id: a}, function(err, users) {
          res.json(users);
        });
});

app.get('/answerbyid', function (req, res) {
    AnswerPost.find({question_id: a}, function(err, users) {
          res.json(users);
        });
});

app.get('/drawchartbyid/:id', function (req, res) {
    AnswerPost.find({question_id: req.params.id}, function(err, users) {
          res.json(users);
        });
});




//API to get the questions to update latest
app.get('/questionall', function (req, res) {
  QuestionPost.find({}, function(err, users) {
      res.json(users);
    }).sort([['question_date', 'descending']]);    
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });

//Receive the connection from client 
io.on('connection', function(socket){
  socket.on('Question', function(msg){
    // console.log(msg.question);
    // console.log(msg.answerstring);
    // console.log(msg.signalstring);
    // console.log(msg.user);
    // console.log(msg.typequestion);

    //Insert question to database
    var id_qs = "" + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) ;
    var post_question = new QuestionPost({question_id: id_qs, question_content: msg.question, 
                          question_type: msg.typequestion, question_username: msg.user});

   // Save model to MongoDB
    post_question.save(function (err) {
      if (err) {
       return err;
      }
      else {
       console.log("Save question Successfully");
      }
    });



    //Get the signal from client
    var signalArr = [];
    for(var i = 0; i <= msg.signalstring.length - 3; i = i + 3)
    {
      signalArr[signalArr.length] = parseInt(msg.signalstring.substring(i, i + 3));
    }
    console.log(signalArr);

    //Get the answers from client
    var answerArr = [];
    for(var i = 0; i < signalArr.length - 1; i++)
    {
      answerArr[answerArr.length] = msg.answerstring.substring(signalArr[i], signalArr[i + 1]);
    }
      console.log(answerArr);

    for(var i = 0; i < answerArr.length; i++)
    {
      var post_answer = new AnswerPost({question_id: id_qs, answer_content: answerArr[i], 
                          answer_vote: 0, answer_value: i});
      post_answer.save(function (err) {
        if (err) {
         return err;
        }
        else {
         console.log("Post question Successfully");
        }
      });
    }

    io.emit('UpdateLatest',{question: msg.question, user: msg.user, id_question: id_qs, identify: msg.indentify} );
  });
    
socket.on('Realtimechartsingle', function(msg){
    console.log(msg.value);
    var value = parseInt(msg.value);
    AnswerPost.findOne({question_id: msg.question_id, answer_value: value}, function(err, users) {
      io.emit('UpdateRealtime',{value: msg.value, answer_vote: users.answer_vote + 1, id: msg.question_id} );
      users.answer_vote = users.answer_vote + 1;
      users.save(function(err) {
        if (err) { return next(err); }
      });
      console.log(users);
    });
  });

socket.on('Realtimechartmutiple', function(msg){
    console.log(msg.arrayValue);
    var str = msg.arrayValue.trim();
    var res = str.split(" ");
    console.log(res);
    for(var i=0, len=res.length; i <= len; i++)
    {
      if(i < res.length)
      {
        var temp = parseInt(res[i]);
        AnswerPost.findOne({question_id: msg.question_id, answer_value: temp}, function(err, users) {
        users.answer_vote = users.answer_vote + 1;
        users.save(function(err) {
          if (err) { return next(err); }
        });
        console.log(users);
        });
      }
      else
      {
        io.emit('UpdateRealtime',{id: msg.question_id} );
      }

      
    }
    // AnswerPost.findOne({question_id: msg.question_id, answer_value: value}, function(err, users) {
    //   io.emit('UpdateRealtime',{value: msg.value, answer_vote: users.answer_vote + 1, id: msg.question_id} );
    //   users.answer_vote = users.answer_vote + 1;
    //   users.save(function(err) {
    //     if (err) { return next(err); }
    //   });
    //   console.log(users);
    // });
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});