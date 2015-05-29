/* global _, Backbone */


var ItemModel = Backbone.Model.extend({

});

var ItemView = Backbone.View.extend({
    events: {
        'click': 'duplicate'
    },
    id: 'thing-' + ItemModel.id,
    model: ItemModel,
    tagName: 'li',
    template: _.template('<%= item.name %>'),
    render: function() {
        'use strict';
        this.el.innerHTML = this.template(this.model.toJSON());
        return this;
    },
    initialize: function() {
        'use strict';
        _.bindAll(this, 'render');
        this.render();
    },
    duplicate: function() {
        console.log('dup');
    }
});

var ListOfItemsCollection = Backbone.Collection.extend({
    model: ItemModel
});

var ListOfItemsView = Backbone.View.extend({
    defaults: {
        name: ''
    },
    el: $('body').find('.body'),
    model: ListOfItemsCollection,
    template: _.template('<ul></ul>'),
    render: function() {
        'use strict';
        this.el.innerHTML = this.template();
    },
    initialize: function() {
        'use strict';
        _.bindAll(this, 'render');
        this.render();
    }
});

var list = new ListOfItemsView();
// var item = new ItemView({ name: 'blah' });
