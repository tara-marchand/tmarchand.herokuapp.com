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

// ==================================

var Report = Backbone.Model.extend({

});

var Reports = Backbone.Collection.extend({
    model: Report,

    url: (function() {
        var DAYS_AGO = 14;
        var today = new Date();
        var monthsAgo = new Date(today.setDate(today.getDate() - DAYS_AGO));
        var monthsAgoString = getDateString(monthsAgo);

        return "http://data.sfgov.org/resource/vw6y-z8j6.json?$$app_token=" + tmarchand.env.socrataAppToken + "&$where=opened > '" + monthsAgoString + " 07:00:00'";
    })()
});

var BarsView = Backbone.View.extend({
    tagName: "div",
    className: "bars",

    initialize: function() {
    },

    render: function() {
        $(this.el).empty();

        var neighborhoods = [];
        var neighborhood;
        var neighborhoodExists;

        this.collection.each(function(report, index) {
        // for (var i = 0; i < this.collection.length; i++) {
            neighborhood = report.get("neighborhood");
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
        });

        var w = 800;
        var h = 400;

        var svg = d3.select(".bars")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var bars = svg.selectAll("rect")
            .data(neighborhoods)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return 25 * i;
            })
            .attr("y", function(d, i) {
                    return h - d.count; // box height - bar height
                })
            .attr("width", 20)
            .attr("height", function(d, i) {
                return d.count;
            });
    }
});

var reports = new Reports();
var barsView;

reports.fetch({
    success: function(reports) {
        console.log(reports);
        barsView = new BarsView({
            collection: reports
        });
        barsView.render();
    }
});
