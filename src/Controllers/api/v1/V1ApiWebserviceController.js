"use strict";

var ApiWebserviceController = require('../ApiWebserviceController.js');

/**
 * Api Webservice Controller
 * Handle webservice v1 api requests
 * @extends ApiWebserviceController
 * @abstract
 */
class V1ApiWebserviceController extends ApiWebserviceController {
    /**
     * Api version 1
     * @override
     * @protected
     */
    _apiVersion() {
        return 1;
    }
}

module.exports = V1ApiWebserviceController;
