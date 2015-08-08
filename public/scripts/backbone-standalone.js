/* globals $, _, Backbone */

'use strict';

var app = app || {};

app.AppView = Backbone.View.extend({
    tagName: 'div',

    initialize: function() {
        this.businessesCollection = new app.BusinessesCollection();
        this.businessesCollection.fetch({
            success: function() {
                this.render();
            }.bind(this)
        });
    },

    render: function() {
        var view;

        this.businessesCollection.each(function(biz) {
            view = new app.BusinessView({ model: biz });
            this.$el.append(view.render().$el);
        }.bind(this));
        this.$el.insertAfter($('.page-header'));
        return this;
    }
});

// models
app.Business = Backbone.Model.extend({
    defaults: {
        vendor_name: 'vendor name',
        email: 'default@email.com'
    }
});

app.BusinessesCollection = Backbone.Collection.extend({
    model: app.Business,
    url: 'https://data.sfgov.org/resource/s57h-9wm9.json'
});

// views
app.BusinessView = Backbone.View.extend({
    tagName: 'p',

    template: _.template('<p>Vendor name: <%= vendor_name %> - Email: <a href="mailto:<%= email %>"><%= email %></a></p>'),

    render: function() {
        var businesses = this.model.toJSON();
        this.$el.append(this.template(businesses));
        return this;
    }
});

app.appView = new app.AppView({ collection: app.BusinessesCollection });
