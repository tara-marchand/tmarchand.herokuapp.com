var React = require("react");

module.exports = exports = {};

exports.InstagramImage = React.createClass({
    render: function() {
        return (
            <li><img src={this.props.image} /></li>
        );
    }
});

exports.InstagramImageList = React.createClass({
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
                <InstagramImage image={image.images.low_resolution.url} />
            );
        });
        return (
            <ul>
            {images}
            </ul>
        );
    }
});

// React.renderComponent(
//     <InstagramImageList />,
//     document.getElementsByClassName('react')[0]
// );
