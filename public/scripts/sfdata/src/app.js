/* globals $, _, Backbone, L */

'use strict';

var app = app || {};

/*** app ***/

// app view
app.AppView = Backbone.View.extend({
    tagName: 'div',

    className: 'app',

    initialize: function() {
        this.businessesCollection = new app.BusinessesCollection();
        this.businessesCollection.fetch({
            success: function() {
                this.render();
            }.bind(this)
        });
    },

    render: function() {
        var bizView;
        var mapModel = new app.MapModel();
        var mapView = new app.MapView({ model: mapModel });

        // add the map element to the app view element
        this.$el.append(mapView.el);
        // iterate and add each business element
        this.businessesCollection.each(function(biz) {
            bizView = new app.BusinessView({ model: biz });
            this.$el.append(bizView.render().$el);
        }.bind(this));
        // insert complete element after the header
        this.$el.insertAfter($('.page-header'));
        // init the map
        mapView.init();

        return this;
    }
});
