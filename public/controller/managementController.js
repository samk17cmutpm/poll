scotchApp.controller('managementController', ['$routeParams', function($routeParams) {

	var check = false;
        var user = "";
        $.get("http://127.0.0.1:3000/session", function(data){
            if(data === 'notok')
            {
			    alert("Please login first");
			    window.location.href="/#/signin";
            }
            else
            {
            	$.getJSON("http://127.0.0.1:3000/management/"+ $routeParams.id, function(data){
	            	for (var i=0, len=data.length; i < len; i++) {
	            	$('<div class="row"><div class="col-xs-1 col-md-1" style = "text-align: center;"><b>'+(i+1)+'</b></div><div class="col-xs-9 col-md-9"><a href="#question/'+data[i].question_id+'">'+data[i].question_content+'</a></div><div class="col-xs-2 col-md-2"><a href="#remove/'+data[i].question_id+'"><i class="fa fa-trash-o"></i></a></div></div><br>').appendTo("#management");
	            	}
        		});
               	
            }
        });
	


	
   
}]);
