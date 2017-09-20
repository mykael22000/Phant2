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
				  sort : [
       					{ "timestamp" : {"order" : "desc"}}
				         ],
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

			// Drive the search...
	
			callWithRequest(req,'search',searchRequest).then(function (response) {

				reply(  
					unpack(response)
				);
			}).catch(function (response) {

          			if (resp.isBoom) {
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

	var hits = serverResponse.hits.hits;  // Array of alert objects

	for (var i = 0; i < hits.length; i++) {
                var event = hits[i]._source;

		var sev = event.severity;
		var bg = colors[sev];
		if (bg == "") {
			br = "#A0A0A0";
		}	
		event.bg = bg;

		var ts = event.timestamp;
		var d = new Date(+ts);

		var datestring = ("0" + d.getDate()).slice(-2) + "-" 
			       + ("0"+(d.getMonth()+1)).slice(-2) + "-" 
			       + d.getFullYear(); 

		var timestring = ('0'+d.getHours()).slice(-2) + ':' 
			       + ('0'+d.getMinutes()).slice(-2) + ':' 
			       + ('0'+d.getSeconds()).slice(-2); 

		//var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
		//d.getHours() + ":" + d.getMinutes();

		event.display_date = datestring;
		event.display_time = timestring;

		alerts[i] = event;
console.log(alerts[i]);		
	}	

	return alerts;
}	
