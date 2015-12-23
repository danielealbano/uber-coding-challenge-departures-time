"use strict";

var Controller = require('./Controller.js');

/**
 * Webservice Controller
 * Implements the common methods for a webservice
 * @extends Controller
 * @abstract
 */
class WebserviceController extends Controller {
    /**
     * Send a response with json formatted data and a specific status
     * @protected
     */
    _ws(res, status, data) {
        return res
            .type('application/json')
            .status(status)
            .send(data)
            .end();
    }

    /**
     * Send a successful json formatted response (status code 200)
     * @protected
     */
    _successful(res, data) {
        return this._ws(res, 200, data);
    }

    /**
     * Send a successful response with json formatted data (status code 200)
     * @protected
     */
    _error(res, status, err) {
        if (err.type === undefined) {
            throw new Error('Error type not defined');
        }

        return this._ws(res, status, { error: err });
    }

    /**
     * Send a bad request response with a json formatted error (status code 400)
     * @protected
     */
    _badRequest(res, err) {
        return this._error(res, 400, err);
    }

    /**
     * Send a not found response with a json formatted error (status code 404)
     * @protected
     */
    _notFound(res, err) {
        return this._error(res, 404, err);
    }

    /**
     * Send an internal error response with a json formatted error (status code 500)
     * @protected
     */
    _internalError(res, err) {
        return this._error(res, 500, err);
    }
}

module.exports = WebserviceController;
