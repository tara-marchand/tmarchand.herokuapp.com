/* globals $, _, Backbone */

var app = app || {};

// generic base view class with boilerplate render method
app.BaseView = Backbone.View.extend({
    render: function() {
        'use strict';

        // precompile template
        var template = _.template(this.template);
        // create markup by compiling template with data
        var data = (this.model) ? this.model.toJSON() : {};
        var markup = template(data);

        this.$el.html(markup);
        return this;
    }
});

app.AppView = app.BaseView.extend({
    template: '<section></section>',
    initialize: function() {
        'use strict';
        this.$pageContent = $('.page-content')[0];
        this.items = new app.Items();

        if (this.items.length) {
            this.$pageContent.append(this.render());
        }

        this.listenTo(app.Items, 'add', this.addItem);
    },
    addItem: function(item) {
        'use strict';
        var itemView = new app.ItemView({ model: item });

    }
});

// views (extends base view class)
app.ItemView = app.BaseView.extend({
    template: '<div><%= name %>:  <%= age %></div>' +
        '<button>Edit</button>'
});

app.ItemsView = app.BaseView.extend({});

// models
app.Item = Backbone.Model.extend({
    name: ''
});

app.Items = Backbone.Collection.extend({
    model: app.Item
});

new app.AppView();
