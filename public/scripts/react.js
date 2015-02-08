/** @jsx React.DOM */

var HelloWorld = React.createClass({
    render: function() {
        return (
            <h1>Hello, world!</h1>
        );
    }
});

React.renderComponent(
    <HelloWorld/>,
    document.getElementsByClassName("react")[0]
);
