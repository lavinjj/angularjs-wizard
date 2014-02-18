'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['angularjs-wizard']);

function myController($scope) {
    $scope.email = 'jlavin@jimlavin.net';
    $scope.franchisee = {};
    $scope.submitForm = function(){
        alert('Form Submitted');
    };
}