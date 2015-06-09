/* globals _, Backbone */

var Contractors = {};

Contractors.Contractor = Backbone.Model.extend({
    defaults: {
        name: 'New Contractor'
    }
});

// create a Firebase collection and set the 'url' property to the URL of our Firebase app
Contractors.ContractorCollection = Backbone.Firebase.Collection.extend({
    url: 'https://tmarchand-contractors.firebaseio.com/contractors',
    model: Contractors.Contractor,
    autoSync: false
});

Contractors.ContractorView = Backbone.View.extend({
    events: {
        'click a':  'edit',
        'click .delete': 'delete',
        'click .close': 'close',
        'click .save': 'save'
    },
    // id: 'contractor-' + Contractor.id,
    model: Contractors.Contractor,
    tagName: 'li',
    template: _.template('\
        <div><a href="#"><%= name %></a> <button class="delete">Delete</button></div>\
        <form class="hidden">\
        <label>Name: <input type="text" name="name" value="<%= name %>"></input><button class="save">Save</button></label>\
        <button class="close">Close</button>\
        </form>\
        '),
    initialize: function() {
        'use strict';
        this.listenTo(this.model, 'change', this.render);
        this.model.bind('remove', this.remove, this);
    },
    render: function() {
        'use strict';
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    edit: function(e) {
        'use strict';
        e.preventDefault();
        this.$el.find('form').removeClass('hidden');
    },
    delete: function() {
        'use strict';
        this.model.destroy();
        this.$el.remove();
    },
    close: function () {
        'use strict';
        this.$el.find('form').addClass('hidden');
    },
    save: function(e) {
        'use strict';
        e.preventDefault();

        var $input = $(e.currentTarget).prev('input'); 
        var key = $input.attr('name');
        var value = $input.val();

        this.model.set(key, value);
    }
});

Contractors.AppView = Backbone.View.extend({
    isLoading: false,
    el: $('.contractors-container'),
    events: {
        'click .add-contractor': 'createContractor'
    },
    initialize: function() {
        'use strict';
        this.$list = this.$el.find('ul');
        this.$input = this.$el.find('.new-contractor');
        _.bindAll(this, 'hideLoader');
        // by listening to when the collection changes, we can add new items in real time
        this.listenTo(this.collection, 'add', this.addContractor);
        this.fetchContractors();
    },
    fetchContractors: function() {
        'use strict';
        this.showLoader();
        this.collection.fetch({ success: this.hideLoader });
    },
    addContractor: function(contractor) {
        'use strict';
        var view = new Contractors.ContractorView({ model: contractor });
        this.$list.append(view.render().el);
    },
    showLoader: function() {
        'use strict';
        this.$el.find('.spinner').removeClass('hidden');
        this.isLoading = true;
    },
    hideLoader: function() {
        'use strict';
        this.$el.find('.spinner').addClass('hidden');
        this.isLoading = false;
    },
    createContractor: function() {
        'use strict';
        if (!this.$input.val()) {
            return;
        }
        // create a new location in Firebase and save the model data
        // this will trigger the listenTo method above, and a new contractor view will be created as well
        this.collection.create({ name: this.$input.val() });
        this.$input.val('');
    }
});

Contractors.contractorCollection = new Contractors.ContractorCollection();
Contractors.appView = new Contractors.AppView({ collection: Contractors.contractorCollection });
