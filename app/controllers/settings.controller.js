(function () {
    'use strict';
    
    angular.module('wotup')
        .controller('settingsController', ['settingsService', '$scope', '$location', '$mdDialog', '$mdToast', SettingsController]);
        
    function SettingsController(settings, scope, location, $mdDialog, $mdToast) {
        var self = this;

        self.getValues = function() {
            scope.values = {};
            Object.keys(self.selected.settings).forEach(function (key, index) {
                scope.values[key] = settings.get(self.selectedKey, key);
            });
        }

        self.setValues = function() {
            if(scope.values) {
                Object.keys(scope.values).forEach(function (key, index) {
                    settings.set(self.selectedKey, key, scope.values[key]);
                });
            }
        }
        
        self.selectModule = function(name, module) {
            self.setValues();            
            
            self.selectedKey = name;
            self.selected = module;
            
            self.getValues();
        }
        
        self.init = function() { 
            self.modules = settings.modules;  
            
            // Should probably not hard code this, but it works
            self.selectModule("chat", self.modules["chat"]);        
        }
        
        self.isDirty = function() {
            return settings.isDirty;
        }
        
        self.save = function() {
            self.setValues();
            settings.save();
            location.path('/chat');
        }
       
        self.restore = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Restore Default Settings')
                .textContent('Are you sure you want to restore all the default settings?')
                .ariaLabel('Restore Default Settings')
                .targetEvent(ev)
                .ok('Restore Settings')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                scope.values = {};
                self.setValues();
                settings.save();
                $mdToast.show($mdToast.simple().textContent('Default settings restored!'));
                location.path('/settings');
            }, function() {
                //Wise move
            });
        }
       
        self.cancel = function() {
            scope.values = {};
            settings.load();
            location.path('/chat');
        }
        
        self.init();
        
    }
})();