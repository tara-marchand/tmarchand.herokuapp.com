(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');
var ReactAsync = require('react-async');
var superagent = require('superagent');

module.exports = exports = {};

var InstagramImage = React.createClass({displayName: "InstagramImage",
    render: function() {
        return (
            React.createElement("li", null, React.createElement("img", {src: this.props.image}))
        );
    }
});

exports.InstagramImageList = React.createClass({displayName: "InstagramImageList",
    render: function() {
        var images = [];
        if (this.props.images !== undefined) {
            images = this.props.images.map(function(image) {
                console.log(image);
                return (
                    React.createElement(InstagramImage, {image: image.images.low_resolution.url})
                );
            });
        }
        return (
            React.createElement("ul", null, 
            images
            )
        );
    }
});



},{"react":undefined,"react-async":undefined,"superagent":undefined}]},{},[1]);
