/* globals _, Backbone */

// get lat long for address
// http://nominatim.openstreetmap.org/search?street=2776%20Diamond%20Street&city=San%20Francisco&state=CA&country=USA

/*** list of eviction notices ***/

'use strict';

var app = app || {};

// notice model
app.Notice = Backbone.Model.extend({
    defaults: {
        file_date: '',
        address: ''
    }
});

app.NoticesCollection = Backbone.Collection.extend({
    model: app.Notice,
    url: 'https://data.sfgov.org/resource/5cei-gny5.json?$limit=100'
});

// business view
app.NoticeView = Backbone.View.extend({
    tagName: 'p',

    template: _.template('<p>File date: <%= file_date %> - Address: <%= address %></p>'),

    render: function() {
        var notices = this.model.toJSON();
        this.$el.append(this.template(notices));
        return this;
    }
});
