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
                console.log(image);
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
