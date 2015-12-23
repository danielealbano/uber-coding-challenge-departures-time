"use strict";

var WebserviceController = require('../WebserviceController.js');

/**
 * Api Webservice Controller
 * Handle webservice api requests
 * @extends WebserviceController
 * @abstract
 */
class ApiWebserviceController extends WebserviceController {
    /**
     * Return the api version implemented by the controller
     * @protected
     */
    _apiVersion() {
        throw new Error('Not implemented');
    }

    /**
     * Send a response with json formatted data and a specific status, enable CORS
     * @override
     * @protected
     */
    _ws(res, status, data) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

        res.set('X-Api-Version', this._apiVersion());

        return super._ws(res, status, data);
    }
}

module.exports = ApiWebserviceController;
