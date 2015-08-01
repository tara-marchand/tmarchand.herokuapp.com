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
