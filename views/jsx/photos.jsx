var React = require('react');
var ReactAsync = require('react-async');
var superagent = require('superagent');

module.exports = exports = {};

var InstagramImage = React.createClass({
    render: function() {
        return (
            <li><a href={this.props.imageStd} title=""><img src={this.props.imageLow} alt="" title="" /></a></li>
        );
    }
});

exports.InstagramImageList = React.createClass({
    render: function() {
        var images = [];
        if (this.props.images !== undefined) {
            images = this.props.images.map(function(image) {
                return (
                    <InstagramImage key={image.id} imageLow={image.images.low_resolution.url} imageStd={image.images.standard_resolution.url} />
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
    var instagramImageList = React.createFactory(exports.InstagramImageList);
    React.render(instagramImageList({
        images: images
    }), container);

    $(function () {
        $('a').fluidbox();
    });
}
