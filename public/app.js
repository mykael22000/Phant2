import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';

import indexTemplate from './templates/index.html';
import alertListTemplate from './templates/alerts.html';
import alertDetailTemplate from './templates/detail.html';

uiRoutes.enable();

uiRoutes
.when('/', {
	template: indexTemplate,
	controller: 'phant-2IndexController',
	controllerAs: 'ctrl'
})	
.when('/alerts', {
	template: alertListTemplate,
	controller: 'phant-2AlertListController',
	controllerAs: 'ctrl'
})	
.when('/alert/:id', {
	template: alertDetailTemplate,
	controller: 'phant-2AlertDetailController',
	controllerAs: 'ctrl'
});	

uiModules
.get('app/Phant2', [])

// Controller for the Alert List View, repoll - 5 seconds

.controller('phant-2AlertListController', function ($http, $scope, $timeout) {

  var timer = 0;	 
 
  var refreshAlerts = function() {   	

	  $http.get('../api/phant-2/alerts').then((response) => {
	    $scope.alerts = response.data;
          });	  

	  timer = $timeout(refreshAlerts, 5000);
  }

  refreshAlerts();

  $scope.$on('$destroy', function(){
      $timeout.cancel(timer);	  
  }); 
})

// Controllor for the Alert Details View, repoll - 5 seconds

.controller('phant-2AlertDetailController', function($routeParams, $scope, $http, $timeout) {
  this.id = $routeParams.id;
  $scope.alert_id = $routeParams.id;	

  var timer = 0;

  var refreshDetails = function() {	
    $http.get('../api/phant-2/alert/' + $scope.alert_id).then((response) => {
  
      if (response.data.length == 1) {	  
        var alert = response.data[0];
	$scope.alert = alert;      
      }	    

    });	     

    timer = $timeout(refreshDetails, 5000);   
  }	  	

  refreshDetails();

  $scope.$on('$destroy', function(){
      $timeout.cancel(timer);	  
  });  	  
})	

// Controller for the index page - does nothing

.controller('phant-2IndexController', function ($http) {
});

