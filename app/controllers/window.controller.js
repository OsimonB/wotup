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
            self.raidList = [];
            angular.forEach(settings.get('raid', 'teams'), function(team) {
                http.get('https://api.twitch.tv/api/team/'+team+'/all_channels.json').then(
                    function success(response) {
                        var channels = response.data.channels || [];
                        
                        channels.forEach(function (channel, index) {
                            if(channel.channel.status === "live") {
                                self.raidList.push({
                                    name: channel.channel.display_name,
                                    game: channel.channel.meta_game,
                                    title: channel.channel.title,
                                    viewers: channel.channel.current_viewers    
                                });
                            }
                        });
                    }, function error(response) {
                        
                    }
                )
            });
            
            angular.forEach(settings.get('raid', 'users'), function(user) {
                http.get('https://api.twitch.tv/kraken/streams/'+user).then(
                    function success(response) {
                        if(response.data.stream) {
                            self.raidList.push({
                                name: response.data.stream.channel.display_name,
                                game: response.data.stream.game,
                                title: response.data.stream.channel.status,
                                viewers: response.data.stream.viewers  
                            });
                        }
                    }, function error(response) {
                        
                    }
                )
            })
        }
    }
})();