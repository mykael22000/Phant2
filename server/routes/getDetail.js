export default function (server) {

	const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');	

	server.route({
		path: '/api/phant-2/alert/{id}',
		method: 'GET',
		handler(req, reply) {
console.log(req.params);			
			// Construct a search request

			var searchRequest = {
				index: 'phant-alert1',
				size: '20',
				body : {
				  sort : [
       					{ "timestamp" : {"order" : "desc"}}
				         ],
			  	  query : {
				    bool : {
				      must :{
				        query_string : {
				          analyze_wildcard: true,
				          default_field : '_id',
				          query : req.params.id
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

			// Drive the search...
	
			callWithRequest(req,'search',searchRequest).then(function (response) {

				reply(  
					unpack(response)
				);
			}).catch(function (response) {

          			if (response.isBoom) {
					reply(response);
				} else {
					console.error("Error while executing search",response);
				        reply(response);
        	  		}
        		});
    		}
  	});
}

// Mapping for alert severity to display color

const colors = { "Info": "#00A000",
              "Warning": "yellow",
	     "Critical": "orange",
	        "Fatal": "red" };

// Process and untangle the alerts

function unpack(serverResponse) {

	var alerts = [];

	var event = serverResponse.hits.hits[0]._source;
	event._id = serverResponse.hits.hits[0]._id;

	var sev = event.severity;
	var bg = colors[sev];
	if (bg == "") {
		br = "#A0A0A0";
	}	
	event.bg = bg;

	console.log(event);

	return event;
}	
