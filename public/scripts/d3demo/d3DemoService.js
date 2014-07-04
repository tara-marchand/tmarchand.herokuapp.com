angular.module("d3Demo")
    .factory("d3DemoService", ["$http", function ($http) {

        function getSf311Data() {
            return $http({
                method: "get",
                url: "http://data.sfgov.org/resource/vw6y-z8j6.json?$$app_token=" + tmarchand.env.socrataAppToken + "&$where=opened > '2014-01-01 07:00:00'"
            });
        }

        return {
            getSf311Data: getSf311Data
        };
    }]
);

