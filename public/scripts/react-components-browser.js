(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require("react");

module.exports = exports = {};

exports.InstagramImage = React.createClass({displayName: "InstagramImage",
    render: function() {
        return (
            React.createElement("li", null, React.createElement("img", {src: this.props.image}))
        );
    }
});

exports.InstagramImageList = React.createClass({displayName: "InstagramImageList",
    getInitialState: function() {
        return {
            images: []
        };
    },
    componentDidMount: function() {
        var url = "/api/instagram";
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                console.log(data);
                this.setState({images: data.data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        var images = this.state.images.map(function(image) {
            return (
                React.createElement(InstagramImage, {image: image.images.low_resolution.url})
            );
        });
        return (
            React.createElement("ul", null, 
            images
            )
        );
    }
});

// React.renderComponent(
//     <InstagramImageList />,
//     document.getElementsByClassName('react')[0]
// );



},{"react":"react"}]},{},[1]);
