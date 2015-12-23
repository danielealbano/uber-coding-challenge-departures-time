"use strict";

/**
 * Controller
 * Implements the controller setup and handling
 * @abstract
 */
class Controller {
    constructor(options) {
        this._allowedMethods = [
            'checkout', 'connect', 'copy', 'delete', 'get', 'head', 'lock', 'merge',
            'mkactivity', 'mkcol', 'move', 'm-search', 'notify', 'options', 'patch',
            'post', 'propfind', 'proppatch', 'purge', 'put', 'report', 'search',
            'subscribe', 'trace', 'unlock', 'unsubscribe' ];
        
        this._dataset       = options.dataset;
        this._geoHashTable  = options.geoHashTable;
        this._express       = options.express;
        this._provider      = options.provider;
    }

    /**
     * List of routes to setup
     * @protected
     */
    _routes() {
        throw new Error('Not implemented');
    }

    /**
     * Setup the routes handled by the controller
     */
    setup() {
        var routes = this._routes();

        for (var i in routes) {
            var route = routes[i];

            if (this._allowedMethods.indexOf(route.method) === -1) {
                throw new Error('Unsupported method ' + route.method + ' for route ' + route.route);
            }

            this._express[route.method](route.route, route.handler.bind(this));
        }
    }
}

module.exports = Controller;
