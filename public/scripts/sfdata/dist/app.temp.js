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
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
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

/* globals _, Backbone */

/*** list of businesses ***/

'use strict';

var app = app || {};

// business models
app.Business = Backbone.Model.extend({
    defaults: {
        vendor_name: 'vendor name',
        email: 'default@email.com'
    }
});

app.BusinessesCollection = Backbone.Collection.extend({
    model: app.Business,
    url: 'https://data.sfgov.org/resource/s57h-9wm9.json?$limit=100'
});

// business view
app.BusinessView = Backbone.View.extend({
    tagName: 'p',

    template: _.template('<p>Vendor name: <%= vendor_name %> - Email: <a href="mailto:<%= email %>"><%= email %></a></p>'),

    render: function() {
        var businesses = this.model.toJSON();
        this.$el.append(this.template(businesses));
        return this;
    }
});

/*** > initialize < ***/

'use strict';

var app = app || {};

// app view instance
app.appView = new app.AppView({ collection: app.BusinessesCollection });
