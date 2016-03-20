(function () {
    'use strict';
    
    angular.module('wotup')
        .directive('chatMessage', ['settingsService', ChatMessage]);
        
    function ChatMessage(settings) {
        var insertEmoticons = function(msg) {
            if(!msg.user.emotes) return msg.message;
            var splitText = msg.message.split('');
            
            Object.keys(msg.user.emotes).forEach(function(key) {
                msg.user.emotes[key].forEach(function(mote) {
                    mote = mote.split('-');
                    mote = [parseInt(mote[0]), parseInt(mote[1])];
                    var length =  mote[1] - mote[0],
                        empty = Array.apply(null, new Array(length + 1)).map(function() { return '' });
                    splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
                    splitText.splice(mote[0], 1, '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + key + '/3.0">');
                });
            });
            
            return splitText.join('');
        };
        
        return {
            template: 
                '<md-list-item class="wu-chat-message" ng-click="selectUser()" ng-class="{\'selected\': isSelected(), \'highlighted\': isHighlighted()}">' +
                    '<span class="tags"></span>' +
                    '<span class="flair"></span>' +
                    '<span class="username">{{username}}</span>' +
                    '<span class="message"></span>' +
                '</md-list-item>',
            scope: {
                message: '='
            },
            link: function (scope, elem, attrs, ctrl) {
                var chatCtrl = elem.parent().controller();
                var user = scope.message.user;
                
                scope.username = user['display-name'] || user.username;
                var userElem = angular.element(elem[0].querySelector('.username'));
                
                if(settings.get('appearance', 'usercolor') && user.color)
                    userElem.css('color', user.color);
                
                var tags = angular.element(elem[0].querySelector('.tags'));
                switch(user['user-type']) {
                    case 'broadcaster':
                        tags.append('<img src="./assets/images/badges/broadcaster.png" />');
                        break;
                        
                }
                if(user.mod) tags.append('<img src="./assets/images/badges/moderator.png" />');
                //if(user.subscriber) tags.append('<img src="./assets/images/badges/subscriber.png" />');
                if(user.turbo) tags.append('<img src="./assets/images/badges/turbo.png" />');
                               
                var message = angular.element(elem[0].querySelector('.message'));
                if(settings.get('appearance', 'emoticons')) {
                    scope.message.message = insertEmoticons(scope.message);
                }
                message.html(scope.message.message);
                
                scope.isHighlighted = function () {
                    var tidy = scope.message.message.toLowerCase();
                    var username = settings.get('twitch', 'username').toLowerCase();
                    return tidy.indexOf(username) > -1;
                }
                
                scope.selectUser = function () {
                    chatCtrl.selected = (scope.isSelected() ? "" : user.username);
                }
                
                scope.isSelected = function() {
                    return chatCtrl.selected === user.username;
                }
            }
        };
    }
})();