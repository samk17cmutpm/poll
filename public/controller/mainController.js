
    // create the controller and inject Angular's $scope
    scotchApp.controller('mainController', function($scope) {
        var check = false;
        var user = "";
        $.get("http://127.0.0.1:3000/session", function(data){
            if(data === 'notok')
            {
              console.log("ko ton tai");

            }
            else
            {
              check = true;
              user = data;
              $("#sign-in").html('<a href="#management/'+data+'" ><i class="fa fa-tachometer"></i> Welcome '+data+'</a>');
              $("#sign-up").html('<a href="#logout"><i class="fa fa-sign-out"></i> Log Out</a>');
              console.log("co ton tai");
              if(check)
              {
                $("#username").attr("value", user);
                $("#email").attr("value", user);
                console.log(user)
                $("#username").hide();
              }
            }
        });
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
      
        var norepeat = false;
        $('form').submit(function(){
          //alert(temp);
          var arr = ""; 
          norepeat = true;
          var signal = "000";
          var id_qs = "" + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) + Math.floor((Math.random() * 10000) + 1) ;
          //$("#identify").html(id_qs);
          // console.log(id_qs);
          $("#identify").html(id_qs);
          var question_email = document.getElementById('email').value;
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
                socket.emit('Question',{question: question_content, answerstring: arr, signalstring: signal, user: username, typequestion: type, indentify: id_qs, questionemail: question_email});
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
    socket.on('UpdateLatest', function(msg){
          if(norepeat)
          {
            // console.log("hu");
          var id = document.getElementById("identify");
          if(msg.identify.localeCompare(id.innerHTML) == 0)
          {
            $("#alert").html('<div class="alert alert-success" role="alert" style = "text-align: center;">Congratulation, click here to vote for your poll, you can send it to your friends <a href="#question/'+msg.id_question+'"><b>Click Here</b></a></div>');
          }
          
          $("#latest").prepend('<div class = "row" style = "border-bottom: solid 1px blue;"><a href="#question/'+msg.id_question+'" ><b style = "font-size:18px; color:blue">'+msg.question+'</b></a><br><span style = "font-size:13px; color:blue;">Post by: '+ msg.user +'</span></div><br>');
            norepeat = false;
          }
        });


    $.getJSON("http://127.0.0.1:3000/questionall", function(data){
        for (var len=data.length, i=len -1 ; i >= 0; i--) {
        //console.log(data[i].answer_content);
        var ab = data[i].question_type;
        // console.log(ab);
        $('<div class = "row" ><a href="#question/'+data[i].question_id+'"><b style = "font-size:14px; color:blue; padding: 25px;">'+data[i].question_content+'</b></a><br><span style = "font-size:13px; color:blue; padding: 25px;">Post by:</span><br><span style = "font-size:13px; color:blue; padding: 25px;"> '+data[i].question_username+'</span></div><br>').appendTo("#latest");
        }
    });
  
});

