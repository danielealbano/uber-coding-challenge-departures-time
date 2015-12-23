"use strict";

var querystring = require('querystring');

/**
 * Abstract Provider Request
 * @abstract
 */ 
class Request {
    constructor(options) {
        this._endPoint = options.endPoint;
        this._httpClient = options.httpClient;

        this._error = null;
        this._abort = false;
    }

    /**
     * Init the error
     * @protected
     **/
    _initError() {
        this._error = {
            text: null
        };
    }

    /**
     * Has error
     * @protected
     **/
    _hasError() {
        return !!this._error;
    }

    /**
     * Abort the request
     * @protected
     **/
    _abort() {
        this._abort = true;
    }

    /**
     * Is aborted
     * @protected
     **/
    _isAborted() {
        return this._abort;
    }

    /**
     * Return the url for a given query string
     * @protected
     **/
    _url(qs) {
        return this._endPoint + '?' + querystring.stringify(qs);
    }

    /**
     * Query a given url
     **/
    query(qs, cb) {
        return this._httpClient(this._url(qs))
            .on('response', function(response) {
                response.on('end', function() {
                    if (this._isAborted()) {
                        return;
                    }

                    cb({ name: 'end' });
                }.bind(this));
            }.bind(this));
    }
}

module.exports = Request;