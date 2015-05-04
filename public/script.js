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


    