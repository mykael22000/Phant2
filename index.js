import { resolve } from 'path';
import exampleRoute from './server/routes/example';
import getAlerts from './server/routes/getAlerts';
import getDetail from './server/routes/getDetail';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'phant-2',
    uiExports: {
      
      app: {
        title: 'Phant 2',
        description: 'Browser for indexes holding alerts in the Helefalump format.',
        main: 'plugins/phant-2/app',
	icon: 'plugins/phant-2/alert-bell.svg'
      },
      
      
      translations: [
        resolve(__dirname, './translations/es.json')
      ],
      
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    
    init(server, options) {
      // Add server routes and initialize the plugin here
      exampleRoute(server);
      getAlerts(server);
      getDetail(server);	    
    }
    

  });
};
