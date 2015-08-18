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
