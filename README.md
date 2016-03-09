## Departures Time

This repository contains an implementation of the Departures Time coding challenge, it is hosted on a digital ocean droplet and can be reached at the following urls https://uber-coding-challenge.cloud.itechcon.it/ and http://uber-coding-challenge.cloud.itechcon.it/.

__The virtual machine is not available anymore__

### The Challenge

> Create a service that gives real-time departure time for public transportation (use freely available public API). The app should geolocalize the user.
> 
> Here are some examples of freely available data:
> 
> [511](http://511.org/developer-resources_transit-api.asp) (San Francisco)
> 
> [Nextbus](http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf) (San Francisco)

I chose the Departure Times project because it is an interesting challenge, after playing a bit with the Nextbus Api I saw that their dataset contains more than 100.000 stops.

### Notes for Reviewers

I chose javascript (node.js) as language but I have no real experience with it, I work mainly with PHP for web applications and C# for windows desktop and client/server applications.

A GeoHashTable, using the [GeoHash](https://en.wikipedia.org/wiki/Geohash) algorithm, has been implemented to extract nearby stops. A nice feature of this hashing method is the ability to groupp all the points inside a specific area by using a common prefix. 

For the requested requirements a discrete precision is good enough. the GeoHashTable.getByDistance returns the points rounding the distance to a bounding box area as follows:
* `width = distance + (cell width / 2)`
* `height = distance + (cell height / 2)`

The cell width and cell height depend on the precision of the geohash, the current configuration uses a precision of 8 that translates to a cell width of 38.2m and a cell height of 19m.
This means that give a distance of 100mt the points contined in a bounding box with the following size are returned:
* `width = 119.1mt`;
* `height = 109.5mt`;

The code hasn't been developed following a test driven approach because I don't have specific knowledge of the mocha framework

*2015/12/23, at about 20.30 GMT+1, the Nextbus's CDN, Incapsula, began to block the requests sending back some html and/or causing redirection loops. After digging deeper, I discovered they were sending two cookies (visid_incap_{NUMBER1} and incap_sess_{NUMBER2}_{NUMBER1}) to try to detect and block automated requests. I workarounded it doing a request to read the cookies but a few hours later they disabled the check and, right after, I removed the code. If the predictions webservice fails may depend on this*

### Requirements

* [Node.js](http://nodejs.org/) >= 5.3.0

### Install

1. Install node.js
2. `npm install`
3. Copy config.js.skel to config.js
4. Change the configuration file as needed, the most relevant section is `bindings`
5. `node generate-dataset.js`

### Test

1. Check if dev dependencies have been installed
  * if not, `npm install --dev`
2. `npm test`

### Generate Api Documentation

1. Check if dev dependencies have been installed
  * if not, `npm install --dev`
2. `./node_modules/apidoc/bin/apidoc -o apidoc/ -i src/Controllers/api/`

### Run

1. `npm start`

### Stack/Tools Used

* node.js (very little experience)
* [express](http://expressjs.com/en/index.html) (very little experience)
  * [compression](https://www.npmjs.com/package/compression)
  * [errorhandler](https://www.npmjs.com/package/errorhandler)
* [request](https://www.npmjs.com/package/request)
* [sax](https://www.npmjs.com/package/sax) (I know the api but I never used this module)
* [jshint](http://jshint.com/) (no experience)
* [mocha](https://mochajs.org/) (no experience)
* [apidoc](http://apidocjs.com/) (no experience)

### Technical choices

There would be a lot to say, but in brief:
* ES6 features, like classes, have been used
* A data storage backed by a local file has been used to simplify the deploy on heroku
* A [sax parser](https://en.wikipedia.org/wiki/Simple_API_for_XML) has been used to reduce resources consumption
* I avoided comments, On purpose, in the methods body, the code must be self-explanatory
* The application is written with [KISS](https://en.wikipedia.org/wiki/KISS_principle) priciple in mind
  * the version number is contained in the resource uri, it makes the development and testing easier
  * The parameters are passed as part of the resource uri or in the query string
* The GeoHashTable isn't a real hashtable implementation but relies on node.js ([V8](https://developers.google.com/v8/)) array/hashtable implementation

### What can be improved?

Because of my basic knowledge there is a lot that can be improved:
* Write more tests! Almost all the code has been written with tests and mocking in mind, but few tests have been written
* Improve code documentation
* Improve error checking in [Nextbus](https://www.nextbus.com/) provider
* Implement logging
* Implement a (real) exception handler
* Handle non existent routes
* The data storage is provided by a local file, add support for [MongoDB](https://www.mongodb.org/) or [Redis](http://redis.io/)
* Add support for [Cluster](https://nodejs.org/api/cluster.html, because of the previous point it is not possible to use Cluster, every fork would load the entire dataset in memory
* Implement [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* Improve GenerateDatasetApplication, right now it is a monolithic piece of code
* Implement [DI](https://en.wikipedia.org/wiki/Dependency_injection) and [IoC](https://en.wikipedia.org/wiki/Inversion_of_control) patterns, ie. using [Electrolyte](https://github.com/jaredhanson/electrolyte)
* Implement models to avoid direct access to the data storage
* Implement a class loader, I have implemented a custom loader for the Controllers but it is better to stick to a common one for all the classes
* Implement data caching
* Implement e-tag header support
* Stick to another sax parser, the current parser triggers the opentag event after reading the entire tag
* Implement the GeoHashTable as node.js native extension
* The controllers are tied to express, it is better to implement an abstraction layer to be able to change the framework used without rewriting all the controllers
* Stick to a better api documentator, apidoc is somewhat bugged because the webservice tester prints out escaped json
* A list of geo hashes groups, identified by a common prefix with a lowered precision, may be implemented to speed up the search
* Switch to [babel](https://babeljs.io/) (or similar), to use visibility modifiers, arrow functions, async generators, default export, and so on
* Implement grunt to support a pre-compilation step
* Query predictions by pages
* [Dockerize](https://www.docker.com/) the application!

Out of requirements improvements:
* add support for multiple providers
* group the stops by lat/lan
