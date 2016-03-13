(function () {
    'use strict';
    require('tmi.js');    
    
    angular.module('wotup')
        .service('chatService', ['settingsService', ChatService]);
        
    function ChatService(settings) {        
        var options = {
            options: {
                debug: true
            },
            connection: {
                cluster: "main",
                reconnect: settings.get('twitch', 'reconnect'),
                timeout: settings.get('twitch', 'timeout')
            },
            identity: {
                username: settings.get('twitch', 'username'),
                password: settings.get('twitch', 'password')
            },
            channels: [settings.get('twitch', 'channel')]
        };
        
        var client = new irc.client(options);
        
        client.on("serverchange", function(channel) {
            options.connection.cluster = "aws";
            client.disconnect();
            client.connect();
        });
        
        return client;
    }
     
})();