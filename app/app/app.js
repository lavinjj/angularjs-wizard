'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['angularjs-wizard']);

angular.module('myApp').controller('myController', function myController($scope) {
    $scope.email = 'jlavin@jimlavin.net';
    $scope.franchisee = {
        PlanType: 'Bronze'
    };
    $scope.submitForm = function(model){
        console.log(model);
    };
});
