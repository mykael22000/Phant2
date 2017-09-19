import moment from 'moment';
import { uiModules } from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './less/main.less';
import template from './templates/index.html';

uiRoutes.enable();
uiRoutes
.when('/', {
  template,
  resolve: {
    currentTime($http) {
      return $http.get('../api/Phant2/example').then(function (resp) {
        return resp.data.time;
      });
    }
  }
});

uiModules
.get('app/Phant2', [])
.controller('phant2HelloWorld', function ($scope, $route, $interval) {
  $scope.title = 'Phant 2';
  $scope.description = 'Browser for indexes holding alerts in the Helefalump format.';

  const currentTime = moment($route.current.locals.currentTime);
  $scope.currentTime = currentTime.format('HH:mm:ss');
  const unsubscribe = $interval(function () {
    $scope.currentTime = currentTime.add(1, 'second').format('HH:mm:ss');
  }, 1000);
  $scope.$watch('$destroy', unsubscribe);
});
