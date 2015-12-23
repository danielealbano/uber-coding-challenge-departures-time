"use strict";

var V1ApiWebserviceController = require('./V1ApiWebserviceController.js');

/**
 * Predictions Webservice Controller
 * This webservice handles /api/v1/agencies resource uri
 * @extends V1ApiWebserviceController
 */
class PredictionsV1ApiWebserviceController extends V1ApiWebserviceController {
    /**
     * Return the routes handled by the controller
     * @override
     * @protected
     */
    _routes() {
        return [
            {
                route: '/api/v1/predictions/:agency',
                method: 'get',
                handler: this.index
            }
        ];
    }

    /**
     * Prediction of the arrivals/departures times
     * 
     * @api {get} /api/v1/predictions/:agency Get arrivals/departures times
     * @apiVersion 1.0.0
     * @apiName list-predictions
     * @apiGroup Predictions
     *
     * @apiDescription Prediction of the arrivals/departures times
     *
     * @apiParam {String} agency Agency Tag
     * @apiParam {String[]} stops List of routes/stops tag, the stop identifier must be supplied in the format {Route Tag}|{Stop Tag}
     *
     * @apiExample Example usage:
     * curl -i http://uber-coding-challenge.cloud.itechcon.it/api/v1/predictions/sf-muni?stops=N|3212&stops=N|3909
     *
     * @apiSuccess {object[]}   predictions                                 List of predictions
     * @apiSuccess {string}     predictions.routeTag                        Route tag
     * @apiSuccess {string}     predictions.stopTag                         Stop tag
     * @apiSuccess {object[]}   predictions.directions                      List of directions
     * @apiSuccess {number}     predictions.directions.time                 Time
     * @apiSuccess {number}     predictions.directions.seconds              Remaining seconds
     * @apiSuccess {number}     predictions.directions.minutes              Remaining minutes
     * @apiSuccess {boolean}    predictions.directions.isDeparture          Is departure or arrival?
     * @apiSuccess {boolean}    predictions.directions.delayed              Is delayed?
     * @apiSuccess {number}     [predictions.directions.slowness]           If delayed, it reports how slow is a vehicle over the last few minutes over the normal (EXPERIMENTAL)
     * @apiSuccess {boolean}    predictions.directions.affectedByLayover    Is affected by layover?
     * @apiSuccess {number}     predictions.directions.dirTag               Direction tag
     * @apiSuccess {number}     predictions.directions.vehicle              Vehicle id
     * @apiSuccess {number}     predictions.directions.block                Vehicle block number
     * @apiSuccess {number}     predictions.directions.tripTag              Trip tag
     * @apiSuccess {number}     predictions.directions.branch               Branch tag
     * @apiSuccess {object[]}   predictions.messages                        List of messages
     * @apiSuccess {string}     predictions.messages.text                   Text
     * @apiSuccess {string}     predictions.messages.priority               Priority
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {  
     *         "predictions": [  
     *             {  
     *                 "routeTag": "N",
     *                 "stopTag": "6997",
     *                 "directions": [  
     *                     {  
     *                         "title": "Outbound to Ocean Beach via Downtown",
     *                         "predictions": [  
     *                             {  
     *                                 "time": "1450875532434",
     *                                 "seconds": "1096",
     *                                 "minutes": "18",
     *                                 "isDeparture": false,
     *                                 "delayed": false,
     *                                 "affectedByLayover": true,
     *                                 "dirTag": "N____O_F10",
     *                                 "vehicle": "1413",
     *                                 "block": "9703",
     *                                 "tripTag": "6838974"
     *                             },
     *                             ...
     *                         ]
     *                     }
     *                 ],
     *                 "messages": [  
     *                     {  
     *                         "text":"Nightly subway shutdown until Jan. 2016 from 9:30pm to 1:30am",
     *                         "priority":"High"
     *                     },
     *                     ...
     *                 ]
     *             }
     *         ]
     *     }
     * 
     * @apiError MissingParameters One or more parameters are missing.
     * @apiError AgencyNotFound The Agency was not found.
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
            query.stops === undefined) {
            this._badRequest(res, { type: 'MissingParameters' });
            return;
        }

        if (this._dataset.routesDetails[params.agency] === undefined) {
            this._notFound(res, { type: 'AgencyNotFound' });
            return;
        }

        if (Array.isArray(query.stops) === false) {
            query.stops = [ query.stops ];
        }

        this._provider.predictions(params.agency, query.stops, function(predictions, err) {
            if (err) {
                this._badRequest(res, { type: 'UnknownError', message: err.text });
                return;
            }

            this._successful(res, { predictions: predictions });
        }.bind(this));
    }
}

module.exports = PredictionsV1ApiWebserviceController;
