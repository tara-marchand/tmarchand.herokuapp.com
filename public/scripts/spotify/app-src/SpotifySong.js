'use strict';

var SpotifySong = Backbone.Model.extend({
    defaults: {
        name: 'Song',
        url: ''
    }
});

module.exports = SpotifySong;
