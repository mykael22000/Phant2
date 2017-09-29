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

const util = require('util'); // For debug

uiModules
.get('app/Phant2', [])

// Controller for the Alert List View, repoll - 5 seconds

.controller('phant-2AlertListController', function ($http, $scope, $timeout) {

  var formatFields = function(event) {

	var ts = event.timestamp;
	var d = new Date(+ts);

	var datestring = ("0" + d.getDate()).slice(-2) + "-" 
		       + ("0"+(d.getMonth()+1)).slice(-2) + "-" 
		       + d.getFullYear(); 

	var timestring = ('0'+d.getHours()).slice(-2) + ':' 
		       + ('0'+d.getMinutes()).slice(-2) + ':' 
		       + ('0'+d.getSeconds()).slice(-2); 

	event.display_date = datestring;
	event.display_time = timestring;
 
	return event;
  };		

  var timer = 0;

  $scope.idz = [];

  var addId = function(idb) {

	$scope.idz.push(idb);
console.log(idb);
console.log(util.inspect($scope.idz, false, null));
  } 	  

  $scope.alertz = {};

  $scope.since = 0;

  var receiveAlerts = function(alerts) {

	for (var i = 0; i < alerts.length; i++) {

		var event = alerts[i];

		// Record/update the alert

		var id = event._id;

		$scope.alertz[id] = formatFields(event);

		// Add to the list of displayed alerts 

		addId({id: id, ts: event.timestamp});

		// Track most alert event received

		if (event.last_updated > $scope.since) {
			$scope.since = event.last_updated;
		}
	}	       
  }	  
 
  var refreshAlerts = function() {   	

	  $http.get('../api/phant-2/alerts/' + $scope.since ).then((response) => {
	    receiveAlerts(response.data);	  	  
          });	  

	  timer = $timeout(refreshAlerts, 5000);
  }

  refreshAlerts();

  $scope.$on('$destroy', function(){
      $timeout.cancel(timer);	
      $scope.since = 0;	
      $scope.alertz = {};
      $scope.idz = [];	  
  }); 
})

// Controllor for the Alert Details View, repoll - 5 seconds
// This runs client side

.controller('phant-2AlertDetailController', function($routeParams, $scope, $http, $timeout) {
  this.id = $routeParams.id;
  $scope.alert_id = $routeParams.id;	

  var formatFields = function(event) {

	var ts = event.timestamp;
	var d = new Date(+ts);

	var datestring = ("0" + d.getDate()).slice(-2) + "-" 
		       + ("0"+(d.getMonth()+1)).slice(-2) + "-" 
		       + d.getFullYear(); 

	var timestring = ('0'+d.getHours()).slice(-2) + ':' 
		       + ('0'+d.getMinutes()).slice(-2) + ':' 
		       + ('0'+d.getSeconds()).slice(-2); 

	event.display_date = datestring;
	event.display_time = timestring;

	ts = event.last_updated;
	d = new Date(+ts);

	datestring = ("0" + d.getDate()).slice(-2) + "-" 
		          + ("0"+(d.getMonth()+1)).slice(-2) + "-" 
	 	          + d.getFullYear(); 

	timestring = ('0' + d.getHours()).slice(-2) + ':' 
		          + ('0'+d.getMinutes()).slice(-2) + ':' 
		          + ('0'+d.getSeconds()).slice(-2); 

	event.last_date = datestring;
	event.last_time = timestring;
 
	if (event.history !== undefined) { 
		for (var j = 0; j < event.history.length; j++) {
			var hist = event.history[j];

			ts = hist.timestamp;

			d = new Date(+ts);

			datestring = ("0" + d.getDate()).slice(-2) + "-" 
			       + ("0"+(d.getMonth()+1)).slice(-2) + "-" 
			       + d.getFullYear();

			timestring = ('0'+d.getHours()).slice(-2) + ':' 
			       + ('0'+d.getMinutes()).slice(-2) + ':' 
			       + ('0'+d.getSeconds()).slice(-2);

			hist.display_date = datestring; 
			hist.display_time = timestring;
		}	
	}	
console.log(event);
	return event;
  };	

  var timer = 0;

  var refreshDetails = function() {	
    $http.get('../api/phant-2/alert/' + $scope.alert_id).then((response) => {
  
	var alert = response.data;      

	alert = formatFields(alert);

	$scope.alert = alert;      

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

