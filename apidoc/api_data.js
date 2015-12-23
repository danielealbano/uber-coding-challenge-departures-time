define({ "api": [  {    "type": "get",    "url": "/api/v1/agencies",    "title": "List Agencies",    "version": "1.0.0",    "name": "list_agencies",    "group": "Agencies",    "description": "<p>List the agencies</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/agencies",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "agencies",            "description": "<p>List of Agencies</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "agencies.tag",            "description": "<p>Tag</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "agencies.title",            "description": "<p>Name</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "agencies.regionTitle",            "description": "<p>Region</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": true,            "field": "agencies.shortTitle",            "description": "<p>Short Title</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n    \"agencies\": [\n        {\n            \"tag\": \"actransit\",\n            \"title\": \"AC Transit\",\n            \"regionTitle\": \"California-Northern\"\n        },\n        ...,\n        {\n            \"tag\": \"sf-muni\",\n            \"title\": \"San Francisco Muni\",\n            \"shortTitle\": \"SF Muni\",\n            \"regionTitle\": \"California-Northern\"\n        },\n        ...\n    ]\n}",          "type": "json"        }      ]    },    "filename": "src/Controllers/api/v1/AgenciesV1ApiWebserviceController.js",    "groupTitle": "Agencies",    "sampleRequest": [      {        "url": "http://uber-coding-challenge.cloud.itechcon.it/api/v1/agencies"      }    ]  },  {    "type": "get",    "url": "/api/v1/nearby-stops",    "title": "Get nearby stops",    "version": "1.0.0",    "name": "list_nearbystops",    "group": "Nearby_Stops",    "description": "<p>Get the stops nearby the specified latitude and longitude within the specified distance range. The distance is approximated by +/-20 meters on longitude and +/-10 meters on latitude.</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "number",            "optional": false,            "field": "lat",            "description": "<p>Latitude</p>"          },          {            "group": "Parameter",            "type": "number",            "optional": false,            "field": "lon",            "description": "<p>Longitude</p>"          },          {            "group": "Parameter",            "type": "number",            "optional": false,            "field": "distance",            "description": "<p>Distance in distance unit format</p>"          },          {            "group": "Parameter",            "type": "string",            "allowedValues": [              "\"km\"",              "\"miles\""            ],            "optional": false,            "field": "distanceUnit",            "description": "<p>Distance unit (km or miles)</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/nearby-stops?lat=37.79096&lon=-122.4020799&distance=0.1&distanceUnit=km",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "stops",            "description": "<p>List of stops</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "stops.lat",            "description": "<p>Latitude</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "stops.lon",            "description": "<p>Longitude</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "stops.agencyTag",            "description": "<p>Agency tag</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "stops.routeTag",            "description": "<p>Route tag</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "stops.stopTag",            "description": "<p>Stop tag</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n    \"stops\": [\n        {\n            \"lat\": 37.79096,\n            \"lon\": -122.4020799,\n            \"agencyTag\": \"sf-muni\",\n            \"routeTag\": \"2\",\n            \"stopTag\": \"77\"\n        }\n        ...\n    ]\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "MissingParameters",            "description": "<p>One or more parameters are missing.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "DistanceUnitUnsupported",            "description": "<p>Distance unit is unsupported.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "InvalidLatitudeOrLongitudeOrDistance",            "description": "<p>Latitude, lon or distance are invalid.</p>"          }        ]      },      "examples": [        {          "title": "MissingParameters:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"MissingParameters\",\n    }\n}",          "type": "json"        },        {          "title": "DistanceUnitUnsupported:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"DistanceUnitUnsupported\",\n    }\n}",          "type": "json"        },        {          "title": "InvalidLatitudeOrLongitudeOrDistance:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"InvalidLatitudeOrLongitudeOrDistance\",\n    }\n}",          "type": "json"        }      ]    },    "filename": "src/Controllers/api/v1/NearbyStopsV1ApiWebserviceController.js",    "groupTitle": "Nearby_Stops",    "sampleRequest": [      {        "url": "http://uber-coding-challenge.cloud.itechcon.it/api/v1/nearby-stops"      }    ]  },  {    "type": "get",    "url": "/api/v1/predictions/:agency",    "title": "Get arrivals/departures times",    "version": "1.0.0",    "name": "list_predictions",    "group": "Predictions",    "description": "<p>Prediction of the arrivals/departures times</p>",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "agency",            "description": "<p>Agency Tag</p>"          },          {            "group": "Parameter",            "type": "String[]",            "optional": false,            "field": "stops",            "description": "<p>List of routes/stops tag, the stop identifier must be supplied in the format {Route Tag}|{Stop Tag}</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/predictions/sf-muni?stops=N|3212&stops=N|3909",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "predictions",            "description": "<p>List of predictions</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "predictions.routeTag",            "description": "<p>Route tag</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "predictions.stopTag",            "description": "<p>Stop tag</p>"          },          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "predictions.directions",            "description": "<p>List of directions</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.time",            "description": "<p>Time</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.seconds",            "description": "<p>Remaining seconds</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.minutes",            "description": "<p>Remaining minutes</p>"          },          {            "group": "Success 200",            "type": "boolean",            "optional": false,            "field": "predictions.directions.isDeparture",            "description": "<p>Is departure or arrival?</p>"          },          {            "group": "Success 200",            "type": "boolean",            "optional": false,            "field": "predictions.directions.delayed",            "description": "<p>Is delayed?</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": true,            "field": "predictions.directions.slowness",            "description": "<p>If delayed, it reports how slow is a vehicle over the last few minutes over the normal (EXPERIMENTAL)</p>"          },          {            "group": "Success 200",            "type": "boolean",            "optional": false,            "field": "predictions.directions.affectedByLayover",            "description": "<p>Is affected by layover?</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.dirTag",            "description": "<p>Direction tag</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.vehicle",            "description": "<p>Vehicle id</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.block",            "description": "<p>Vehicle block number</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.tripTag",            "description": "<p>Trip tag</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "predictions.directions.branch",            "description": "<p>Branch tag</p>"          },          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "predictions.messages",            "description": "<p>List of messages</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "predictions.messages.text",            "description": "<p>Text</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "predictions.messages.priority",            "description": "<p>Priority</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{  \n    \"predictions\": [  \n        {  \n            \"routeTag\": \"N\",\n            \"stopTag\": \"6997\",\n            \"directions\": [  \n                {  \n                    \"title\": \"Outbound to Ocean Beach via Downtown\",\n                    \"predictions\": [  \n                        {  \n                            \"time\": \"1450875532434\",\n                            \"seconds\": \"1096\",\n                            \"minutes\": \"18\",\n                            \"isDeparture\": false,\n                            \"delayed\": false,\n                            \"affectedByLayover\": true,\n                            \"dirTag\": \"N____O_F10\",\n                            \"vehicle\": \"1413\",\n                            \"block\": \"9703\",\n                            \"tripTag\": \"6838974\"\n                        },\n                        ...\n                    ]\n                }\n            ],\n            \"messages\": [  \n                {  \n                    \"text\":\"Nightly subway shutdown until Jan. 2016 from 9:30pm to 1:30am\",\n                    \"priority\":\"High\"\n                },\n                ...\n            ]\n        }\n    ]\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "MissingParameters",            "description": "<p>One or more parameters are missing.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "AgencyNotFound",            "description": "<p>The Agency was not found.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "UnknownError",            "description": "<p>Unknown error, check the message.</p>"          }        ]      },      "examples": [        {          "title": "MissingParameters:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"MissingParameters\",\n    }\n}",          "type": "json"        },        {          "title": "AgencyNotFound:",          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": {\n        \"type\": \"AgencyNotFound\",\n    }\n}",          "type": "json"        },        {          "title": "UnknownError:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"UnknownError\",\n        \"message\": \"For agency=sf-muni stop s=699 is on none of the directions for r=N so cannot determine which stop to provide data for.\"\n    }\n}",          "type": "json"        }      ]    },    "filename": "src/Controllers/api/v1/PredictionsV1ApiWebserviceController.js",    "groupTitle": "Predictions",    "sampleRequest": [      {        "url": "http://uber-coding-challenge.cloud.itechcon.it/api/v1/predictions/:agency"      }    ]  },  {    "type": "get",    "url": "/api/v1/route/:agency/:route",    "title": "Get Route",    "version": "1.0.0",    "name": "get_route",    "group": "Route",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>Agency Tag</p>"          },          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "route",            "description": "<p>Route Tag</p>"          }        ]      }    },    "description": "<p>Get the detail of a route</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/route/sf-muni/N",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.title",            "description": "<p>Title</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.color",            "description": "<p>Color</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.oppositeColor",            "description": "<p>Oppposite color</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.latMin",            "description": "<p>Bounding box latitude min</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.latMax",            "description": "<p>Bounding box latitude mmax</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.lonMin",            "description": "<p>Bounding box latitude min</p>"          },          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "route.stops",            "description": "<p>List of stop</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.stops.tag",            "description": "<p>Tag</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.stops.title",            "description": "<p>Title</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.stops.lat",            "description": "<p>Latitude</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.stops.lon",            "description": "<p>Longitude</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.stops.stopId",            "description": "<p>Unique id</p>"          },          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "route.directions",            "description": "<p>List of directions</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.directions.tag",            "description": "<p>Tag</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.directions.title",            "description": "<p>Title</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.directions.name",            "description": "<p>Name</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "route.directions.useForUI",            "description": "<p>Use for user interface</p>"          },          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "route.directions.stops",            "description": "<p>List of stop</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "route.directions.stops.tag",            "description": "<p>Tag</p>"          },          {            "group": "Success 200",            "type": "object[][]",            "optional": false,            "field": "route.paths",            "description": "<p>List of paths</p>"          },          {            "group": "Success 200",            "type": "object[][]",            "optional": false,            "field": "route.paths.lat",            "description": "<p>Latitude</p>"          },          {            "group": "Success 200",            "type": "object[][]",            "optional": false,            "field": "route.paths.lon",            "description": "<p>Longitude</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n    \"route\": {\n        \"title\": \"N-Judah\",\n        \"color\": \"003399\",\n        \"oppositeColor\": \"ffffff\",\n        \"latMin\": 37.7601699,\n        \"latMax\": 37.7932299,\n        \"lonMin\": -122.5092,\n        \"lonMax\": -122.38798,\n        \"stops\": [\n            {\n                \"tag\": \"4447\",\n                \"title\": \"Duboce Ave & Church St\",\n                \"lat\": 37.7694699,\n                \"lon\": -122.42941,\n                \"stopId\": 14447\n            },\n            ...\n        ],\n        \"directions\": [\n            {\n                \"tag\": \"N____O_F10\",\n                \"title\": \"Outbound to Ocean Beach via Downtown\",\n                \"name\": \"Outbound\",\n                \"useForUI\": true,\n                \"stops\": [\n                    {\n                        \"tag\": \"5240\",\n                    },\n                    ...\n                ]\n            },\n            ...\n        ],\n        \"paths\": [\n            {\n                \"lat\": 37.765,\n                \"lon\": -122.45656\n            },\n            ...\n        ]\n    }\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "MissingParameters",            "description": "<p>One or more parameters are missing.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "AgencyNotFound",            "description": "<p>The Agency was not found.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "RouteNotFound",            "description": "<p>The Route was not found.</p>"          }        ]      },      "examples": [        {          "title": "MissingParameters:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"MissingParameters\",\n    }\n}",          "type": "json"        },        {          "title": "AgencyNotFound:",          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": {\n        \"type\": \"AgencyNotFound\",\n    }\n}",          "type": "json"        },        {          "title": "RouteNotFound:",          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": {\n        \"type\": \"RouteNotFound\",\n    }\n}",          "type": "json"        }      ]    },    "filename": "src/Controllers/api/v1/RouteV1ApiWebserviceController.js",    "groupTitle": "Route",    "sampleRequest": [      {        "url": "http://uber-coding-challenge.cloud.itechcon.it/api/v1/route/:agency/:route"      }    ]  },  {    "type": "get",    "url": "/api/v1/routes/:agency",    "title": "List Routes",    "version": "1.0.0",    "name": "list_routes",    "group": "Routes",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>Agency Tag</p>"          }        ]      }    },    "description": "<p>List the routes handled by the agency</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/routes/sf-muni",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "routes",            "description": "<p>List of route</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "routes.tag",            "description": "<p>Tag</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "routes.title",            "description": "<p>Name</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n    \"routes\": [\n        {\n            \"tag\": \"E\",\n            \"title\": \"E-Embarcadero\",\n        }\n        ...\n    ]\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "MissingParameters",            "description": "<p>One or more parameters are missing.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "AgencyNotFound",            "description": "<p>The Agency was not found.</p>"          }        ]      },      "examples": [        {          "title": "MissingParameters:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"MissingParameters\",\n    }\n}",          "type": "json"        },        {          "title": "AgencyNotFound:",          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": {\n        \"type\": \"AgencyNotFound\",\n    }\n}",          "type": "json"        }      ]    },    "filename": "src/Controllers/api/v1/RoutesV1ApiWebserviceController.js",    "groupTitle": "Routes",    "sampleRequest": [      {        "url": "http://uber-coding-challenge.cloud.itechcon.it/api/v1/routes/:agency"      }    ]  },  {    "type": "get",    "url": "/api/v1/vehicles/:agency/:route",    "title": "List Vehicles",    "version": "1.0.0",    "name": "list_vehicles",    "group": "Vehicles",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>Agency Tag</p>"          },          {            "group": "Parameter",            "type": "string",            "optional": false,            "field": "route",            "description": "<p>Route Tag</p>"          }        ]      }    },    "description": "<p>List the routes handled by the agency</p>",    "examples": [      {        "title": "Example usage:",        "content": "curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/vehicles/sf-muni/N",        "type": "json"      }    ],    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "object[]",            "optional": false,            "field": "vehicles",            "description": "<p>List of vehicles</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.id",            "description": "<p>Id</p>"          },          {            "group": "Success 200",            "type": "string",            "optional": false,            "field": "vehicles.routeTag",            "description": "<p>Tag</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.lat",            "description": "<p>Latitude</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.lon",            "description": "<p>Longitude</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.secsSinceReport",            "description": "<p>Seconds since last report</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.predictable",            "description": "<p>Is the vehicle predictable?</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.heading",            "description": "<p>Heading</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.speedKmHr",            "description": "<p>Speed in Km per hour</p>"          },          {            "group": "Success 200",            "type": "number",            "optional": false,            "field": "vehicles.leadingVehicleId",            "description": "<p>Leading vehicle id</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n    \"vehicles\": [\n        {\n            \"id\": 1431,\n            \"routeTag\": \"N\",\n            \"dirTag\": \"N____O_F10\",\n            \"lat\": 37.79213,\n            \"lon\": -122.39085,\n            \"secsSinceReport\": 12,\n            \"predictable\": true,\n            \"heading\": 336,\n            \"speedKmHr\": 0,\n            \"leadingVehicleId\": null\n        },\n        ...\n    ]\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "MissingParameters",            "description": "<p>One or more parameters are missing.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "AgencyNotFound",            "description": "<p>The Agency was not found.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "RouteNotFound",            "description": "<p>The Route was not found.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "LastUpdateTimeIsNaN",            "description": "<p>The provided LastUpdateTime is not anumber.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "UnknownError",            "description": "<p>Unknown error, check the message.</p>"          }        ]      },      "examples": [        {          "title": "MissingParameters:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"MissingParameters\",\n    }\n}",          "type": "json"        },        {          "title": "AgencyNotFound:",          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": {\n        \"type\": \"AgencyNotFound\",\n    }\n}",          "type": "json"        },        {          "title": "RouteNotFound:",          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": {\n        \"type\": \"RouteNotFound\",\n    }\n}",          "type": "json"        },        {          "title": "LastUpdateTimeIsNaN:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"LastUpdateTimeIsNaN\"\n    }\n}",          "type": "json"        },        {          "title": "UnknownError:",          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": {\n        \"type\": \"UnknownError\",\n        \"message\": \"For agency=sf-muni stop s=699 is on none of the directions for r=N so cannot determine which stop to provide data for.\"\n    }\n}",          "type": "json"        }      ]    },    "filename": "src/Controllers/api/v1/VehiclesV1ApiWebserviceController.js",    "groupTitle": "Vehicles",    "sampleRequest": [      {        "url": "http://uber-coding-challenge.cloud.itechcon.it/api/v1/vehicles/:agency/:route"      }    ]  }] });
