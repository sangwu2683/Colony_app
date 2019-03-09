angular.module('colony')
    .controller('organizationsController', function ($scope, supersonic, localStorageService, $http) {
        $scope.organizations = [];

        var activities = localStorageService.get("activities");
        for (var i = 0; i < 10; i ++) {
            (function() {
                var activity = activities[parseInt(Math.random()*activities.length)];
                $scope.organizations.push(activity);
            })();
        }
    });

