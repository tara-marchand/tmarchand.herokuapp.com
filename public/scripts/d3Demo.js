var padNumber = function(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
};

var getDateString = function(date) {
    return date.getUTCFullYear() +
        "-" + padNumber(date.getUTCMonth() + 1) +
        "-" + padNumber(date.getUTCDate());
};

var renderNeighborhoodBars = function(data) {
    var neighborhoods = [];
    var neighborhood;
    var neighborhoodExists;

    for (var i = 0; i < data.length; i++) {
        neighborhood = data[i].neighborhood;
        neighborhoodExists = false;

        for (var j = 0; j < neighborhoods.length; j++) {
            if (neighborhoods[j].name === neighborhood) {
                neighborhoodExists = true;
                break;
            }
        }

        if (neighborhoodExists === false) {
            neighborhoods.push({ name: neighborhood, count: 1 });
        } else {
            neighborhoods.filter(function(nhood) {
                return nhood.name === neighborhood;
            })[0].count++;
        }
    }

    var svg = d3.select(".bars")
                .append("svg")
                .attr("width", 200)
                .attr("height", 200);

    var bars = svg.selectAll("rect")
                .data(neighborhoods);

    bars.enter().append("rect");

    bars.attr("x", function(d, i) {
            return 10 * i;
        })
        .attr("y", function(d, i) {
            return 200 - d.count; // box height - bar height
        })
        .attr("width", 5)
        .attr("height", function(d, i) {
            return d.count;
        });
};

// ==================================

var BarsData = Backbone.Model.extend({
    url: (function() {
        var DAYS_AGO = 1;
        var today = new Date();
        var monthsAgo = new Date(today.setDate(today.getDate() - DAYS_AGO));
        var monthsAgoString = getDateString(monthsAgo);

        return "http://data.sfgov.org/resource/vw6y-z8j6.json?$$app_token=" + tmarchand.env.socrataAppToken + "&$where=opened > '" + monthsAgoString + " 07:00:00'";
    })(),
    sync: function(method, model, options) {
        if (method === "GET") {
            options.url = model.url;
        }
    }
});

var BarsView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },
    render: function() {
        var nums = [80, 53, 125, 200, 28, 97];

        var svg = d3.select(".bars")
                    .append("svg")
                    .attr("width", 200)
                    .attr("height", 200);

        var bars = svg.selectAll("rect")
                    .data(nums);

        bars.enter().append("rect");

        bars.attr("x", function(d, i) {
                return 30 * i;
            })
            .attr("y", function(d, i) {
                return 200 - d; // box height - bar height
            })
            .attr("width", 20)
            .attr("height", function(d, i) {
                return d;
            });
        return this;
    }
});

var barsData = new BarsData();
var barsView = new BarsView({
    model: barsData,
    el: ".bars"
});
