import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';

import indexTemplate from './templates/index.html';
import alertListTemplate from './templates/alerts.html';

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
});	

uiModules
.get('app/Phant2', [])

.controller('phant-2AlertListController', function ($http, $scope, $timeout) {
	
  var refreshAlerts = function() {   	
	  $http.get('../api/phant-2/alerts').then((response) => {
	    $scope.alerts = response.data;
	  });	  
	  $timeout(refreshAlerts, 1000);
  };

  refreshAlerts();
	  
})

.controller('phant-2IndexController', function ($http) {
});

