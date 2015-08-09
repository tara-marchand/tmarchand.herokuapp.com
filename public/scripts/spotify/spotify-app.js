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
'use strict';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc2NyaXB0cy9zcG90aWZ5L2FwcC1zcmMvYXBwLmpzIiwicHVibGljL3NjcmlwdHMvc3BvdGlmeS9hcHAtc3JjL0FwcFZpZXcuanMiLCJwdWJsaWMvc2NyaXB0cy9zcG90aWZ5L2FwcC1zcmMvU3BvdGlmeVNvbmcuanMiLCJwdWJsaWMvc2NyaXB0cy9zcG90aWZ5L2FwcC1zcmMvU3BvdGlmeVNvbmdWaWV3LmpzIiwicHVibGljL3NjcmlwdHMvc3BvdGlmeS9hcHAtc3JjL1Nwb3RpZnlTb25nc0NvbGxlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBTcG90aWZ5U29uZ3NDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9TcG90aWZ5U29uZ3NDb2xsZWN0aW9uLmpzJyk7XG52YXIgQXBwVmlldyA9IHJlcXVpcmUoJy4vQXBwVmlldy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgU3BvdGlmeSA9IHt9O1xuXG4gICAgU3BvdGlmeS5zb25nc0NvbGxlY3Rpb24gPSBuZXcgU3BvdGlmeVNvbmdzQ29sbGVjdGlvbigpO1xuICAgIFNwb3RpZnkuYXBwVmlldyA9IG5ldyBBcHBWaWV3KHsgY29sbGVjdGlvbjogU3BvdGlmeS5zb25nc0NvbGxlY3Rpb24gfSk7XG59KSgpO1xuIiwidmFyIFNwb3RpZnlTb25nVmlldyA9IHJlcXVpcmUoJy4vU3BvdGlmeVNvbmdWaWV3LmpzJyk7XG5cbnZhciBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAkKCcuc3BvdGlmeS1zb25ncy12aWV3JyksXG4gICAgZXZlbnRzOiB7XG4gICAgfSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB0aGlzLiRsaXN0ID0gdGhpcy4kZWwuZmluZCgndWwnKTtcbiAgICAgICAgdGhpcy5saXN0ZW5UbyhCYWNrYm9uZSwgJ2xvYWRlcicsIHRoaXMubG9hZGVyVG9nZ2xlKTtcbiAgICB9LFxuICAgIGxvYWRlclRvZ2dsZTogZnVuY3Rpb24oc2hvd09ySGlkZSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIGlmIChzaG93T3JIaWRlID09PSAnc2hvdycpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5zcGlubmVyJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICB9IGVsc2UgaWYgKHNob3dPckhpZGUgPT09ICdoaWRlJyl7XG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuc3Bpbm5lcicpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbG9hZGVyU2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdGhpcy5sb2FkZXJUb2dnbGUoJ3Nob3cnKTtcbiAgICB9LFxuICAgIGxvYWRlckhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIHRoaXMubG9hZGVyVG9nZ2xlKCdoaWRlJyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwVmlldztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNwb3RpZnlTb25nID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnU29uZycsXG4gICAgICAgIHVybDogJydcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcG90aWZ5U29uZztcbiIsInZhciBTcG90aWZ5U29uZ1ZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgZWw6ICdkaXYnLFxuICAgIGV2ZW50czoge1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3BvdGlmeVNvbmdWaWV3O1xuIiwidmFyIFNwb3RpZnlTb25nID0gcmVxdWlyZSgnLi9TcG90aWZ5U29uZy5qcycpO1xuXG4vLyBjcmVhdGUgYSBGaXJlYmFzZSBjb2xsZWN0aW9uIGFuZCBzZXQgdGhlICd1cmwnIHByb3BlcnR5IHRvIHRoZSBVUkwgb2Ygb3VyIEZpcmViYXNlIGFwcFxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vdG1hcmNoYW5kLWNvbnRyYWN0b3JzLmZpcmViYXNlaW8uY29tL2NvbnRyYWN0b3JzJyxcbiAgICAgICAgbW9kZWw6IFNwb3RpZnlTb25nLFxuICAgICAgICBhdXRvU3luYzogZmFsc2VcbiAgICB9KTtcbiJdfQ==
