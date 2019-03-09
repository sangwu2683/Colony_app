angular.module('colony')
	.controller('addOrganizationController', function ($scope, supersonic, localStorageService) {
        $scope.name = "";
        $scope.date = "";
        $scope.address = "";
        
		$scope.add = function() {
            var username = "admin";
            var lng = localStorageService.get("baseLng");
            var lat = localStorageService.get("baseLat");
            var currentUser = localStorageService.get("currentUser");
            if (currentUser != null) {
                if (currentUser.username != null) {
                    username = currentUser.username;
                }
                if (currentUser.lng != null) {
                    lng = currentUser.lng;
                }
                if (currentUser.lat != null) {
                    lat = currentUser.lat;
                }
            }

            var activity = {
                "name" : $scope.name,
                "lng" : lng,
                "lat" : lat,
                "date" : $scope.date,
                "address" : $scope.address,
                "username" : username
            }
            var activities = localStorageService.get("activities");
            activities.push(activity);
            localStorageService.set(activities);
            supersonic.data.channel('public_announcements').publish(activity);
            supersonic.ui.layers.pop();
		}
	});