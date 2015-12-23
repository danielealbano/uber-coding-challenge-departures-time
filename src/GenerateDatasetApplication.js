"use strict";

var fs = require('fs');
var Libs = require('./Libs');
var Application = require('./Application.js');

/**
 * GenerateDatasetApplication is used to download a build a local dataset using the provider api
 * @extends Application
 */ 
class GenerateDatasetApplication extends Application {
    constructor(options) {
        super(options);

        this._dataset = {
            agencies:       { },
            routes:         { },
            routesDetails:  { },
            geoHashTable:   [ ]
        };

        this._downloadAgencies();
    }

    /**
     * Download the agencies
     * @private
     **/
    _downloadAgencies() {
        this._log('> Downloading agencies');
        this._provider.agencies(function(agencies, err) {
            if (err) {
                throw new Error(err.message);
            }

            this._dataset.agencies = agencies;
            
            this._log('> done');

            this._downloadRoutes();
        }.bind(this));
    }

    /**
     * Download the routes for all the agencies
     * @private
     **/
    _downloadRoutes() {
        this._log('> Downloading routes');

        var agencies = this._dataset.agencies;
        var agenciesTag = Object.keys(this._dataset.agencies);

        var agencyTagIndex = 0;
        var concurrentRequestsCount = 0;

        var _waitConcurrentRequests = function() {
            if (concurrentRequestsCount > 0) {
                setTimeout(_waitConcurrentRequests.bind(this), 1000);
                return;
            }

            this._log('> done');
            process.nextTick(this._downloadRoutesDetails.bind(this));
        };

        var downloadRoutes = function() {
            if (concurrentRequestsCount >= this._options.generateDataset.maxConcurrentRequest) {
                setTimeout(downloadRoutes.bind(this), 100);
                return;
            }

            var agencyTag = agenciesTag[agencyTagIndex];
            var agency = agencies[agencyTag];
            this._log('>>  [' + (agencyTagIndex + 1) + '/' + agenciesTag.length + '] ' + agency.title + ' (' + agency.tag + ')');

            concurrentRequestsCount++;
            process.nextTick(function(agencyTagIndex) {
                var agency = agencies[agenciesTag[agencyTagIndex]];

                this._provider.routes(agency.tag, function(routes, err) {
                    if (err) {
                        this._log('>>  [' + (agencyTagIndex + 1) + '/' + agenciesTag.length + '] failed to download routes, ' + err.message);
                    } else {
                        this._dataset.routes[agency.tag] = routes;
                    }
                    concurrentRequestsCount--;
                }.bind(this));
            }.bind(this, agencyTagIndex));

            agencyTagIndex++;
            if (agencyTagIndex >= agenciesTag.length) {
                process.nextTick(_waitConcurrentRequests.bind(this));
                return;
            }

            process.nextTick(downloadRoutes.bind(this));
        }.bind(this);

        downloadRoutes();
    }

    /**
     * Download the details of all routes for all the agencies
     * @private
     **/
    _downloadRoutesDetails() {
        this._log('> Downloading routes details');

        var agencies = this._dataset.agencies;
        var agenciesTag = Object.keys(this._dataset.agencies);

        var routes = null;
        var agency = null;
        var routesTag = null;
        var agencyTagIndex = 0;
        var routeTagIndex = 0;
        var concurrentRequestsCount = 0;

        var _waitConcurrentRequests = function() {
            if (concurrentRequestsCount > 0) {
                setTimeout(_waitConcurrentRequests.bind(this), 1000);
                return;
            }

            this._log('> done');
            process.nextTick(this._buildGeoHashtable.bind(this));
        };

        var _nextRouteDetails = function() {
            agency = agencies[agenciesTag[agencyTagIndex]];

            routes = this._dataset.routes[agency.tag];
            routesTag = Object.keys(routes);
            routeTagIndex = 0;

            this._dataset.routesDetails[agency.tag] = { };

            this._log('>>  [' + (agencyTagIndex + 1) + '/' + agenciesTag.length + '] ' + agency.title + ' (' + agency.tag + ')');

            _downloadRouteDetails();
        }.bind(this);

        var _downloadRouteDetails = function() {
            if (concurrentRequestsCount >= this._options.generateDataset.maxConcurrentRequest) {
                setTimeout(_downloadRouteDetails.bind(this), 100);
                return;
            }

            var routeTag = routesTag[routeTagIndex];
            var route = routes[routeTag];

            this._log('>>>   [' + (routeTagIndex + 1) + '/' + routesTag.length + '] ' + route.title + ' (' + route.tag + ')');

            concurrentRequestsCount++;
            process.nextTick(function(agencyTagIndex, routeTagIndex) {
                var agency = agencies[agenciesTag[agencyTagIndex]];
                var route = routes[routesTag[routeTagIndex]];

                this._provider.route(agency.tag, route.tag, function(routeDetails, err) {
                    if (err) {
                        this._log('>>> [' + (agencyTagIndex + 1) + '/' + agenciesTag.length + '] failed to download route details, ' + err.message);
                    } else {
                        this._dataset.routesDetails[agency.tag][route.tag] = routeDetails;
                    }

                    concurrentRequestsCount--;
                }.bind(this));
            }.bind(this, agencyTagIndex, routeTagIndex));

            routeTagIndex++;
            if (routeTagIndex >= routesTag.length) {
                agencyTagIndex++;
                if (agencyTagIndex >= agenciesTag.length) {
                    process.nextTick(_waitConcurrentRequests.bind(this));
                } else {
                    process.nextTick(_nextRouteDetails.bind(this));
                }
                return;
            }

            process.nextTick(_downloadRouteDetails.bind(this));
        }.bind(this);

        _nextRouteDetails();
    }

    /**
     * Build the geohashtable
     * @private
     **/
    _buildGeoHashtable() {
        var geoHashTable = new Libs.GeoHashTable({
            precision: this._options.geoHashTable.precision,
            haversine: new Libs.Haversine()
        });

        this._log('> Generating geohashtable');

        for (var agencyTag in this._dataset.routesDetails) {
            for (var routeTag in this._dataset.routesDetails[agencyTag]) {
                var routeDetail = this._dataset.routesDetails[agencyTag][routeTag];

                for (var stopIndex in routeDetail.stops) {
                    var stop = routeDetail.stops[stopIndex];

                    geoHashTable.add({
                        lat: parseFloat(stop.lat),
                        lon: parseFloat(stop.lon),
                        agencyTag: agencyTag, 
                        routeTag: routeTag,
                        stopTag: stop.tag
                    });
                }
            }
        }

        this._dataset.geoHashTable = geoHashTable.getData();
        this._log('> done');

        process.nextTick(this._saveDataset.bind(this));
    }

    /**
     * Save the dataset
     * @private
     **/
    _saveDataset() {
        fs.writeFileSync(__dirname + '/../dataset.json', JSON.stringify(this._dataset));
    }
}

module.exports = GenerateDatasetApplication;
