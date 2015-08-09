(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ContractorCollection = require('./ContractorCollection.js');
var AppView = require('./AppView.js');

module.exports = (function() {
    var Contractors = {};

    Contractors.contractorCollection = new ContractorCollection();
    Contractors.appView = new AppView({ collection: Contractors.contractorCollection });
})();

},{"./AppView.js":2,"./ContractorCollection.js":4}],2:[function(require,module,exports){
var ContractorView = require('./ContractorView.js');

var AppView = Backbone.View.extend({
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
        var view = new ContractorView({ model: contractor });
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

module.exports = AppView;
},{"./ContractorView.js":5}],3:[function(require,module,exports){
var Contractor = Backbone.Model.extend({
    defaults: {
        name: 'New Contractor',
        url: ''
    }
});

module.exports = Contractor;
},{}],4:[function(require,module,exports){
var Contractor = require('./Contractor.js');

// create a Firebase collection and set the 'url' property to the URL of our Firebase app
module.exports = Backbone.Firebase.Collection.extend({
        url: 'https://tmarchand-contractors.firebaseio.com/contractors',
        model: Contractor,
        autoSync: false
    });

},{"./Contractor.js":3}],5:[function(require,module,exports){
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
},{"./Contractor.js":3}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc2NyaXB0cy9jb250cmFjdG9ycy9hcHAtc3JjL2FwcC5qcyIsInB1YmxpYy9zY3JpcHRzL2NvbnRyYWN0b3JzL2FwcC1zcmMvQXBwVmlldy5qcyIsInB1YmxpYy9zY3JpcHRzL2NvbnRyYWN0b3JzL2FwcC1zcmMvQ29udHJhY3Rvci5qcyIsInB1YmxpYy9zY3JpcHRzL2NvbnRyYWN0b3JzL2FwcC1zcmMvQ29udHJhY3RvckNvbGxlY3Rpb24uanMiLCJwdWJsaWMvc2NyaXB0cy9jb250cmFjdG9ycy9hcHAtc3JjL0NvbnRyYWN0b3JWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ29udHJhY3RvckNvbGxlY3Rpb24gPSByZXF1aXJlKCcuL0NvbnRyYWN0b3JDb2xsZWN0aW9uLmpzJyk7XG52YXIgQXBwVmlldyA9IHJlcXVpcmUoJy4vQXBwVmlldy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgQ29udHJhY3RvcnMgPSB7fTtcblxuICAgIENvbnRyYWN0b3JzLmNvbnRyYWN0b3JDb2xsZWN0aW9uID0gbmV3IENvbnRyYWN0b3JDb2xsZWN0aW9uKCk7XG4gICAgQ29udHJhY3RvcnMuYXBwVmlldyA9IG5ldyBBcHBWaWV3KHsgY29sbGVjdGlvbjogQ29udHJhY3RvcnMuY29udHJhY3RvckNvbGxlY3Rpb24gfSk7XG59KSgpO1xuIiwidmFyIENvbnRyYWN0b3JWaWV3ID0gcmVxdWlyZSgnLi9Db250cmFjdG9yVmlldy5qcycpO1xuXG52YXIgQXBwVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICBlbDogJCgnLmNvbnRyYWN0b3JzLXZpZXcnKSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC5hZGQtY29udHJhY3Rvcic6ICdjcmVhdGVDb250cmFjdG9yJ1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdGhpcy4kbGlzdCA9IHRoaXMuJGVsLmZpbmQoJ3VsJyk7XG4gICAgICAgIHRoaXMuJGlucHV0ID0gdGhpcy4kZWwuZmluZCgnLm5ldy1jb250cmFjdG9yJyk7XG4gICAgICAgIC8vIGJ5IGxpc3RlbmluZyB0byB3aGVuIHRoZSBjb2xsZWN0aW9uIGNoYW5nZXMsIHdlIGNhbiBhZGQgbmV3IGl0ZW1zIGluIHJlYWwgdGltZVxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ2FkZCcsIHRoaXMuYWRkQ29udHJhY3Rvcik7XG4gICAgICAgIHRoaXMubGlzdGVuVG8oQmFja2JvbmUsICdsb2FkZXInLCB0aGlzLmxvYWRlclRvZ2dsZSk7XG4gICAgICAgIHRoaXMuZmV0Y2hDb250cmFjdG9ycygpO1xuICAgIH0sXG4gICAgZmV0Y2hDb250cmFjdG9yczogZnVuY3Rpb24oKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdGhpcy5sb2FkZXJTaG93KCk7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5mZXRjaCh7IHN1Y2Nlc3M6IF8uYmluZCh0aGlzLmxvYWRlckhpZGUsIHRoaXMpIH0pO1xuICAgIH0sXG4gICAgc3luY0NvbnRyYWN0b3JzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB0aGlzLmxvYWRlclNob3coKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLnN5bmMoeyBzdWNjZXNzOiBfLmJpbmQodGhpcy5sb2FkZXJIaWRlLCB0aGlzKSB9KTtcbiAgICB9LFxuICAgIGFkZENvbnRyYWN0b3I6IGZ1bmN0aW9uKGNvbnRyYWN0b3IpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB2YXIgdmlldyA9IG5ldyBDb250cmFjdG9yVmlldyh7IG1vZGVsOiBjb250cmFjdG9yIH0pO1xuICAgICAgICB0aGlzLiRsaXN0LmFwcGVuZCh2aWV3LnJlbmRlcigpLmVsKTtcbiAgICAgICAgY29udHJhY3Rvci5zYXZlKCk7XG4gICAgfSxcbiAgICBsb2FkZXJUb2dnbGU6IGZ1bmN0aW9uKHNob3dPckhpZGUpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICBpZiAoc2hvd09ySGlkZSA9PT0gJ3Nob3cnKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuc3Bpbm5lcicpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfSBlbHNlIGlmIChzaG93T3JIaWRlID09PSAnaGlkZScpe1xuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLnNwaW5uZXInKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRlclNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIHRoaXMubG9hZGVyVG9nZ2xlKCdzaG93Jyk7XG4gICAgfSxcbiAgICBsb2FkZXJIaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB0aGlzLmxvYWRlclRvZ2dsZSgnaGlkZScpO1xuICAgIH0sXG4gICAgY3JlYXRlQ29udHJhY3RvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgaWYgKCF0aGlzLiRpbnB1dC52YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBsb2NhdGlvbiBpbiBGaXJlYmFzZSBhbmQgc2F2ZSB0aGUgbW9kZWwgZGF0YVxuICAgICAgICAvLyB0aGlzIHdpbGwgdHJpZ2dlciB0aGUgbGlzdGVuVG8gbWV0aG9kIGFib3ZlLCBhbmQgYSBuZXcgY29udHJhY3RvciB2aWV3IHdpbGwgYmUgY3JlYXRlZCBhcyB3ZWxsXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5jcmVhdGUoeyBuYW1lOiB0aGlzLiRpbnB1dC52YWwoKSB9KTtcbiAgICAgICAgdGhpcy4kaW5wdXQudmFsKCcnKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBWaWV3OyIsInZhciBDb250cmFjdG9yID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnTmV3IENvbnRyYWN0b3InLFxuICAgICAgICB1cmw6ICcnXG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJhY3RvcjsiLCJ2YXIgQ29udHJhY3RvciA9IHJlcXVpcmUoJy4vQ29udHJhY3Rvci5qcycpO1xuXG4vLyBjcmVhdGUgYSBGaXJlYmFzZSBjb2xsZWN0aW9uIGFuZCBzZXQgdGhlICd1cmwnIHByb3BlcnR5IHRvIHRoZSBVUkwgb2Ygb3VyIEZpcmViYXNlIGFwcFxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5GaXJlYmFzZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vdG1hcmNoYW5kLWNvbnRyYWN0b3JzLmZpcmViYXNlaW8uY29tL2NvbnRyYWN0b3JzJyxcbiAgICAgICAgbW9kZWw6IENvbnRyYWN0b3IsXG4gICAgICAgIGF1dG9TeW5jOiBmYWxzZVxuICAgIH0pO1xuIiwidmFyIENvbnRyYWN0b3IgPSByZXF1aXJlKCcuL0NvbnRyYWN0b3IuanMnKTtcblxudmFyIENvbnRyYWN0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGV2ZW50czoge1xuICAgICAgICAnY2xpY2sgYSc6ICd0b2dnbGVFZGl0JyxcbiAgICAgICAgJ2NsaWNrIC5kZWxldGUnOiAnZGVsZXRlJyxcbiAgICAgICAgJ2NsaWNrIC5jYW5jZWwnOiAnY2FuY2VsJyxcbiAgICAgICAgJ2NsaWNrIC5zYXZlJzogJ3NhdmUnICAgXG4gICAgfSxcbiAgICAvLyBpZDogJ2NvbnRyYWN0b3ItJyArIENvbnRyYWN0b3IuaWQsXG4gICAgbW9kZWw6IENvbnRyYWN0b3IsXG4gICAgdGFnTmFtZTogJ2xpJyxcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgkKCcuY29udHJhY3Rvci12aWV3JykuaHRtbCgpKSxcbiAgICBpc0JlaW5nRWRpdGVkOiBmYWxzZSxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XG4gICAgICAgIHRoaXMubW9kZWwuYmluZCgncmVtb3ZlJywgdGhpcy5yZW1vdmUsIHRoaXMpO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZUVkaXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaXNCZWluZ0VkaXRlZCA9ICF0aGlzLmlzQmVpbmdFZGl0ZWQ7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5lZGl0LWZpZWxkcycpLnRvZ2dsZUNsYXNzKCdoaWRkZW4nLCAhdGhpcy5pc0JlaW5nRWRpdGVkKTtcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdGhpcy5tb2RlbC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgIH0sXG4gICAgY2FuY2VsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmVkaXQtZmllbGRzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgIH0sXG4gICAgc2hvd0xvYWRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgQmFja2JvbmUudHJpZ2dlcignbG9hZGVyJywgJ3Nob3cnKTtcbiAgICB9LFxuICAgIGhpZGVMb2FkZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIEJhY2tib25lLnRyaWdnZXIoJ2xvYWRlcicsICdoaWRlJyk7XG4gICAgfSxcbiAgICBzYXZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuc2hvd0xvYWRlcigpO1xuXG4gICAgICAgIHZhciBtb2RlbFRvU2F2ZSA9e307XG4gICAgICAgIHZhciBuYW1lcyA9IFsnbmFtZScsICd1cmwnXTtcbiAgICAgICAgdmFyICRpbnB1dCA9IG51bGw7XG4gICAgICAgIHZhciBrZXkgPSAnJztcbiAgICAgICAgdmFyIHZhbHVlID0gJyc7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IG5hbWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAkaW5wdXQgPSB0aGlzLiRlbC5maW5kKCdbbmFtZT1cIicgKyBuYW1lc1tpXSArICdcIl0nKTtcbiAgICAgICAgICAgIGtleSA9ICRpbnB1dC5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICB2YWx1ZSA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgICAgIG1vZGVsVG9TYXZlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KG1vZGVsVG9TYXZlKTtcbiAgICAgICAgdGhpcy5tb2RlbC5zYXZlKG1vZGVsVG9TYXZlLCB7IHN1Y2Nlc3M6IF8uYmluZCh0aGlzLmhpZGVMb2FkZXIsIHRoaXMpIH0pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyYWN0b3JWaWV3OyJdfQ==
