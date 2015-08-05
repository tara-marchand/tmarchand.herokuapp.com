/* globals _, Backbone */

'use strict';

var app = app || {};

app.AppView = Backbone.View.extend({
    el: '#page-content',

    initialize: function() {
        this.itemModel = new app.Item({
            name: 'yo',
            age: 666
        });
        this.itemView = new app.ItemView({
            model: this.itemModel
        });
        this.render();
    },

    render: function() {
        var itemMarkup = this.itemView.render().$el.html();
        this.$el.html(itemMarkup);
    }
});

// models
app.Item = Backbone.Model.extend({
    defaults: {
        name: '',
        age: 0
    }
});

app.ItemsCollection = Backbone.Collection.extend({
    model: app.Item
});

// views
app.ItemView = Backbone.View.extend({
    tagName: 'p',

    template: _.template('Name: <%= name %> - Age: <%= age %>'),

    render: function() {
        var attributes = this.model.attributes;
        var innerMarkup = this.template(attributes);

        this.$el.html(innerMarkup);
        return this;
    }
});

app.thisAppView = new app.AppView();
