(function () {
    'use strict';
    
    angular.module('wotup')
        .controller('chatController', ['chatService', 'settingsService', '$scope', '$window', '$timeout', ChatController]);
        
    function ChatController(chat, settings, scope, window, timeout) {
        var self = this;
        
        self.channel = settings.get("twitch", "channel");
        self.blacklist = settings.get("chat", "blacklist").split(',');
        self.messageLimit = settings.get("chat", "messagelimit");
        self.selectedUser = "";
        
        self.keyPress = function(e) {
            if(e.keyCode == 13) {
                timeout(function() {
                    chat.say(self.channel, scope.message);
                    scope.message = "";
                });
                
                e.preventDefault();
            } 
        }
        
        scope.messages = [];
        
        if(chat.readyState() === "CLOSED") {
            chat.connect();
        }
        
        chat.on("chat", function(channel, user, message, outgoing) {
            if(self.blacklist.indexOf(user.username) > -1) return;
            
            scope.messages.push({user: user, message: message});
            
            if(scope.messages.length > self.messageLimit) {
                scope.messages.splice(0, scope.messages.length - self.messageLimit);
            }
            
            scope.$apply();
        });
        
    }
})();