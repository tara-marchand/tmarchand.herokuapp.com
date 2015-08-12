/* globals $, _, Backbone, L */

'use strict';

var app = app || {};

/*** app ***/

// app view
app.AppView = Backbone.View.extend({
    tagName: 'div',

    className: 'app',

    initialize: function() {
        this.noticesCollection = new app.NoticesCollection();
        this.noticesCollection.fetch({
            success: function() {
                this.render();
            }.bind(this)
        });
    },

    render: function() {
        var noticeView;
        var mapModel = new app.MapModel();
        var mapView = new app.MapView({ model: mapModel });

        // add the map element to the app view element
        this.$el.append(mapView.el);
        // iterate and add each business element
        this.noticesCollection.each(function(notice) {
            noticeView = new app.NoticeView({ model: notice });
            this.$el.append(noticeView.render().$el);
        }.bind(this));
        // insert complete element after the header
        this.$el.insertAfter($('.page-header'));
        // init the map
        mapView.init();

        return this;
    }
});
