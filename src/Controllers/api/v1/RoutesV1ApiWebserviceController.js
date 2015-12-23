"use strict";

var V1ApiWebserviceController = require('./V1ApiWebserviceController.js');

/**
 * Routes Webservice Controller
 * This webservice handles /api/v1/routes resource uri
 * @extends V1ApiWebserviceController
 */
class RoutesV1ApiWebserviceController extends V1ApiWebserviceController {
    /**
     * Return the routes handled by the controller
     * @override
     * @protected
     */
    _routes() {
        return [
            {
                route: '/api/v1/routes/:agency',
                method: 'get',
                handler: this.index
            }
        ];
    }

    /**
     * List the routes handled by the agency
     *
     * @api {get} /api/v1/routes/:agency List Routes
     * @apiVersion 1.0.0
     * @apiName list-routes
     * @apiGroup Routes
     *
     * @apiParam {string} agency Agency Tag
     *
     * @apiDescription List the routes handled by the agency
     *
     * @apiExample Example usage:
     * curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/routes/sf-muni
     *
     * @apiSuccess {object[]} routes            List of route
     * @apiSuccess {number}   routes.tag        Tag
     * @apiSuccess {string}   routes.title      Name
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "routes": [
     *             {
     *                 "tag": "E",
     *                 "title": "E-Embarcadero",
     *             }
     *             ...
     *         ]
     *     }
     *
     * @apiError MissingParameters One or more parameters are missing.
     * @apiError AgencyNotFound The Agency was not found.
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
     */
    index(req, res) {
        var params = req.params;

        if (params.agency === undefined) {
            this._badRequest(res, { type: 'MissingParameters' });
            return;
        }

        if (this._dataset.routes[params.agency] === undefined) {
            this._notFound(res, { type: 'AgencyNotFound' });
            return;
        }

        this._successful(res, { routes: this._dataset.routes[params.agency] });
    }
}

module.exports = RoutesV1ApiWebserviceController;
