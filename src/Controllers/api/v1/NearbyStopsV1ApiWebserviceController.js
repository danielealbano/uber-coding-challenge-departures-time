"use strict";

var V1ApiWebserviceController = require('./V1ApiWebserviceController.js');

/**
 * Nearby Stops Webservice Controller
 * This webservice handles /api/v1/nearby-stops resource uri
 * @extends V1ApiWebserviceController
 */
class NearbyStopsV1ApiWebserviceController extends V1ApiWebserviceController {
    /**
     * Return the routes handled by the controller
     * @override
     * @protected
     */
    _routes() {
        return [
            {
                route: '/api/v1/nearby-stops',
                method: 'get',
                handler: this.index
            }
        ];
    }

    /**
     * Get the stops nearby the specified latitude and longitude within the specified distance range. The distance is approximated by +/-20 meters on longitude and +/-10 meters on latitude.
     *
     * @api {get} /api/v1/nearby-stops Get nearby stops
     * @apiVersion 1.0.0
     * @apiName list-nearbystops
     * @apiGroup Nearby Stops
     *
     * @apiDescription Get the stops nearby the specified latitude and longitude within the specified distance range. The distance is approximated by +/-20 meters on longitude and +/-10 meters on latitude.
     *
     * @apiParam {number} lat Latitude
     * @apiParam {number} lon Longitude
     * @apiParam {number} distance Distance in distance unit format
     * @apiParam {string="km","miles"} distanceUnit Distance unit (km or miles)
     *
     * @apiExample Example usage:
     * curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/nearby-stops?lat=37.79096&lon=-122.4020799&distance=0.1&distanceUnit=km
     *
     * @apiSuccess {object[]}   stops               List of stops
     * @apiSuccess {string}     stops.lat           Latitude
     * @apiSuccess {string}     stops.lon           Longitude
     * @apiSuccess {string}     stops.agencyTag     Agency tag
     * @apiSuccess {string}     stops.routeTag      Route tag
     * @apiSuccess {string}     stops.stopTag       Stop tag
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "stops": [
     *             {
     *                 "lat": 37.79096,
     *                 "lon": -122.4020799,
     *                 "agencyTag": "sf-muni",
     *                 "routeTag": "2",
     *                 "stopTag": "77"
     *             }
     *             ...
     *         ]
     *     }
     *
     * @apiError MissingParameters One or more parameters are missing.
     * @apiError DistanceUnitUnsupported Distance unit is unsupported.
     * @apiError InvalidLatitudeOrLongitudeOrDistance Latitude, lon or distance are invalid.
     * 
     * @apiErrorExample MissingParameters:
     *     HTTP/1.1 400 Bad Request
     *     {
     *         "error": {
     *             "type": "MissingParameters",
     *         }
     *     }
     * 
     * @apiErrorExample DistanceUnitUnsupported:
     *     HTTP/1.1 400 Bad Request
     *     {
     *         "error": {
     *             "type": "DistanceUnitUnsupported",
     *         }
     *     }
     * 
     * @apiErrorExample InvalidLatitudeOrLongitudeOrDistance:
     *     HTTP/1.1 400 Bad Request
     *     {
     *         "error": {
     *             "type": "InvalidLatitudeOrLongitudeOrDistance",
     *         }
     *     }
     */
    index(req, res) {
        var query = req.query;

        if (query.lat === undefined ||
            query.lon === undefined ||
            query.distance === undefined ||
            query.distanceUnit === undefined) {
            this._badRequest(res, { type: 'MissingParameters' });
            return;
        }

        if (query.distanceUnit !== 'km' &&
            query.distanceUnit !== 'mile') {
            this._badRequest(res, { type: 'DistanceUnitUnsupported' });
            return;
        }

        query.lat = parseFloat(query.lat);
        query.lon = parseFloat(query.lon);
        query.distance = parseFloat(query.distance);

        if (isNaN(query.lat) || 
            isNaN(query.lon) || 
            isNaN(query.distance)) {
            this._badRequest(res, { type: 'InvalidLatitudeOrLongitudeOrDistance' });
            return;
        }

        var stops = this._geoHashTable.getByDistance(
            query.lat,
            query.lon,
            query.distance,
            query.distanceUnit);

        this._successful(res, { stops: stops });
    }
}

module.exports = NearbyStopsV1ApiWebserviceController;
