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

.controller('phant-2AlertListController', function ($http) {
console.log('In phant-2AlertListController');	
  $http.get('../api/phant-2/alerts').then((response) => {
    this.alerts = response.data;
console.log(response);	  
  });
})

.controller('phant-2IndexController', function ($http) {
console.log('In phant-2IndexController');	
});

