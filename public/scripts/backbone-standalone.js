/* globals $, _, Backbone */

var app = app || {};

app.AppView = Backbone.View.extend({
    el: '.page-content',
    template: '<input type="text" name="name">' +
        '<input type="number" name="age">' +
        '<button>Add</button>',
    events: {
        'click button': 'addItem'
    },
    initialize: function() {
        'use strict';
        this.items = new app.Items();
        this.render();
        this.listenTo(this.items, 'add', this.renderItem);
    },
    render: function() {
        'use strict';
        this.$el.append(_.template(this.template)({}));
    },
    addItem: function() {
        'use strict';
        var modelData = {};
        var $input = null;

        this.$el.find('input').each(function(i, el) {
            $input = $(el);
            if ($input.val() !== '') {
                modelData[$input.attr('name')] = $input.val();
            }
        });
        this.items.add(new app.Item(modelData));
    },
    renderItem: function(item) {
        'use strict';
        this.$el.append(new app.ItemView({ model: item }).render());
    }
});

// views (extends base view class)
app.ItemView = Backbone.View.extend({
    el: 'li',
    template: _.template('<%= name %>:  <%= age %><br>' + '<button>Edit</button>'),
    render: function() {
        'use strict';
        return this.$el.html(this.template(this.model.toJSON()));
    }
});

// models
app.Item = Backbone.Model.extend({
    defaults: {
        name: '',
        age: 0
    }
});

app.Items = Backbone.Collection.extend({
    model: app.Item
});

new app.AppView();
