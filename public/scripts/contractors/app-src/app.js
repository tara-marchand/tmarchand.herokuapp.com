'use strict';

var ContractorCollection = require('./ContractorCollection.js');
var AppView = require('./AppView.js');

module.exports = (function() {
    var Contractors = {};

    Contractors.contractorCollection = new ContractorCollection();
    Contractors.appView = new AppView({ collection: Contractors.contractorCollection });
})();
