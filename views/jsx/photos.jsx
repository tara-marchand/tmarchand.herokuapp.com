var React = require('react');
var ReactAsync = require('react-async');
var superagent = require('superagent');

module.exports = exports = {};

var InstagramImage = React.createClass({
    render: function() {
        return (
            <li><img src={this.props.image} /></li>
        );
    }
});

exports.InstagramImageList = React.createClass({
    render: function() {
        var images = [];
        if (this.props.images !== undefined) {
            images = this.props.images.map(function(image) {
                return (
                    <InstagramImage image={image.images.low_resolution.url} />
                );
            });
        }
        return (
            <ul>
            {images}
            </ul>
        );
    }
});

// make browser aware of rendered React components
if (typeof window !== 'undefined') {
    var container = document.getElementsByClassName('react')[0];
    var images = JSON.parse(document.getElementById('images').innerHTML);
    React.renderComponent(exports.InstagramImageList({
        images: images
    }), container);
}
