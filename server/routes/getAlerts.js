export default function (server) {

	const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');	

	server.route({
		path: '/api/phant-2/alerts',
		method: 'GET',
		handler(req, reply) {
			callWithRequest(req, 'cluster.state').then(function (response) {
console.log(response);				
				reply(
          				Object.keys(response.metadata.indices)
        			);
      			});
    		}
  	});
}	
