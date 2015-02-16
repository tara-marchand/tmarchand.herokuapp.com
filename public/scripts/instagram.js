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
