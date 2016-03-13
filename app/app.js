(function () {
    'user script';
    
    angular.module('wotup', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'luegg.directives'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise('/chat');
        
        $routeProvider.when('/chat', {
            templateUrl: './www/chat.html',
            controller: 'chatController',
            controllerAs: '_ctrl'
        });
        
        $routeProvider.when('/settings', {
            templateUrl: './www/settings.html',
            controller: 'settingsController',
            controllerAs: '_ctrl'
        });
    }])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default');
    });
})();