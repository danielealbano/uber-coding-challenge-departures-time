"use strict";

var https = require('https');
var http = require('http');
var express = require('express');
var Application = require('./Application.js');
var Libs = require('./Libs');

/**
 * WebServerApplication load the dataset and initialize the needed to serve the requests
 * @extends Application
 */ 
class WebServerApplication extends Application {
    constructor(options) {
        super(options);

        this._express = null;
        this._controllers = null;

        this._log('> uber coding challenge - departure times');

        this._loadDataset();

        this._initExpress();
        this._initControllers();
        this._listen();

        this._log('> started!');
    }

    /**
     * Load the dataset
     * @private
     **/
    _loadDataset() {
        this._log('> loading dataset');
        this._dataset = require(__dirname + '/../dataset.json');

        if (this._dataset === undefined ||
            this._dataset.agencies === undefined ||
            this._dataset.routes === undefined ||
            this._dataset.routesDetails === undefined ||
            this._dataset.geoHashTable === undefined)
        {
            this._log('> dataset corrupted, unable to start!');
            process.exit(-1);
        }
    }

    /**
     * Init express
     * @private
     **/
    _initExpress() {
        this._log('> initializing express');

        this._express = express();
        this._express.disable('etag');
        this._express.use(require('compression')());        
        this._express.use('/', express.static(__dirname + '/Public'));
    }

    /**
     * Load and init the controllers
     * @private
     **/
    _initControllers() {
        this._log('> initializing controllers');

        this._controllers = require('./Controllers')({
            dataset: this._dataset,
            geoHashTable: new Libs.GeoHashTable({ 
                precision: this._options.geoHashTable.precision,
                haversine: new Libs.Haversine(),
                data: this._dataset.geoHashTable
            }),
            express: this._express,
            provider: this._provider
        });
    }

    /**
     * Create an http server
     * @private
     **/
    _createHttpServer() {
        return http.createServer(this._express);
    }

    /**
     * Create an https server
     * @private
     **/
    _createHttpsServer(binding) {
        if (binding.key === undefined ||
            binding.cert === undefined) {
            throw new Error('Missing private key or certificate for ' + binding.address + ':' + binding.port);
        }

        return https.createServer({
            key: binding.key,
            cert: binding.cert
        }, this._express);
    }

    /**
     * Listen on the configured bindings
     * @private
     **/
    _listen() {
        this._log('> initializing bindings');

        var bindings = this._options.webServer.bindings;

        for (var i in bindings) {
            var server;
            var binding = bindings[i];

            if (binding.type === undefined ||
                binding.port === undefined) {
                throw new Error('Malformed binding, please check the config file');
            }

            if (binding.address === undefined) {
                binding.address = null;
            }

            if (binding.type === 'http') {
                server = this._createHttpServer(binding);
            } else if (binding.type === 'https') {
                server = this._createHttpsServer(binding);
            } else {
                throw new Error('Unsupported binding type ' + binding.type);
            }

            try {
                server.listen(binding.port, binding.address);
            } catch(err) {
                console.log(err);
            }
        }
    }
}

module.exports = WebServerApplication;
