(function () {
    'use strict';
    
    const remote = require('remote'); 
    
    angular.module('wotup')
        .controller('windowController', ['$location', '$window', '$http', 'settingsService', WindowController]);
        
    function WindowController(location, window, http, settings) {
        var self = this;
        var _menu = false;
        var _raid = false;
        
        self.raidList = [];
        
        self.menuVisible = function() {
            return _menu;
        }
        
        self.toggleMenu = function() {
            _menu = !_menu;
        }
        
        self.close = function() {
            remote.getCurrentWindow().close();
        }
        
        self.minimize = function() {
            remote.getCurrentWindow().minimize();
        }
        
        self.showSettings = function() {
            location.path('/settings');
        }
        
        self.raidVisible = function() {
            return _raid;
        }
        
        self.toggleRaid = function() {
            _raid = !_raid;
            
            if(_raid) {
                self.updateRaidList();
            }
        }
        
        self.updateRaidList = function() {
            var team = settings.get('raid', 'team');
            
            self.raidList = [];
            if(team) {
                http.get('http://api.twitch.tv/api/team/'+team+'/all_channels.json').then(
                    function success(response) {
                        var channels = response.data.channels || [];
                        
                        channels.forEach(function (channel, index) {
                            if(channel.channel.status === "live") {
                                self.raidList.push(channel.channel);
                            }
                        });
                    }, function error(response) {
                        
                    }
                )
            }
        }
    }
})();