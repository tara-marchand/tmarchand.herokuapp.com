/* globals _, Backbone */

var Contractors = {};

Contractors.Contractor = Backbone.Model.extend({
    defaults: {
        name: 'New Contractor'
    }
});

// Create a Firebase collection and set the 'url' property to the URL of our Firebase app
Contractors.ContractorCollection = Backbone.Firebase.Collection.extend({
    url: 'https://tmarchand-contractors.firebaseio.com/contractors',
    model: Contractors.Contractor
});

Contractors.ContractorView = Backbone.View.extend({
    events: {
        'click': 'duplicate'
    },
    // id: 'contractor-' + Contractor.id,
    model: Contractors.Contractor,
    tagName: 'li',
    template: _.template('<%= name %>'),
    render: function() {
        'use strict';
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    initialize: function() {
        'use strict';
        this.listenTo(this.model, 'change', this.render);
    }
});

Contractors.AppView = Backbone.View.extend({
    el: $('.contractors-container'),
    events: {
        'click .add-contractor': 'createContractor'
    },
    initialize: function() {
        'use strict';
        this.$list = this.$el.find('ul');
        this.$input = this.$el.find('.new-contractor');
        // by listening to when the collection changes, we can add new items in real time
        this.listenTo(this.collection, 'add', this.addContractor);
    },
    addContractor: function(contractor) {
        'use strict';
        var view = new Contractors.ContractorView({ model: contractor });
        this.$list.append(view.render().el);
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
