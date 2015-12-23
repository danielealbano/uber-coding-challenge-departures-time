"use strict";

var filesToSkip = [ 
    'index.js',
    'Controller.js',
    'WebserviceController.js',
    'ApiWebserviceController.js',
    'V1ApiWebserviceController.js'
];

var fs = require('fs');

module.exports = function(options) {
    var currentControllersPath = null,
        controllers = { },
        controllersPath = __dirname,
        paths = [ __dirname ];

    while((currentControllersPath = paths.shift())) {
        var files = fs.readdirSync(currentControllersPath);

        for (var i in files) {
            var controllerFile = files[i];
            var controllerPath = currentControllersPath + '/' + controllerFile;
            var controllerExtension = (controllerPath.substr(controllerPath.lastIndexOf('.') + 1)).toLowerCase();
            var controllerName = controllerPath.substr(controllersPath.length + 1);
                controllerName = controllerName.substr(0, controllerName.length - (controllerExtension.length + 1));

            if (fs.statSync(controllerPath).isDirectory()) {
                paths.push(controllerPath);
                continue;
            }

            if (controllerExtension !== 'js' ||
                filesToSkip.indexOf(controllerFile) !== -1) {
                continue;
            }

            var controller = new (require(controllerPath))(options);
            controller.setup();
            controllers[controllerName] = controller;
        }
    }

    return controllers;
};
