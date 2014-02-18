angular.module('angularjs-wizard.directives')
    .directive('formWizard', function () {
        return {
            restrict: 'E',
            template: '<div class="box gradient">' +
                '<div class="title">' +
                '<h4><span>{{title}}</span></h4>' +
                '</div>' +
                '<div class="content noPad clearfix">' +
                '<form id="{{id}}Wizard" class="form-horizontal ui-formwizard">' +
                '<div class="msg"></div>' +
                '<div ng-transclude></div>' +
                '<div class="form-actions full">' +
                '<button class="btn pull-left ui-wizard-content ui-formwizard-button" type="reset" value="Back" ng-click="previous()" ng-disabled="isPreviousAllowed()"> Back </button>' +
                '<button class="btn pull-right ui-wizard-content ui-formwizard-button" type="submit" value="Next" ng-click="next()" ng-disabled="!isNextAllowed()"><span ng-show="displayNext()"> Next </span><span ng-hide="displayNext()"> Submit </span></button>' +
                '</div>' +
                '</form>' +
                '</div>',
            transclude: true,
            replace: true,
            require: ['formWizard', '^form'],
            scope: {
              submitFunction: '&formSubmit'
            },
            link: function ($scope, $elem, $attr, $ctrl) {
                $scope.formWizardCtrl = $ctrl[0];
                $scope.formCtrl = $ctrl[1];
                $scope.title = $attr.title || 'wizard form';
                $scope.id = $attr.id || 'wizard1';
                $scope.next = function () {
                    $scope.formWizardCtrl.$next();
                };
                $scope.previous = function () {
                    $scope.formWizardCtrl.$previous();
                };
                $scope.isPreviousAllowed = function(){
                    return $scope.formWizardCtrl.currentStep === 0;
                };
                $scope.isNextAllowed = function(){
                    if(!$scope.formWizardCtrl.content[$scope.formWizardCtrl.currentStep].$valid()) return false;
                    return $scope.formWizardCtrl.currentStep < $scope.formWizardCtrl.steps.length;
                };
                $scope.displayNext = function() {
                    return $scope.formWizardCtrl.currentStep < $scope.formWizardCtrl.steps.length - 1;
                };
                $scope.formWizardCtrl.$init();

            },
            controller: function ($scope) {
                var wizard = this;
                wizard.steps = [];
                wizard.content = [];
                wizard.currentStep = 0;

                wizard.$addStep = function (control) {
                    wizard.steps.push(control);
                };

                wizard.$addStepContent = function (control) {
                    wizard.content.push(control);
                };

                wizard.$removeStep = function (control) {
                    var index = 0;
                    var save = 0;
                    angular.forEach(wizard.steps, function (step) {
                        if (step.$name === control.name) {
                            save = index;
                        }
                        index++;
                    });
                    wizard.steps.splice(save, 1);
                };

                wizard.$removeStepContent = function (control) {
                    var index = 0;
                    var save = 0;
                    angular.forEach(wizard.content, function (step) {
                        if (step.$name === control.name) {
                            save = index;
                        }
                        index++;
                    });
                    wizard.content.splice(save, 1);
                };

                wizard.$hideAll = function () {
                    angular.forEach(wizard.steps, function (step) {
                        step.$hide();
                    });

                    angular.forEach(wizard.content, function (content) {
                        content.$hide();
                    });
                };

                wizard.$next = function () {
                        wizard.$hideAll();
                        wizard.currentStep++;
                        if (wizard.currentStep < wizard.steps.length && wizard.currentStep < wizard.content.length) {
                            wizard.steps[wizard.currentStep].$show();
                            wizard.content[wizard.currentStep].$show();
                        } else {
                            wizard.currentStep = wizard.steps.length;
                            $scope.submitFunction();
                        }
                };

                wizard.$previous = function () {
                    wizard.$hideAll();
                    wizard.currentStep--;
                    if (wizard.currentStep >= 0) {
                        wizard.steps[wizard.currentStep].$show();
                        wizard.content[wizard.currentStep].$show();
                    } else {
                        wizard.currentStep = 0;
                    }
                };

                wizard.$init = function() {
                    wizard.currentStep = 0;
                    wizard.$hideAll();
                    wizard.steps[wizard.currentStep].$show();
                    wizard.content[wizard.currentStep].$show();
                };
            }
        };
    })
    .directive('wizardSteps', function () {
        return {
            restrict: 'E',
            template: '<div class="wizard-steps clearfix show" ng-transclude></div>',
            transclude: true,
            replace: true
        };
    })
    .directive('wizardStep', function () {
        return {
            restrict: 'E',
            template: '<div class="{{stepClass}}" >' +
                '<div class="donut"><span class="{{iconClass}}"><span ng-hide="stepDisplayed">{{stepNumber}}</span></span></div>' +
                '<span class="txt" ng-transclude></span>' +
                '</div>',
            require: ['^formWizard', 'wizardStep'],
            transclude: true,
            replace: true,
            scope: {
                stepNumber: '@'
            },
            link: function ($scope, $elem, $attr, $ctrl) {
                $scope.formWizardCtrl = $ctrl[0];
                $scope.stepCtrl = $ctrl[1];
                $scope.stepCtrl.$name = $attr.stepNum || 0;
                $scope.formWizardCtrl.$addStep($scope.stepCtrl);
                $scope.stepClass = 'wstep';
                $scope.iconClass = '';
                $scope.stepWasDisplayed = false;
                $scope.stepDisplayed = false;
                $elem.bind('$destroy', function() {
                    $scope.formWizardCtrl.$removeStep($scope.stepCtrl);
                });
            },
            controller: function ($scope) {
                var step = this;

                step.$name = '';

                step.$show = function () {
                    $scope.stepClass = 'wstep current';
                    $scope.stepWasDisplayed = true;
                };

                step.$hide = function () {
                    $scope.stepClass = 'wstep';
                    if($scope.stepWasDisplayed){
                        $scope.stepDisplayed = true;
                        $scope.stepClass = 'wstep done';
                        $scope.iconClass = 'icon16 iconic-icon-checkmark';
                    }
                };
            }
        };
    })
    .directive('wizardStepContent', function () {
        return {
            restrict: 'E',
            template: '<div class="step ui-formwizard-content" id="first" ng-show="visible" >' +
                '<div ng-form name="uiform{{stepNumber}}" ng-transclude></div>' +
                '</div>',
            require: ['^formWizard', 'wizardStepContent'],
            transclude: true,
            replace: true,
            scope: {
                stepNumber: '@'
            },
            link: function ($scope, $elem, $attr, $ctrl) {
                $scope.formWizardCtrl = $ctrl[0];
                $scope.stepCtrl = $ctrl[1];
                $scope.stepCtrl.$name = $scope.stepNumber || 0;
                $scope.formWizardCtrl.$addStepContent($scope.stepCtrl);
                $scope.visible = false;
                $elem.bind('$destroy', function() {
                    $scope.formWizardCtrl.$removeStepContent($scope.stepCtrl);
                });
            },
            controller: function ($scope) {
                var step = this;

                step.$name = '';

                step.$show = function () {
                    $scope.visible = true;
                };

                step.$hide = function () {
                    $scope.visible = false;
                };

                step.$valid = function() {
                    return $scope['uiform{{stepNumber}}'].$valid;
                };

            }
        };
    });
