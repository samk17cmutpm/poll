scotchApp.controller('questionController', ['$routeParams', function($routeParams) {
        //alert($routeParams);
        // this.params = $routeParams;
        //alert($routeParams.id);
        // $.get("http://127.0.0.1:3000/question/"+ $routeParams.id, function(data, status){
        //     console.log("Data: " + data + "\nStatus: " + status);
        // });


      $.getJSON("http://127.0.0.1:3000/questionbyid/"+ $routeParams.id, function(data){
            for (var i=0, len=data.length; i < len; i++) {
            //console.log(data[i].answer_content);
            var ab = data[i].question_type;
            // console.log(ab);
            $("#checktype").html(ab);
            $("#getidquestion").html(data[i].question_id);
            $("#question").html(data[i].question_content)
            }
        });

      $.getJSON("http://127.0.0.1:3000/answerbyid/"+ $routeParams.id, function(data){
        var x=document.getElementById("checktype");
        // console.log(x.innerHTML);
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
          // console.log(signalArr);


          var percentArr = [];
          if(total != 0)
          {
            for(var i=0, len=data.length; i < len; i++)
            {
              percentArr[percentArr.length] = parseFloat((data[i].answer_vote / total) * 100);
            }
            // console.log(percentArr);
          }
          


        for (var i=0, len=data.length; i < len; i++) {
            // console.log(data[i].answer_content);
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
          // console.log(signalArr);


          var percentArr = [];
          if(total != 0)
          {
            for(var i=0, len=data.length; i < len; i++)
            {
              percentArr[percentArr.length] = parseFloat((data[i].answer_vote / total) * 100);
            }
            // console.log(percentArr);
          }
            for (var i=0, len=data.length; i < len; i++) {
            // console.log(data[i].answer_content);
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
              // console.log(check[i].id);
              arr = arr + " " + check[i].value;
            }

          }
          // console.log(arr);
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
          // console.log(data);
          var signalArr = [];
          var total = 0;
          for(var i=0, len=data.length; i < len; i++)
          {
            signalArr[signalArr.length] = parseInt(data[i].answer_vote);
            total = total + parseInt(data[i].answer_vote);
          }
          // console.log(signalArr);
          var percentArr = [];
          if(total != 0)
          {
            for(var i=0, len=data.length; i < len; i++)
            {
              percentArr[percentArr.length] = parseFloat((data[i].answer_vote / total) * 100);
            }
            // console.log(percentArr);
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