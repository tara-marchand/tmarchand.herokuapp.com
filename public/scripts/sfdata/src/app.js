/* globals $, Backbone */

'use strict';

var app = app || {};

/*** app ***/

// app view
app.AppView = Backbone.View.extend({
    tagName: 'div',

    className: 'app',

    initialize: function() {
        this.graffitiCollection = new app.GraffitiCollection();
        this.graffitiCollection.fetch({
            success: function() {
                this.render();
            }.bind(this)
        });
    },

    render: function() {
        var graffitiView;
        var mapModel = new app.MapModel();
        var mapView = new app.MapView({ model: mapModel });

        // center on current location if browser supports geolocation
        if ('geolocation' in window.navigator) {
            window.navigator.geolocation.getCurrentPosition(function(position) {
                // allowed
                mapModel.set(position.coords.latitude);
                mapModel.set(position.coords.longitude);
            }, function() {
                // denied/error
            });
        }

        // add the map element to the app view element
        this.$el.append(mapView.el);
        // iterate and add each business element
        this.graffitiCollection.each(function(notice) {
            graffitiView = new app.GraffitiView({ model: notice });
            this.$el.append(graffitiView.render().$el);
        }.bind(this));
        // insert complete element after the header
        this.$el.insertAfter($('.page-header'));
        // init the map
        mapView.init();

        return this;
    }
});
