'use strict';

// Set the jasmine fixture path
// jasmine.getFixtures().fixturesPath = 'base/';

describe('angularjs-wizard', function() {

    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {

        // Get module
        module = angular.module('angularjs-wizard');
        dependencies = module.requires;
    });

    it('should load config module', function() {
        expect(hasModule('angularjs-wizard.config')).toBeTruthy();
    });

    
    it('should load filters module', function() {
        expect(hasModule('angularjs-wizard.filters')).toBeTruthy();
    });
    

    
    it('should load directives module', function() {
        expect(hasModule('angularjs-wizard.directives')).toBeTruthy();
    });
    

    

});
