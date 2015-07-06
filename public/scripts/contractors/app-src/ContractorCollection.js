var Contractor = require('./Contractor.js');

// create a Firebase collection and set the 'url' property to the URL of our Firebase app
module.exports = Backbone.Firebase.Collection.extend({
        url: 'https://tmarchand-contractors.firebaseio.com/contractors',
        model: Contractor,
        autoSync: false
    });
