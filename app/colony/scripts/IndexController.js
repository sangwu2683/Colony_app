/**
 * Created by Administrator on 15-3-14.
 */
angular.module('colony')
	.controller('indexController', function ($scope, supersonic, localStorageService) {
		if (localStorageService.get("currentUser") == null){
			//supersonic.ui.modal.show("colony#login");
		};
	});
