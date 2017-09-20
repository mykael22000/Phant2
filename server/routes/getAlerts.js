export default function (server) {

	const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');	

	server.route({
		path: '/api/phant-2/alerts',
		method: 'GET',
		handler(req, reply) {
			
			// Construct a search request

			var searchRequest = {
				index: 'phant-alert1',
				size: '20',
				body : {
				  sort : [{}],
			  	  query : {
				    bool : {
				      must :{
				        query_string : {
				          analyze_wildcard: true,
				          default_field : 'severity',
				          query : '*'
				        }
				      },
				      filter: {
				        bool : {
				          must : [],
				          must_not:[],
				        }
				      }
			  	    }
				  },
				}
			};

console.log(JSON.stringify(searchRequest));

			// Drive the search...
	
			callWithRequest(req,'search',searchRequest).then(function (response) {
console.log(response);			
				reply(  
					unpack(response)
//					Object.keys(response.hits.hits)
				);
			}).catch(function (response) {
console.log(response);			
          			if (resp.isBoom) {
					reply(response);
				} else {
					console.error("Error while executing search",response);
				        reply(response);
        	  		}
        		});
//			callWithRequest(req, 'cluster.state').then(function (response) {
//console.log(response);				
//				reply(
//         				Object.keys(response.metadata.indices)
//        			);
//     			});
    		}
  	});
}

function unpack(serverResponse) {
	var alerts = [];

	var hits = serverResponse.hits.hits;  // Array of alert objects

	for (var i = 0; i < hits.length; i++) {
                var event = hits[i]._source;

		var sev = event.severity;
		var bg = '#A0A0A0';
		if (sev == 'Info') {
			bg = '#00A000';
		}
		event.bg = bg;

		alerts[i] = event;
			
console.log(alerts[i]);		
	}	

	return alerts;
}	
