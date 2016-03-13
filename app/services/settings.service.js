(function () {
    'use strict';
    
    angular.module('wotup')
        .service('settingsService', SettingsService);
    
    function SettingsService() {
        var self = this;
        
        self.modules = {
            chat: {
                name: 'Chat',
                icon: 'fa-comment',
                description: 'Chat settings and stuff',
                settings: {
                    blacklist: {
                        name: 'Blacklisted users',
                        type: 'text',
                        default: 'Nightbot,Moobot',
                        description: 'Users to hide in chat (Comma separated)'
                    },
                    messagelimit: {
                        name: 'Message Limit',
                        type: 'number',
                        default: 10000,
                        description: 'How many messages to keep in memory'
                    }
                }
            },
            
            twitch: {
                name: 'Twitch',
                icon: 'fa-twitch',
                description: 'Twitch related',
                settings: {
                    username: {
                        name: 'Username',
                        type: 'text',
                        default: '',
                        description: 'Your Twitch username'
                    },
                    password: {
                        name: 'Password',
                        type: 'password',
                        default: '',
                        description: 'Your OAuth password'
                    },
                    channel: {
                        name: 'Channel',
                        type: 'text',
                        default: '',
                        description: 'The Twitch chat channel you want to hang out in'
                    },
                    reconnect: {
                        name: 'Auto Reconnect',
                        type: 'checkbox',
                        default: true,
                        description: 'Auto reconnect on disconnect'
                    },
                    timeout: {
                        name: 'Timeout',
                        type: 'number',
                        default: 9999,
                        description: 'Twitch connection timeout'
                    } 
                }
            },
            
            raid: {
                name: 'Raid List',
                icon: 'fa-fort-awesome',
                description: 'Tune your vessel for prime raiding',
                settings: {
                    team: {
                        name: 'Team',
                        type: 'text',
                        default: '',
                        description: 'Choose the Twitch team to search for online channels'
                    }
                }
            },
            
            appearance: {
                name: 'Appearance',
                icon: 'fa-paint-brush',
                description: 'Change the appearance of things',
                settings: {
                    usercolor: {
                        name: 'Username Colours',
                        type: 'checkbox',
                        default: 'false',
                        description: 'Enabled custom colours for users'
                    },
                    emoticons: {
                        name: 'Enable Emoticons',
                        type: 'checkbox',
                        default: 'false',
                        description: 'Enable emoticons to appear in chat'
                    }
                }
            }
        };
        
        self.values = {};
        
        self.dirty = false;
        self.get = function (module, name) {
            if(!self.values[module] && self.modules[module])
                self.values[module] = {};
            
            return self.values[module][name] || self.modules[module].settings[name].default;
        };
        
        self.set = function (module, name, value) {
            if(!self.values[module] && self.modules[module])
                self.values[module] = {};
                
            self.values[module][name] = value;
            self.dirty = true;
        }
        
        self.save = function (force) {
            if(!self.dirty && !force) return;
            
            window.localStorage.setItem('settings', angular.toJson(self.values));
        }
        
        self.load = function () {
            self.values = angular.fromJson(window.localStorage.getItem('settings')) || {};
        }
        
        self.reset = function () {
            self.values = {};
            self.save(true);
        }
        
        self.load();
        
        return self;
    }
})();