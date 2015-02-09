/** @jsx React.DOM */

var InstagramImage = React.createClass({
    render: function() {
        return (
            <li><img src={this.props.image.low_resolution} /></li>
        );
    }
});

var InstagramImageList = React.createClass({
    getInitialState: function() {
        return {
            images: []
        };
    },
    componentDidMount: function() {
        var url = "https://api.instagram.com/v1/users/3007/media/recent/?client_id=" + tmarchand.env.instagramClientId;
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                this.setState({images: data.data.images});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        var images = this.state.images.map(function(image) {
            return (
                <InstagramImage image={image} />
            );
        });
        return (
            <ul>
            {images}
            </ul>
        );
    }
});

React.renderComponent(
    <InstagramImageList />,
    document.getElementsByClassName('react')[0]
);
