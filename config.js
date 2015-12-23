var fs = require('fs');

module.exports = {
    generateDataset: {
        maxConcurrentRequest: 5
    },

    webServer: {
        bindings: [
            {
                type: 'http',
                port: process.env.PORT || 3080,
                address: null
            },
            {
                type: 'https',
                port: process.env.PORT || 3443,
                address: null,
                cert: fs.readFileSync(__dirname + '/keys/cert.pem'),
                key: fs.readFileSync(__dirname + '/keys/key.pem'),
            }
        ]
    },

    geoHashTable: {
        precision: 8
    },

    provider: {
        name: 'NextbusXml',
        endPoint: 'http://webservices.nextbus.com/service/publicXMLFeed',
        httpClient: require('request'),
        maxConcurrentRequests: 5
    }
};