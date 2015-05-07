var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");

//These are all tables from database
var QuestionPost = require("./model/question");
var AnswerPost = require("./model/answer");
var UserPost = require("./model/user");

var express = require('express');
var bodyParser    =   require('body-parser');
var session   = require('express-session');
app.use(express.static('public'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));      
app.use(bodyParser.urlencoded({extended: true}));

var sess;
// Retrieve
app.post('/login',function(req,res){
  sess=req.session; 
  console.log(req.body.email);
  console.log(req.body.password);

  UserPost.find({useremail: req.body.email, userpassword: req.body.password}, function(err, users) {
          if(users.length == 1)
          {
            sess.email=req.body.email;
            sess.password=req.body.password;
            res.end('done');
          }
          else
          {
            res.end('wrong');
          }      
  });   
});
//API to register new account 
app.post('/register',function(req,res){
  var post_user = new UserPost({useremail: req.body.email, userpassword: req.body.password, 
                          username: req.body.username});
  UserPost.find({useremail: req.body.email}, function(err, users) {
          if(users.length == 1)
          {
            res.end('emailExist');
          }
          else
          {
            post_user.save(function (err) {
            if (err) {
              res.end('error');
            }
            else {
               res.end('done');
              }
            });
          }
          
    }); 
});

//API to get the seesion 
app.get('/session', function(req, res){
  sess=req.session;
  if(sess.email)
  {
    console.log(sess.email);
    res.end(sess.email);
  }
  else{
  console.log("nothing");
  res.end("notok");
  }    
});

app.get('/management/:id', function(req, res){
  QuestionPost.find({question_email: req.params.id}, function(err, users) {
          res.json(users);
        });
});

//API to log out, delete session
app.get('/logout',function(req,res){
  req.session.destroy(function(err){
    if(err){
      console.log(err);
      res.end('error');
    }
    else
    {
      // res.redirect('/');
      res.end('logoutok');
    }
  });
});


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
  //res.end('exist');
  res.sendfile('index.html');
});

//API to get the answers from question id
app.get('/answer/:id', function (req, res) {
    if (req.params.id) {
        AnswerPost.find({question_id: req.params.id}, function(err, users) {
          res.json(users);
        });
    }
});

//API to get the question by id 
app.get('/questionbyid/:id', function (req, res) {
    QuestionPost.find({question_id: req.params.id}, function(err, users) {
          res.json(users);
        });
});
//API to get the answers to display  for users
app.get('/answerbyid/:id', function (req, res) {
    AnswerPost.find({question_id: req.params.id}).sort({answer_value : 1}).exec(function(err, users){
        res.json(users);
    });
    
});
//API to get the answer to draw a chart 
app.get('/drawchartbyid/:id', function (req, res) {
    AnswerPost.find({question_id: req.params.id}).sort({answer_value : 1}).exec(function(err, users){
      res.json(users);
    });
});

//API to get the questions to update latest
app.get('/questionall', function (req, res) { 
  QuestionPost.find({}).sort({question_date : 1}).exec(function(err, users){
        res.json(users);
    });  
});

//Check Connection
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

//Receive the connection from client 
io.on('connection', function(socket){
  socket.on('Question', function(msg){
    //Insert question to database
    var id_qs = "" + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) ;
    var post_question = new QuestionPost({question_id: id_qs, question_content: msg.question, 
                          question_type: msg.typequestion, question_username: msg.user, question_email: msg.questionemail});
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
    //Get the answers from client
    var answerArr = [];
    for(var i = 0; i < signalArr.length - 1; i++)
    {
      answerArr[answerArr.length] = msg.answerstring.substring(signalArr[i], signalArr[i + 1]);
    }
    for(var i = 0; i < answerArr.length; i++)
    {
      var post_answer = new AnswerPost({question_id: id_qs, answer_content: answerArr[i], 
                          answer_vote: 0, answer_value: i});
      post_answer.save(function (err) {
        if (err) {
         return err;
        }
        else {
         console.log("Answer post Successfully");
        }
      });
    }
    // console.log(id_qs);
    io.emit('UpdateLatest',{question: msg.question, user: msg.user, id_question: id_qs, identify: msg.indentify} );
  });
    
socket.on('Realtimechartsingle', function(msg){
    // console.log(msg.value);
    var value = parseInt(msg.value);
    AnswerPost.findOne({question_id: msg.question_id, answer_value: value}, function(err, users) {
      io.emit('UpdateRealtime',{value: msg.value, answer_vote: users.answer_vote + 1, id: msg.question_id} );
      users.answer_vote = users.answer_vote + 1;
      users.save(function(err) {
        if (err) { return next(err); }
      });
    });
  });

socket.on('Realtimechartmutiple', function(msg){
    var str = msg.arrayValue.trim();
    var res = str.split(" ");
    // console.log(res);
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
        });
      }
      else
      {
        io.emit('UpdateRealtime',{id: msg.question_id} );
      }  
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});