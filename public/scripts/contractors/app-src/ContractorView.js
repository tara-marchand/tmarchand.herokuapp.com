var Contractor = require('./Contractor.js');

var ContractorView = Backbone.View.extend({
    events: {
        'click a': 'toggleEdit',
        'click .delete': 'delete',
        'click .cancel': 'cancel',
        'click .save': 'save'   
    },
    // id: 'contractor-' + Contractor.id,
    model: Contractor,
    tagName: 'li',
    template: _.template($('.contractor-view').html()),
    isBeingEdited: false,
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
    toggleEdit: function(e) {
        'use strict';
        e.preventDefault();
        this.isBeingEdited = !this.isBeingEdited;
        this.$el.find('.edit-fields').toggleClass('hidden', !this.isBeingEdited);
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

module.exports = ContractorView;