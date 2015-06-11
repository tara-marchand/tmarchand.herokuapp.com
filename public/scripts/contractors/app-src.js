/* globals _, Backbone */

var Contractors = {};

Contractors.Contractor = Backbone.Model.extend({
    defaults: {
        name: 'New Contractor',
        url: ''
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
        'click .cancel': 'cancel',
        'click .save': 'save'   
    },
    // id: 'contractor-' + Contractor.id,
    model: Contractors.Contractor,
    tagName: 'li',
    template: _.template($('.contractor-view').html()),
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
        this.$el.find('.edit-fields').removeClass('hidden');
    },
    delete: function() {
        'use strict';
        this.model.destroy();
        this.$el.remove();
    },
    cancel: function () {
        'use strict';
        this.$el.find('.edit-fields').addClass('hidden');
    },
    showLoader: function() {
        'use strict';
        Backbone.trigger('loader', 'show');
    },
    hideLoader: function() {
        'use strict';
        Backbone.trigger('loader', 'hide');
    },
    save: function(e) {
        'use strict';
        e.preventDefault();

        this.showLoader();

        var modelToSave ={};
        var names = ['name', 'url'];
        var $input = null;
        var key = '';
        var value = '';

        for (var i = names.length - 1; i >= 0; i--) {
            $input = this.$el.find('[name="' + names[i] + '"]');
            key = $input.attr('name');
            value = $input.val();
            modelToSave[key] = value;
        }

        this.model.set(modelToSave);
        this.model.save(modelToSave, { success: _.bind(this.hideLoader, this) });
    }
});

Contractors.AppView = Backbone.View.extend({
    el: $('.contractors-view'),
    events: {
        'click .add-contractor': 'createContractor'
    },
    initialize: function() {
        'use strict';
        this.$list = this.$el.find('ul');
        this.$input = this.$el.find('.new-contractor');
        // by listening to when the collection changes, we can add new items in real time
        this.listenTo(this.collection, 'add', this.addContractor);
        this.listenTo(Backbone, 'loader', this.loaderToggle);
        this.fetchContractors();
    },
    fetchContractors: function() {
        'use strict';
        this.loaderShow();
        this.collection.fetch({ success: _.bind(this.loaderHide, this) });
    },
    syncContractors: function() {
        'use strict';
        this.loaderShow();
        this.collection.sync({ success: _.bind(this.loaderHide, this) });
    },
    addContractor: function(contractor) {
        'use strict';
        var view = new Contractors.ContractorView({ model: contractor });
        this.$list.append(view.render().el);
        contractor.save();
    },
    loaderToggle: function(showOrHide) {
        'use strict';
        if (showOrHide === 'show') {
            this.$el.find('.spinner').removeClass('hidden');
        } else if (showOrHide === 'hide'){
            this.$el.find('.spinner').addClass('hidden');
        }
    },
    loaderShow: function() {
        'use strict';
        this.loaderToggle('show');
    },
    loaderHide: function() {
        'use strict';
        this.loaderToggle('hide');
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
