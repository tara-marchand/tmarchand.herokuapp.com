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
