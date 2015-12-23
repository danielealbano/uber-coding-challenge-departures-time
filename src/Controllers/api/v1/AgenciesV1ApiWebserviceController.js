"use strict";

var V1ApiWebserviceController = require('./V1ApiWebserviceController.js');

/**
 * Agencies V1 Api Webservice Controller
 * This webservice handles /api/v1/agencies resource uri
 * @extends V1ApiWebserviceController
 */
class AgenciesV1ApiWebserviceController extends V1ApiWebserviceController {
    /**
     * Return the routes handled by the controller
     * @override
     * @protected
     */
    _routes() {
        return [
            {
                route: '/api/v1/agencies',
                method: 'get',
                handler: this.index
            }
        ];
    }

    /**
     * List the agencies
     *
     * @api {get} /api/v1/agencies List Agencies
     * @apiVersion 1.0.0
     * @apiName list-agencies
     * @apiGroup Agencies
     *
     * @apiDescription List the agencies
     *
     * @apiExample Example usage:
     * curl -i https://secret-lake-8750.herokuapp.com/api/v1/agencies
     *
     * @apiSuccess {object[]} agencies              List of Agencies
     * @apiSuccess {number}   agencies.tag          Tag
     * @apiSuccess {string}   agencies.title        Name
     * @apiSuccess {string}   agencies.regionTitle  Region
     * @apiSuccess {string}   [agencies.shortTitle] Short Title
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "agencies": [
     *             {
     *                 "tag": "actransit",
     *                 "title": "AC Transit",
     *                 "regionTitle": "California-Northern"
     *             },
     *             ...,
     *             {
     *                 "tag": "sf-muni",
     *                 "title": "San Francisco Muni",
     *                 "shortTitle": "SF Muni",
     *                 "regionTitle": "California-Northern"
     *             },
     *             ...
     *         ]
     *     }
     */
    index(req, res) {
        this._successful(res, { agencies: this._dataset.agencies });
    }
}

module.exports = AgenciesV1ApiWebserviceController;
