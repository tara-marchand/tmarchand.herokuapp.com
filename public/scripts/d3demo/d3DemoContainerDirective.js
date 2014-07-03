angular.module("d3Demo")
    .directive("d3DemoContainer", [function d3DemoContainer() {
        "use strict";

        return {
            restrict : "A",

            link: function(scope, element, attrs) {

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

                renderSampleBars();
            }
        };

    }]);

