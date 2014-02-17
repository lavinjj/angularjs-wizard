// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('angularjs-wizard.config', [])
    .value('angularjs-wizard.config', {
        debug: true
    });

// Modules
angular.module('angularjs-wizard.directives', []);
angular.module('angularjs-wizard.filters', []);
angular.module('angularjs-wizard',
    [
        'angularjs-wizard.config',
        'angularjs-wizard.directives',
        'angularjs-wizard.filters'
    ]);

