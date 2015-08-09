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
