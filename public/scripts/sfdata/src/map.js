/* globals document, Backbone, L */

/*** map ***/

'use strict';

var app = app || {};

// map model
app.MapModel = Backbone.Model.extend({
    defaults: {
        lat: 37.7792768,
        long: -122.4192704,
        zoom: 12,
        tileLayerUrl: 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; ' +
            '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    }
});

// map view
app.MapView = Backbone.View.extend({
    tagName: 'section',

    className: 'map',

    init: function() {
        var map = L.map(document.querySelector('.map')).setView(
            [
                this.model.get('lat'),
                this.model.get('long')
            ],
            this.model.get('zoom')
        );

        L.tileLayer(this.model.get('tileLayerUrl'), {
            attribution: this.model.get('attribution'),
            maxZoom: this.model.get('maxZoom')
        }).addTo(map);
    }
});
