"use strict";

var Provider = require('./Provider.js');
var NextbusXmlRequest = require('./NextbusXmlRequest.js');

/**
 * NextbusXmlProvider implementation
 * @extends Provider
 */ 
class NextbusXmlProvider extends Provider {

    /**
     * Init a new request
     * @protected
     * @override
     **/
    _newRequest() {
        return new NextbusXmlRequest({
            endPoint: this._endPoint,
            httpClient: this._httpClient
        });
    }

    /**
     * List all the agencies
     **/
    agencies(cb) {
        var agencies = [ ];

        this._newRequest().query({ command: 'agencyList' }, function(e) {
            switch(e.name) {
                case 'error':
                    cb(null, e.data);
                    break;

                case 'opentag':
                    var tag = e.data;
                    var attributes = tag.attributes;

                    if (tag.name === 'agency') {
                        agencies.push(attributes);
                    }
                    break;

                case 'end':
                    cb(agencies);
                    break;
            }
        }.bind(this));
    }

    /**
     * List all the routes for a given agency
     **/
    routes(agencyTag, cb) {
        var routes = [ ];

        this._newRequest().query({ command: 'routeList', a: agencyTag }, function(e) {
            switch(e.name) {
                case 'error':
                    cb(null, e.data);
                    break;

                case 'opentag':
                    var tag = e.data;
                    var attributes = tag.attributes;
                    
                    if (tag.name === 'route') {
                        routes.push(attributes);
                    }
                    break;

                case 'end':
                    cb(routes);
                    break;
            }
        });
    }

    /**
     * Get the details for a given agency and route
     **/
    route(agencyTag, routeTag, cb) {
        var route = {
            title: '',
            color: '',
            oppositeColor: '',
            latMin: '',
            latMax: '',
            lonMin: '',
            lonMax: '',

            stops: [ ],
            directions: [ ],
            paths: [ ],
        };

        var currentElement;

        this._newRequest().query({ command: 'routeConfig', a: agencyTag, r: routeTag }, function(e) {
            switch(e.name) {
                case 'error':
                    cb(null, e.data);
                    break;

                case 'opentag':
                    var tag = e.data;
                    var attributes = tag.attributes;
                    
                    if (tag.name === 'route') {
                        for(var i in attributes) {
                            route[i] = attributes[i];
                        }
                        route.latMin = parseFloat(route.latMin);
                        route.latMax = parseFloat(route.latMax);
                        route.lonMin = parseFloat(route.lonMin);
                        route.lonMax = parseFloat(route.lonMax);

                        currentElement = route;
                    } else if (tag.name === 'direction') {
                        var direction = attributes;
                        direction.useForUI = direction.useForUI === 'true' ? true : false;
                        direction.stops = [ ];
                        route.directions.push(direction);

                        currentElement = direction;
                    } else if (tag.name === 'path') {
                        var path = [ ];
                        route.paths.push(path);

                        currentElement = path;
                    } else if (tag.name === 'stop') {
                        var stop = attributes;

                        if (stop.lat !== undefined) {
                            stop.lat = parseFloat(stop.lat);
                        }

                        if (stop.lon !== undefined) {
                            stop.lon = parseFloat(stop.lon);
                        }

                        if (stop.stopId !== undefined) {
                            stop.stopId = parseInt(stop.stopId);
                        }

                        currentElement.stops.push(stop);
                    } else if (tag.name === 'point') {
                        var point = attributes;
                        point.lat = parseFloat(point.lat);
                        point.lon = parseFloat(point.lon);
                        currentElement.push(point); 
                    }
                    break;

                case 'end':
                    cb(route);
                    break;
            }
        });
    }

    /**
     * Get the predictions for a given agency and a list of stops
     **/
    predictions(agencyTag, stops, cb) {
        var predictions = [ ],
            sliceSize = 150,
            concurrentRequestsCount = 0;

        var slices = [ ],
            sliceIndex = 0;
        if (stops.length <= sliceSize) {
            slices.push(stops);
        } else {
            for (var i = 0; i < stops.length; i += sliceSize) {
                slices.push(stops.slice(i, i + sliceSize));
            }
        }

        var waitForRequestsEnd = function() {
            if (concurrentRequestsCount > 0) {
                return;
            }

            cb(predictions);
        }.bind(this);

        var queryPredictionsForMultiStopBySlices = function(sliceIndex) {
            var currentPredictions,
                currentDirection;

            this._newRequest().query({
                command: 'predictionsForMultiStops', a: agencyTag, stops: slices[sliceIndex] }, function(e) {
                switch(e.name) {
                    case 'error':
                        cb(null, e.data);
                        break;

                    case 'opentag':
                        var tag = e.data;
                        var attributes = tag.attributes;
                        
                        if (tag.name === 'predictions') {
                            currentPredictions = {
                                routeTag:   attributes.routeTag,
                                stopTag:    attributes.stopTag,
                                directions: [ ],
                                messages:   [ ]
                            };

                            predictions.push(currentPredictions);
                        } else if (tag.name === 'direction') {
                            currentDirection = {
                                title:          attributes.title,
                                predictions:    [ ]
                            };

                            currentPredictions.directions.push(currentDirection);
                        } else if (tag.name === 'prediction') {
                            currentDirection.predictions.push({
                                time:               attributes.epochTime,
                                seconds:            parseInt(attributes.seconds),
                                minutes:            parseInt(attributes.minutes),
                                isDeparture:        attributes.isDeparture === 'true' ? true : false,
                                delayed:            attributes.delayed === 'true' ? true : false,
                                slowness:           attributes.slowness ? parseFloat(attributes.slowness) : undefined,
                                affectedByLayover:  attributes.affectedByLayover === 'true' ? true : false,
                                dirTag:             attributes.dirTag,
                                vehicle:            attributes.vehicle,
                                block:              attributes.block,
                                tripTag:            attributes.tripTag,
                                branch:             attributes.branch
                            });
                        } else if (tag.name === 'message') {
                            currentPredictions.messages.push({
                                text:       attributes.text,
                                priority:   attributes.priority,
                            });
                        }
                        break;

                    case 'end':
                        concurrentRequestsCount--;
                        waitForRequestsEnd();
                        break;
                }
            });
        };

        var tryToRequest = function() {
            if (concurrentRequestsCount >= this._maxConcurrentRequests) {
                setTimeout(tryToRequest.bind(this), 100);
                return;
            }

            concurrentRequestsCount++;

            process.nextTick(queryPredictionsForMultiStopBySlices.bind(this, sliceIndex));
            sliceIndex++;

            if (sliceIndex === slices.length) {
                return;
            }

            process.nextTick(tryToRequest.bind(this));
        }.bind(this);

        tryToRequest();
    }

    /**
     * Get the vehicles for a given agency and route
     **/
    vehicles(agencyTag, routeTag, lastUpdateTime, cb) {
        var vehicles = [ ];

        if (lastUpdateTime === undefined) {
            lastUpdateTime = 0;
        }

        this._newRequest().query({
            command: 'vehicleLocations', a: agencyTag, r: routeTag, t: lastUpdateTime }, function(e) {
            switch(e.name) {
                case 'error':
                    cb(null, e.data);
                    break;

                case 'opentag':
                    var tag = e.data;
                    var attributes = tag.attributes;
                    
                    if (tag.name === 'lastTime') {
                        lastUpdateTime = attributes.time;
                    } else if (tag.name === 'vehicle') {
                        var vehicle = attributes;

                        vehicle.id                  = parseInt(vehicle.id);
                        vehicle.lat                 = parseFloat(vehicle.lat);
                        vehicle.lon                 = parseFloat(vehicle.lon);
                        vehicle.secsSinceReport     = parseInt(vehicle.secsSinceReport);
                        vehicle.predictable         = vehicle.predictable === 'true' ? true : false;
                        vehicle.heading             = parseFloat(vehicle.heading);
                        vehicle.speedKmHr           = parseFloat(vehicle.speedKmHr);
                        vehicle.leadingVehicleId    = parseInt(vehicle.leadingVehicleId);

                        vehicles.push(vehicle);
                    }
                    break;

                case 'end':
                    cb(vehicles, lastUpdateTime);
                    break;
            }
        });
    }
}

module.exports = NextbusXmlProvider;
