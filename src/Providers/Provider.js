"use strict";

/**
 * Abstract Provider
 * @abstract
 */ 
class Provider {
    constructor(options) {
        this._endPoint = options.endPoint;
        this._httpClient = options.httpClient;
        this._maxConcurrentRequests = options.maxConcurrentRequests;
    }

    /**
     * Setup a new request for the provider
     * @protected
     **/
    _newRquest() {
        throw new Error('Not implemented');
    }

    /**
     * List all the agencies
     **/
    agencies() {
        throw new Error('Not implemented');
    }

    /**
     * List all the routes for a given agency
     **/
    routes() {
        throw new Error('Not implemented');
    }

    /**
     * Get the details for a given agency and route
     **/
    route() {
        throw new Error('Not implemented');
    }

    /**
     * Get the predictions for a given agency and a list of stops
     **/
    predictions() {
        throw new Error('Not implemented');
    }

    /**
     * Get the vehicles for a given agency and route
     **/
    vehicles() {
        throw new Error('Not implemented');
    }
}

module.exports = Provider;
