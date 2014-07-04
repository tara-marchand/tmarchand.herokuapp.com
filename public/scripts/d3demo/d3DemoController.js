angular.module("d3Demo")
    .controller("d3DemoController", ["d3DemoService", function d3DemoController(d3DemoService) {
        "use strict";

        var sf311Data = [];

        function saveSf311Data(data, status, headers, config) {
            sf311Data = data;
            console.dir(sf311Data);
        }

        d3DemoService.getSf311Data().success(saveSf311Data);
    }]);
