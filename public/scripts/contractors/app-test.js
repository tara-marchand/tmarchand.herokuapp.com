/* globals Contractors */

var chai = require('chai');
var expect = chai.expect;
var src = require('./contractors-app.js');

describe('Contractors', function() {
    'use strict';
    expect(Contractors).to.exist;
});
