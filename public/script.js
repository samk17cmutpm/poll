  // create the module and name it scotchApp
    var scotchApp = angular.module('scotchApp', ['ngRoute']);

    // configure our routes
    scotchApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'view/home.html',
                controller  : 'mainController'
            })
            // route for the contact page
            .when('/contact', {
                templateUrl : 'view/contact.html',
                controller  : 'contactController'
            })

            // route for the question page
            .when('/question/:id', {
                templateUrl : 'view/question.html',
                controller  : 'questionController'
            });
    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('mainController', function($scope) {
        // create a message to display in our view
        var temp = 3; 
        $(document).ready(function(){
            $("#asmore").on("click", function(){
              $('<li style = "list-style-type: none"><div class="form-group"><input type="text" class="form-control" id="as'+temp+'" placeholder="Place your new answer here" style = "width: 95%"> </div></li>').appendTo(".answer_yes_no");
              $("input[type='text']")[temp].focus();
              temp++;
            });
        });
        $(document).ready(function(){
          $("#img_single").on("click", function(){
              $(this).css('border', "solid 2px red");  
              $("#img_mutiple").css('border', "none");  
              $("#single").prop('checked', true);
              $("#mutiple").prop('checked', false);
              });
            });

        $(document).ready(function(){
          $("#img_mutiple").on("click", function(){
              $(this).css('border', "solid 2px red");  
              $("#img_single").css('border', "none");  
              $("#mutiple").prop('checked', true);
              $("#single").prop('checked', false);
                });
            });
        var socket = io();

          //get request from server
    socket.on('UpdateLatest', function(msg){
            
             //alert("dm");
          //alert(msg.question + " dm");
          // $('<li style = "list-style-type: none"><div class="form-group">'+ msg.question +'</div></li>').appendTo("#latest");
          var id = document.getElementById("identify");
          if(msg.identify.localeCompare(id.innerHTML) == 0)
          {
            $("#alert").html('<div class="alert alert-success" role="alert" style = "text-align: center;">Congratulation, click here to vote for your poll, you can send it to your friends <a href="#question/'+msg.id_question+'"><b>Click Here</b></a></div>');
          }
          
          $("#latest").prepend('<li style = "list-style-type: none"><div><a href="#question/'+msg.id_question+'"><b style = "font-size:18px; color:blue">'+msg.question+'</b></a><br><span style = "font-size:13px; color:blue">Post by: '+ msg.user +'</span></div></li><br>');
         
     
      });
        
        $('form').submit(function(){
          //alert(temp);
          var arr = ""; 
          var signal = "000";
          var id_qs = "" + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) ;
          //$("#identify").html(id_qs);
          console.log(id_qs);
          $("#identify").html(id_qs);

          var question_content = document.getElementById('question').value;
          var username = document.getElementById('username').value;
          var type = $('input[name="type"]:checked').val();
          //alert(type);

          if(!question_content)
          {
            alert("Please fill The Question's content !");
            $("#question").focus();

          }
          else
          {
            if(!username)
            {
              alert("Please fill your name !");
              $("#username").focus();
            }
            else
            {
              //alert(question_content);
              var rmlast = 0;
              for(var i = 1; i < temp; i++ )
              {
                var temp_string = document.getElementById('as' + i).value;
                temp_string = temp_string.trim();
                if(temp_string)
                {
                  arr = arr.concat(temp_string);
                  rmlast = temp_string.length + rmlast;
                  if(rmlast < 10)
                  {
                    signal = signal + "00" + rmlast;
                  }
                  else
                  {
                    if(rmlast < 100)
                    {
                      signal = signal + "0" + rmlast;
                    }
                    else
                    {
                      signal = signal + rmlast;
                    }
                  }
                }            
              }
              //alert(arr);
              //continue here
              if(signal.length < 9)
              {
                alert("Please add at least two answers");
                $("#asmore").focus();
              }
              else
              {
                //send request to server
                socket.emit('Question',{question: question_content, answerstring: arr, signalstring: signal, user: username, typequestion: type, indentify: id_qs});
                $("#question").val('');
                $("#username").val('');
                for(var i = 1; i < temp; i++)
                {
                  $("#as" + i).val('');
                }
                
                //set null after emitting
              }
              
            }
            
          }      
          return false;
        });


    $.getJSON("http://127.0.0.1:3000/questionall", function(data){
        for (var len=data.length, i=len -1 ; i >= 0; i--) {
        //console.log(data[i].answer_content);
        var ab = data[i].question_type;
        console.log(ab);
        $('<li style = "list-style-type: none; width: 100%"><div><a href="#question/'+data[i].question_id+'"><b style = "font-size:18px; color:blue">'+data[i].question_content+'</b></a><br><span style = "font-size:13px; color:blue">Post by:<br> '+data[i].question_username+'</span></div></li><br>').appendTo("#latest");
        }
    });
  
});


    scotchApp.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });

    scotchApp.controller('questionController', ['$routeParams', function($routeParams) {
        //alert($routeParams);
        // this.params = $routeParams;
        //alert($routeParams.id);
        $.get("http://127.0.0.1:3000/question/"+ $routeParams.id, function(data, status){
            console.log("Data: " + data + "\nStatus: " + status);
        });


        $.getJSON("http://127.0.0.1:3000/questionbyid", function(data){
            for (var i=0, len=data.length; i < len; i++) {
            //console.log(data[i].answer_content);
            var ab = data[i].question_type;
            console.log(ab);
            $("#checktype").html(ab);
            $("#getidquestion").html(data[i].question_id);
            $("#question").html(data[i].question_content)
            }
        });

      $.getJSON("http://127.0.0.1:3000/answerbyid", function(data){
        var x=document.getElementById("checktype");
        console.log(x.innerHTML);
        if(x.innerHTML.localeCompare("single") == 0)
          console.log("yeah");
        if(x.innerHTML.localeCompare("single") == 0)
        {
          var json = "";

          var signalArr = [];
          var total = 0;
          for(var i=0, len=data.length; i < len; i++)
          {
            signalArr[signalArr.length] = parseInt(data[i].answer_vote);
            total = total + parseInt(data[i].answer_vote);
          }
          console.log(signalArr);


          var percentArr = [];
          if(total != 0)
          {
            for(var i=0, len=data.length; i < len; i++)
            {
              percentArr[percentArr.length] = parseFloat((data[i].answer_vote / total) * 100);
            }
            console.log(percentArr);
          }
          


        for (var i=0, len=data.length; i < len; i++) {
            console.log(data[i].answer_content);
            $('<div class="row"><input type="radio" name="answer" id="'+data[i].answer_value+'">'+data[i].answer_content+'</div><div id="chart'+data[i].answer_value+'" style = "background-color: green; text-align: center; color: white; width:'+(Math.round(percentArr[i]))+'%; height: 30px;" >'+(Math.round(percentArr[i]))+'% ('+data[i].answer_vote+' votes)</div><br>').appendTo("#answerappend");

            // $('<div class="row"><div class = "col-md-2" id ="sam'+data[i].answer_value+'">'+data[i].answer_vote+'</div><div class = "col-md-10">'+data[i].answer_content+'</div></div>').appendTo("#realtime");
          }
        }
        else
        {
          if(x.innerHTML.localeCompare("mutiple") == 0)
          {
          var signalArr = [];
          var total = 0;
          for(var i=0, len=data.length; i < len; i++)
          {
            signalArr[signalArr.length] = parseInt(data[i].answer_vote);
            total = total + parseInt(data[i].answer_vote);
          }
          console.log(signalArr);


          var percentArr = [];
          if(total != 0)
          {
            for(var i=0, len=data.length; i < len; i++)
            {
              percentArr[percentArr.length] = parseFloat((data[i].answer_vote / total) * 100);
            }
            console.log(percentArr);
          }
            for (var i=0, len=data.length; i < len; i++) {
            console.log(data[i].answer_content);
            $('<div class="row"><input type="checkbox" name="answer" value="'+data[i].answer_value+'" id="'+data[i].answer_value+'">'+data[i].answer_content+'</div><div id="chart'+data[i].answer_value+'" style = "background-color: green; text-align: center; color: white; width:'+(Math.round(percentArr[i]))+'%; height: 30px;" >'+(Math.round(percentArr[i]))+'% ('+data[i].answer_vote+' votes)</div><br>').appendTo("#answerappend");
            }
          }
          
        }
      });

    var socket = io();
    var y= document.getElementById("checktype");
    var id = document.getElementById("getidquestion");
    $('form').submit(function(){
      if(y.innerHTML.localeCompare("single") == 0)
      {
        //alert("dm");
        var check = document.getElementsByName('answer');
        for(var i = 0; i < check.length; i++)
        {
          if(check[i].checked)
          {
            socket.emit('Realtimechartsingle',{question_id: id.innerHTML, value: i} );
            //check[i].checked = false;
            break;
          }
        }
      }
      else
      {
        if(y.innerHTML.localeCompare("mutiple") == 0)
        {
          var check = document.getElementsByName('answer');
          var arr = "";
          for(var i = 0; i < check.length; i++)
          {
            
            if(check[i].checked)
            {
              console.log(check[i].id);
              arr = arr + " " + check[i].value;
            }

          }
          console.log(arr);
          socket.emit('Realtimechartmutiple',{question_id: id.innerHTML, arrayValue: arr} );

        }
      }
      return false;
    });

    socket.on('UpdateRealtime', function(msg){
      var id = document.getElementById("getidquestion");
      if(msg.id.localeCompare(id.innerHTML) == 0)
      {
        //document.getElementById("sam"+msg.value+"").innerHTML = msg.answer_vote;

        $.getJSON("http://127.0.0.1:3000/drawchartbyid/"+msg.id, function(data){
          console.log(data);
          var signalArr = [];
          var total = 0;
          for(var i=0, len=data.length; i < len; i++)
          {
            signalArr[signalArr.length] = parseInt(data[i].answer_vote);
            total = total + parseInt(data[i].answer_vote);
          }
          console.log(signalArr);
          var percentArr = [];
          if(total != 0)
          {
            for(var i=0, len=data.length; i < len; i++)
            {
              percentArr[percentArr.length] = parseFloat((data[i].answer_vote / total) * 100);
            }
            console.log(percentArr);
          }
          else
          {
            for(var i=0, len=data.length; i < len; i++)
            {
              percentArr[percentArr.length] = parseFloat(0.0);
            }
          }

          for(var i=0, len=percentArr.length; i < len; i++)
          {
            $("#chart" + i).css({"width": ""+percentArr[i]+"%"});
            $("#chart" + i).html(""+(Math.round(percentArr[i])) + "% ("+data[i].answer_vote+" votes)");
          }
        });

      }

      
      

    });


        
    }])