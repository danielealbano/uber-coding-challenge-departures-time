"use strict";

/**
 * Abstract Application
 * @abstract
 */ 
class Application {
    constructor(options) {
        this._options = options;

        this._env = process.env.NODE_ENV;
        this._provider = null;

        this._initExceptionHandler();

        this._initProvider();
    }

    /**
     * Init the exception handler
     * @protected
     **/
    _initExceptionHandler() {
        process.on('uncaughtException', this._exceptionHandler.bind(this));
    }

    /**
     * Log a message
     * @protected
     **/
    _log(message) {
        console.log('[' + (new Date()).toUTCString() + '] ', message);
    }

    /**
     * Handle the unhandled exceptions
     * @protected
     **/
    _exceptionHandler(err) {
        if (err.code === 'EADDRINUSE') {
            console.error('Server port alread in use, unable to start!');
        } else {
            console.error('[' + (new Date()).toUTCString() + '] uncaught exception:', err.message);
            console.error(err.stack);
        }

        process.exit(-1);
    }

    /**
     * Init the provider defined in the configuration
     * @protected
     **/
    _initProvider() {
        var providers = require('./Providers');

        var providerOptions = this._options.provider;
        var providerName = providerOptions.name + 'Provider';

        if (providers[providerName] === undefined) {
            throw new Error('Provider ' + providerName + ' is not supported');
        }

        this._provider = new providers[providerName](providerOptions);
    }
}

module.exports = Application;
