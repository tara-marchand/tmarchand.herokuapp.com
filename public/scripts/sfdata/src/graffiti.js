/* globals _, Backbone */

// get lat long for address
// http://nominatim.openstreetmap.org/search?street=2776%20Diamond%20Street&city=San%20Francisco&state=CA&country=USA

/*** list of graffiti ***/

'use strict';

var app = app || {};

// notice model
app.GraffitiInstance = Backbone.Model.extend({
    defaults: {
        case_id: 0,
        status: '-'
    }
});

app.GraffitiCollection = Backbone.Collection.extend({
    model: app.GraffitiInstance,
    url: 'https://data.sfgov.org/resource/p6sg-7yp7.json'
});

// business view
app.GraffitiView = Backbone.View.extend({
    tagName: 'p',

    template: _.template('<p>Case ID: <%= case_id %> - Status: <%= status %></p>'),

    render: function() {
        var graffiti = this.model.toJSON();
        this.$el.append(this.template(graffiti));
        return this;
    }
});
