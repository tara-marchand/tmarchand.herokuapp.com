angular.module("d3Demo")
    .factory("d3DemoService", ["$http", function ($http) {

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

        function getSf311Data() {
            var DAYS_AGO = 1;

            var today = new Date();
            var monthsAgo = new Date(today.setDate(today.getDate() - DAYS_AGO));
            var monthsAgoString = getDateString(monthsAgo);

            return $http({
                method: "get",
                url: "http://data.sfgov.org/resource/vw6y-z8j6.json?$$app_token=" + tmarchand.env.socrataAppToken + "&$where=opened > '" + monthsAgoString + " 07:00:00'"
            });
        }

        return {
            getSf311Data: getSf311Data
        };
    }]
);

