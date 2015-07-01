(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');
var ReactAsync = require('react-async');
var superagent = require('superagent');

module.exports = exports = {};

var InstagramImage = React.createClass({displayName: "InstagramImage",
    render: function() {
        return (
            React.createElement("li", null, React.createElement("a", {href: this.props.imageStd, title: ""}, React.createElement("img", {src: this.props.imageLow, alt: "", title: ""})))
        );
    }
});

exports.InstagramImageList = React.createClass({displayName: "InstagramImageList",
    render: function() {
        var images = [];
        if (this.props.images !== undefined) {
            images = this.props.images.map(function(image) {
                return (
                    React.createElement(InstagramImage, {key: image.id, imageLow: image.images.low_resolution.url, imageStd: image.images.standard_resolution.url})
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

// make browser aware of rendered React components
if (typeof window !== 'undefined') {
    var container = document.getElementsByClassName('react')[0];
    var images = JSON.parse(document.getElementById('images').innerHTML);
    var instagramImageList = React.createFactory(exports.InstagramImageList);
    React.render(instagramImageList({
        images: images
    }), container);

    $(function () {
        $('a').fluidbox();
    });
}



},{"react":undefined,"react-async":undefined,"superagent":undefined}]},{},[1]);
