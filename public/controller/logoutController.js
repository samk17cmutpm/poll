scotchApp.controller('logoutController', function($scope) {
    $.get("http://127.0.0.1:3000/logout", function(data){
            if(data === 'logoutok')
            {
              window.location.href="/";
            }
            else
            {
              console.log("chua dc baby");              
            }
      });
});
