"use strict";

var V1ApiWebserviceController = require('./V1ApiWebserviceController.js');

/**
 * Vehicles Webservice Controller
 * This webservice handles /api/v1/vehicles resource uri
 * @extends V1ApiWebserviceController
 */
class VehiclesV1ApiWebserviceController extends V1ApiWebserviceController {
    /**
     * Return the routes handled by the controller
     * @override
     * @protected
     */
    _routes() {
        return [
            {
                route: '/api/v1/vehicles/:agency/:route',
                method: 'get',
                handler: this.index
            }
        ];
    }


    /**
     * List the routes handled by the agency
     *
     * @api {get} /api/v1/vehicles/:agency/:route List Vehicles
     * @apiVersion 1.0.0
     * @apiName list-vehicles
     * @apiGroup Vehicles
     *
     * @apiParam {string} agency Agency Tag
     * @apiParam {string} route Route Tag
     *
     * @apiDescription List the routes handled by the agency
     *
     * @apiExample Example usage:
     * curl -i https://secret-lake-8750.herokuapp.com/api/v1/vehicles/sf-muni/N
     *
     * @apiSuccess {object[]} vehicles                      List of vehicles
     * @apiSuccess {number}   vehicles.id                   Id
     * @apiSuccess {string}   vehicles.routeTag             Tag
     * @apiSuccess {number}   vehicles.lat                  Latitude
     * @apiSuccess {number}   vehicles.lon                  Longitude
     * @apiSuccess {number}   vehicles.secsSinceReport      Seconds since last report
     * @apiSuccess {number}   vehicles.predictable          Is the vehicle predictable?
     * @apiSuccess {number}   vehicles.heading              Heading
     * @apiSuccess {number}   vehicles.speedKmHr            Speed in Km per hour
     * @apiSuccess {number}   vehicles.leadingVehicleId     Leading vehicle id
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "vehicles": [
     *             {
     *                 "id": 1431,
     *                 "routeTag": "N",
     *                 "dirTag": "N____O_F10",
     *                 "lat": 37.79213,
     *                 "lon": -122.39085,
     *                 "secsSinceReport": 12,
     *                 "predictable": true,
     *                 "heading": 336,
     *                 "speedKmHr": 0,
     *                 "leadingVehicleId": null
     *             },
     *             ...
     *         ]
     *     }
     *
     * @apiError MissingParameters One or more parameters are missing.
     * @apiError AgencyNotFound The Agency was not found.
     * @apiError RouteNotFound The Route was not found.
     * @apiError LastUpdateTimeIsNaN The provided LastUpdateTime is not anumber.
     * @apiError UnknownError Unknown error, check the message.
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
     * 
     * @apiErrorExample LastUpdateTimeIsNaN:
     *     HTTP/1.1 400 Bad Request
     *     {
     *         "error": {
     *             "type": "LastUpdateTimeIsNaN"
     *         }
     *     }
     * 
     * @apiErrorExample UnknownError:
     *     HTTP/1.1 400 Bad Request
     *     {
     *         "error": {
     *             "type": "UnknownError",
     *             "message": "For agency=sf-muni stop s=699 is on none of the directions for r=N so cannot determine which stop to provide data for."
     *         }
     *     }
     */
    index(req, res) {
        var params = req.params;
        var query = req.query;

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

        if (query.lastUpdateTime !== undefined && isNaN(query.lastUpdateTime)) {
            this._badRequest(res, { type: 'LastUpdateTimeIsNaN' });
            return;
        }

        this._provider.vehicles(params.agency, params.route, query.lastUpdateTime, function(vehicles, lastUpdateTime, err) {
            if (err) {
                this._badRequest(res, { type: 'UnknownError', message: err.text });
                return;
            }

            this._successful(res, { vehicles: vehicles, lastUpdateTime: lastUpdateTime });
        }.bind(this));
    }
}

module.exports = VehiclesV1ApiWebserviceController;
