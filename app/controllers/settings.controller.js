(function () {
    'use strict';
    
    angular.module('wotup')
        .controller('settingsController', ['settingsService', '$scope', '$window', '$location', SettingsController]);
        
    function SettingsController(settings, scope, window, location) {
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
       
        self.cancel = function() {
            scope.values = {};
            settings.load();
            location.path('/chat');
        }
        
        self.init();
        
    }
})();