scotchApp.controller('signinController', function($scope) {
	 	var check = false;
        var user = "";
        $.get("http://127.0.0.1:3000/session", function(data){
            if(data === 'notok')
            {
			    var email,password;
				$('form').submit(function(){
					//alert("dmm");
					email=$("#email").val();
					password=$("#password").val();
					/*
					* Perform some validation here.
					*/
					if(!email)
					{
						alert("Please Fill The Email Input !");
						$("#email").focus();
						
					}
					else
					{
						if(!password)
						{
							alert("Please Fill The Password Input");
							$("#password").focus();
							
						}
						else
						{
							$.post("http://127.0.0.1:3000/login",{email:email,password:password},function(data){		
								if(data==='done')			
								{						
									window.location.href="/#/";
								}
								else
								{
									document.getElementById('identifyLogin').style.display = 'block';
								}

							});
						}
						
					}
					
				})

            }
            else
            {
               	window.location.href="/";
            }
        });
	

        
});