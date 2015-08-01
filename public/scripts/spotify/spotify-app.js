(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SpotifySongsCollection = require('./SpotifySongsCollection.js');
var AppView = require('./AppView.js');

module.exports = (function() {
    'use strict';

    var Spotify = {};

    Spotify.songsCollection = new SpotifySongsCollection();
    Spotify.appView = new AppView({ collection: Spotify.songsCollection });
})();

},{"./AppView.js":2,"./SpotifySongsCollection.js":5}],2:[function(require,module,exports){
var SpotifySongView = require('./SpotifySongView.js');

var AppView = Backbone.View.extend({
    el: $('.spotify-songs-view'),
    events: {
    },
    initialize: function() {
        'use strict';
        this.$list = this.$el.find('ul');
        this.listenTo(Backbone, 'loader', this.loaderToggle);
    },
    loaderToggle: function(showOrHide) {
        'use strict';
        if (showOrHide === 'show') {
            this.$el.find('.spinner').removeClass('hidden');
        } else if (showOrHide === 'hide'){
            this.$el.find('.spinner').addClass('hidden');
        }
    },
    loaderShow: function() {
        'use strict';
        this.loaderToggle('show');
    },
    loaderHide: function() {
        'use strict';
        this.loaderToggle('hide');
    }
});

module.exports = AppView;

},{"./SpotifySongView.js":4}],3:[function(require,module,exports){
var SpotifySong = Backbone.Model.extend({
    defaults: {
        name: 'Song',
        url: ''
    }
});

module.exports = SpotifySong;

},{}],4:[function(require,module,exports){
var SpotifySongView = Backbone.View.extend({
    el: 'div',
    events: {
    },
    initialize: function() {
    }
});

module.exports = SpotifySongView;

},{}],5:[function(require,module,exports){
var SpotifySong = require('./SpotifySong.js');

// create a Firebase collection and set the 'url' property to the URL of our Firebase app
module.exports = Backbone.Collection.extend({
        url: 'https://tmarchand-contractors.firebaseio.com/contractors',
        model: SpotifySong,
        autoSync: false
    });

},{"./SpotifySong.js":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc2NyaXB0cy9zcG90aWZ5L2FwcC1zcmMvYXBwLmpzIiwicHVibGljL3NjcmlwdHMvc3BvdGlmeS9hcHAtc3JjL0FwcFZpZXcuanMiLCJwdWJsaWMvc2NyaXB0cy9zcG90aWZ5L2FwcC1zcmMvU3BvdGlmeVNvbmcuanMiLCJwdWJsaWMvc2NyaXB0cy9zcG90aWZ5L2FwcC1zcmMvU3BvdGlmeVNvbmdWaWV3LmpzIiwicHVibGljL3NjcmlwdHMvc3BvdGlmeS9hcHAtc3JjL1Nwb3RpZnlTb25nc0NvbGxlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFNwb3RpZnlTb25nc0NvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1Nwb3RpZnlTb25nc0NvbGxlY3Rpb24uanMnKTtcbnZhciBBcHBWaWV3ID0gcmVxdWlyZSgnLi9BcHBWaWV3LmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBTcG90aWZ5ID0ge307XG5cbiAgICBTcG90aWZ5LnNvbmdzQ29sbGVjdGlvbiA9IG5ldyBTcG90aWZ5U29uZ3NDb2xsZWN0aW9uKCk7XG4gICAgU3BvdGlmeS5hcHBWaWV3ID0gbmV3IEFwcFZpZXcoeyBjb2xsZWN0aW9uOiBTcG90aWZ5LnNvbmdzQ29sbGVjdGlvbiB9KTtcbn0pKCk7XG4iLCJ2YXIgU3BvdGlmeVNvbmdWaWV3ID0gcmVxdWlyZSgnLi9TcG90aWZ5U29uZ1ZpZXcuanMnKTtcblxudmFyIEFwcFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgZWw6ICQoJy5zcG90aWZ5LXNvbmdzLXZpZXcnKSxcbiAgICBldmVudHM6IHtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIHRoaXMuJGxpc3QgPSB0aGlzLiRlbC5maW5kKCd1bCcpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKEJhY2tib25lLCAnbG9hZGVyJywgdGhpcy5sb2FkZXJUb2dnbGUpO1xuICAgIH0sXG4gICAgbG9hZGVyVG9nZ2xlOiBmdW5jdGlvbihzaG93T3JIaWRlKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgaWYgKHNob3dPckhpZGUgPT09ICdzaG93Jykge1xuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLnNwaW5uZXInKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hvd09ySGlkZSA9PT0gJ2hpZGUnKXtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zcGlubmVyJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBsb2FkZXJTaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB0aGlzLmxvYWRlclRvZ2dsZSgnc2hvdycpO1xuICAgIH0sXG4gICAgbG9hZGVySGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdGhpcy5sb2FkZXJUb2dnbGUoJ2hpZGUnKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3O1xuIiwidmFyIFNwb3RpZnlTb25nID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnU29uZycsXG4gICAgICAgIHVybDogJydcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcG90aWZ5U29uZztcbiIsInZhciBTcG90aWZ5U29uZ1ZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgZWw6ICdkaXYnLFxuICAgIGV2ZW50czoge1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3BvdGlmeVNvbmdWaWV3O1xuIiwidmFyIFNwb3RpZnlTb25nID0gcmVxdWlyZSgnLi9TcG90aWZ5U29uZy5qcycpO1xuXG4vLyBjcmVhdGUgYSBGaXJlYmFzZSBjb2xsZWN0aW9uIGFuZCBzZXQgdGhlICd1cmwnIHByb3BlcnR5IHRvIHRoZSBVUkwgb2Ygb3VyIEZpcmViYXNlIGFwcFxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vdG1hcmNoYW5kLWNvbnRyYWN0b3JzLmZpcmViYXNlaW8uY29tL2NvbnRyYWN0b3JzJyxcbiAgICAgICAgbW9kZWw6IFNwb3RpZnlTb25nLFxuICAgICAgICBhdXRvU3luYzogZmFsc2VcbiAgICB9KTtcbiJdfQ==
