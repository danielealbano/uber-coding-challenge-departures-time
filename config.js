module.exports = {
    generateDataset: {
        maxConcurrentRequest: 10
    },

    webServer: {
        bindings: [
            {
                type: 'http',
                port: process.env.PORT || 3080,
                address: null
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