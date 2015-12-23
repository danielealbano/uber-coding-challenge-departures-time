"use strict";

var V1ApiWebserviceController = require('./V1ApiWebserviceController.js');

/**
 * Route Webservice Controller
 * This webservice handles /api/v1/route resource uri
 * @extends V1ApiWebserviceController
 */
class RouteV1ApiWebserviceController extends V1ApiWebserviceController {
    /**
     * Return the routes handled by the controller
     * @override
     * @protected
     */
    _routes() {
        return [
            {
                route: '/api/v1/route/:agency/:route',
                method: 'get',
                handler: this.index
            }
        ];
    }

    /**
     * Get the detail of a route
     * 
     * @api {get} /api/v1/route/:agency/:route Get Route
     * @apiVersion 1.0.0
     * @apiName get-route
     * @apiGroup Route
     *
     * @apiParam {string} agency Agency Tag
     * @apiParam {string} route Route Tag
     *
     * @apiDescription Get the detail of a route
     *
     * @apiExample Example usage:
     * curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/route/sf-muni/N
     *
     * @apiSuccess {string}     route.title                     Title
     * @apiSuccess {string}     route.color                     Color
     * @apiSuccess {string}     route.oppositeColor             Oppposite color
     * @apiSuccess {number}     route.latMin                    Bounding box latitude min
     * @apiSuccess {number}     route.latMax                    Bounding box latitude mmax
     * @apiSuccess {number}     route.lonMin                    Bounding box latitude min
     * @apiSuccess {number}     route.lonMin                    Bounding box latitude max
     * @apiSuccess {object[]}   route.stops                     List of stop
     * @apiSuccess {string}     route.stops.tag                 Tag
     * @apiSuccess {string}     route.stops.title               Title
     * @apiSuccess {number}     route.stops.lat                 Latitude
     * @apiSuccess {number}     route.stops.lon                 Longitude
     * @apiSuccess {number}     route.stops.stopId              Unique id
     * @apiSuccess {object[]}   route.directions                List of directions
     * @apiSuccess {string}     route.directions.tag            Tag
     * @apiSuccess {string}     route.directions.title          Title
     * @apiSuccess {number}     route.directions.name           Name
     * @apiSuccess {number}     route.directions.useForUI       Use for user interface
     * @apiSuccess {object[]}   route.directions.stops          List of stop
     * @apiSuccess {string}     route.directions.stops.tag      Tag
     * @apiSuccess {object[][]} route.paths                     List of paths
     * @apiSuccess {object[][]} route.paths.lat                 Latitude
     * @apiSuccess {object[][]} route.paths.lon                 Longitude
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "route": {
     *             "title": "N-Judah",
     *             "color": "003399",
     *             "oppositeColor": "ffffff",
     *             "latMin": 37.7601699,
     *             "latMax": 37.7932299,
     *             "lonMin": -122.5092,
     *             "lonMax": -122.38798,
     *             "stops": [
     *                 {
     *                     "tag": "4447",
     *                     "title": "Duboce Ave & Church St",
     *                     "lat": 37.7694699,
     *                     "lon": -122.42941,
     *                     "stopId": 14447
     *                 },
     *                 ...
     *             ],
     *             "directions": [
     *                 {
     *                     "tag": "N____O_F10",
     *                     "title": "Outbound to Ocean Beach via Downtown",
     *                     "name": "Outbound",
     *                     "useForUI": true,
     *                     "stops": [
     *                         {
     *                             "tag": "5240",
     *                         },
     *                         ...
     *                     ]
     *                 },
     *                 ...
     *             ],
     *             "paths": [
     *                 {
     *                     "lat": 37.765,
     *                     "lon": -122.45656
     *                 },
     *                 ...
     *             ]
     *         }
     *     }
     *
     * @apiError MissingParameters One or more parameters are missing.
     * @apiError AgencyNotFound The Agency was not found.
     * @apiError RouteNotFound The Route was not found.
     * 
     * @apiErrorExample MissingParameters:
     *     HTTP/1.1 400 Bad Request
     *     {
     *         "error": {
     *             "type": "MissingParameters",
     *         }
     *     }
     * 
     * @apiErrorExample AgencyNotFound:
     *     HTTP/1.1 404 Not Found
     *     {
     *         "error": {
     *             "type": "AgencyNotFound",
     *         }
     *     }
     * 
     * @apiErrorExample RouteNotFound:
     *     HTTP/1.1 404 Not Found
     *     {
     *         "error": {
     *             "type": "RouteNotFound",
     *         }
     *     }
     */
    index(req, res) {
        var params = req.params;

        if (params.agency === undefined ||
            params.route === undefined) {
            this._badRequest(res, { type: 'MissingParameters' });
            return;
        }

        if (this._dataset.routesDetails[params.agency] === undefined) {
            this._notFound(res, { type: 'AgencyNotFound' });
            return;
        }

        if (this._dataset.routesDetails[params.agency][params.route] === undefined) {
            this._notFound(res, { type: 'RouteNotFound' });
            return;
        }

        this._successful(res, { route: this._dataset.routesDetails[params.agency][params.route] });
    }
}

module.exports = RouteV1ApiWebserviceController;
