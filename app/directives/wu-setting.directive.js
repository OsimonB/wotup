(function () {
    'use strict';
    
    angular.module('wotup')
        .directive('wuSetting', ['$compile', '$mdConstant', 'settingsService', wuSetting]);
        
    function wuSetting($compile, $mdConstant, settings) {
        var templates = {
            'text': `
                <md-input-container class="wu-setting-text" layout="row" flex>
                    <md-tooltip>{{descriptor.description}}</md-tooltip>
                    <h4>{{descriptor.name}}</h4>
                    <input type="text" ng-model="ngModel" aria-label="{{descriptor.name}}" flex />
                </md-input-container>
            `,
            'password': `
                <md-input-container class="wu-setting-text" layout="row" flex>
                    <md-tooltip>{{descriptor.description}}</md-tooltip>
                    <h4>{{descriptor.name}}</h4>
                    <input type="password" ng-model="ngModel" aria-label="{{descriptor.name}}" flex />
                </md-input-container>
            `,
            'number': `
                <md-input-container class="wu-setting-number" layout="row" flex>
                    <md-tooltip>{{descriptor.description}}</md-tooltip>
                    <h4>{{descriptor.name}}</h4>
                    <input type="number" ng-model="ngModel" aria-label="{{descriptor.name}}" />
                </md-input-container>
            `,
            'checkbox': `
                <md-input-container class="wu-setting-checkbox" layout="row" flex>
                    <md-tooltip>{{descriptor.description}}</md-tooltip>
                    <h4>{{descriptor.name}}</h4>
                    <input type="checkbox" ng-model="ngModel" aria-label="{{descriptor.name}}" />
                </md-input-container>
            `,
            'textlist': `
                <md-input-container class="wu-setting-text-list" layout="row" flex>
                    <md-tooltip>{{descriptor.description}}</md-tooltip>
                    <h4>{{descriptor.name}}</h4>
                    <md-chips ng-model="ngModel" md-separator-keys="chipKeys" aria-label="{{descriptor.name}}" flex></md-chips>
                </md-input-container>
            `
        }
        
        return {
            scope: {
                descriptor: '=',
                ngModel: '='
            },
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                element.html(templates[scope.descriptor.type]);
                $compile(element.contents())(scope);
                
                scope.chipKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.SPACE];
                
                scope.addNew = function() {
                    $scope.push('');
                }
            }
        };
    }
})();