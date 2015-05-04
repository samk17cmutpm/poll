scotchApp.controller('signupController', function($scope) {
	
    $.get("http://127.0.0.1:3000/session", function(data){
        if(data === 'notok')
        {
            console.log("ko ton tai");
            var email,password, passwordconfirm, username;
			$('form').submit(function(){
				//alert("dmm");
				email=$("#email").val();
				password=$("#password").val();
				passwordconfirm=$("#passwordconfirm").val();
				username=$("#username").val();
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
						if(!passwordconfirm)
						{
							alert("Please Fill The Password Input");
							$("#passwordconfirm").focus();
						}
						else
						{
							if(password.localeCompare(passwordconfirm) != 0)
							{
								alert("Password and passwordconfirm must be the same");
								$("#password").focus();
							}
							else
							{
								if(!username)
								{
									alert("Please fill the username field !");
									$("#username").focus();
								}
								else
								{
									$.post("http://127.0.0.1:3000/register",{email:email,password:password,passwordconfirm:passwordconfirm,username:username},function(data){		
										if(data==='done')			
										{						
											document.getElementById('registerok').style.display = 'block';
										}
										else
										{
											if(data === 'emailExist')
											{
												document.getElementById('identifyLogin').style.display = 'block';
											}
											else
											{
												alert("dm");
											}
											
										}

									});
								}
							}
						}
						
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