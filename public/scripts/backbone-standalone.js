/**
 * Examples from Backbone.js Patterns and Best Practices
 */

// generic base view class with boilerplate render method
var BaseView = Backbone.View.extend({
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

// specific item view class that extends base view class
var ItemView = BaseView.extend({
    template: '<div><%= name %></div>'
});

var ItemModel = Backbone.Model.extend({
    name: ''
});

// instances
var item = new ItemModel({
    name: 'Fred'
});
var itemView = new ItemView({
    model: item
});


$('.page-content').append(itemView.render().$el);