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

.controller('phant-2AlertListController', function ($http, $scope, $timeout) {

  var timer = 0;	 
 
  var refreshAlerts = function() {   	
	  $http.get('../api/phant-2/alerts').then((response) => {
	    $scope.alerts = response.data;
	  });	  
	  timer = $timeout(refreshAlerts, 1000);
  };

  refreshAlerts();

  $scope.$on('$destroy', function(){
      $timeout.cancel(timer);	  
  })  
})

//Try this for now, should probably pass and search for _id

.controller('phant-2AlertDetailController', function($routeParams, $scope, $http) {
  this.id = $routeParams.id;
 
  $http.get('../api/phant-2/alert/' + `${this.id}`).then((response) => {
  
    if (response.data.length == 1) {	  
      this.alert = response.data[0];
    }	    
	  
  });	  	

})	

.controller('phant-2IndexController', function ($http) {
});

