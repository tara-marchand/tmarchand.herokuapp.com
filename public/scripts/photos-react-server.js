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
