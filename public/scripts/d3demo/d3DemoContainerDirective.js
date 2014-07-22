angular.module("d3Demo")
    .directive("d3DemoContainer", ["d3DemoService", function d3DemoContainer(d3DemoService) {
        "use strict";

        return {
            restrict : "A",

            link: function(scope, element, attrs) {

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

                function renderSampleBars() {
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
                }

                // renderSampleBars();
                d3DemoService.getSf311Data().success(renderNeighborhoodBars);
            }
        };

    }]);

