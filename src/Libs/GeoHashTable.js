"use strict";

/**
 * GeoHashTable implementation
 * https://en.wikipedia.org/wiki/Geohash
 */ 
class GeoHashTable {
    constructor(options) {
        this._decimalToBase32 = null;
        this._characterMap = '0123456789bcdefghjkmnpqrstuvwxyz';
        this._neighbors = null;
        this._borders = null;
        this._data = null;
        this._haversine = null;

        this._data = null;
        this._haversine = null;
        this._precision = null;

        var defaultOptions = {
            precision: null,
            haversine: null
        };

        if (options === undefined) {
            options = { };
        }

        for (var i in defaultOptions) {
            if (options[i] === undefined) {
                options[i] = defaultOptions[i];
            }
        }

        if (options.precision === null) {
            throw new Error('Precision not specified');
        } else if (options.haversine === null) {
            throw new Error('Haversine implementation not passed');
        } else if (options.precision < 1) {
            throw new Error('Precision must be >= 1');
        }

        this._haversine = options.haversine || { };
        this._data = options.data || { };
        this._precision = options.precision || { };
        
        this._initNeighbors();
        this._initBorders();
        this._initDecimalToBase32();
    }

    /**
     * Init the neighbors map
     * @private
     **/
    _initNeighbors() {
        this._neighbors = {
            right:  { even :  'bc01fg45238967deuvhjyznpkmstqrwx' },
            left:   { even :  '238967debc01fg45kmstqrwxuvhjyznp' },
            top:    { even :  'p0r21436x8zb9dcf5h7kjnmqesgutwvy' },
            bottom: { even :  '14365h7k9dcfesgujnmqp0r2twvyx8zb' }
        };

        this._neighbors.bottom.odd  = this._neighbors.left.even;
        this._neighbors.top.odd     = this._neighbors.right.even;
        this._neighbors.left.odd    = this._neighbors.bottom.even;
        this._neighbors.right.odd   = this._neighbors.top.even;
    }

    /**
     * Init the borders map
     * @private
     **/
    _initBorders() {
        this._borders = {
            right:  { even : 'bcfguvyz' },
            left:   { even : '0145hjnp' },
            top:    { even : 'prxz' },
            bottom: { even : '028b' }
        };

        this._borders.bottom.odd    = this._borders.left.even;
        this._borders.top.odd       = this._borders.right.even;
        this._borders.left.odd      = this._borders.bottom.even;
        this._borders.right.odd     = this._borders.top.even;
    }

    /**
     * Init the decimal to base32 map
     * @private
     **/
    _initDecimalToBase32() {
        this._decimalToBase32 = { };
        for (var i = 0; i < this._characterMap.length; i++) {
            this._decimalToBase32[i] = this._characterMap.charAt(i);
        }
    }

    /**
     * Calculate the geohash for the given latitude and longitude
     * @private
     **/
   _calculateHash(lat, lon) {
        var value = 0, hash = '',
            shiftOf = 5,
            isEven = false,
            bitsCount = this._precision * 5,
            latMin = -90.0, latMax = 90.0,
            lonMin = -180.0, lonMax = 180.0;
        for (var i = 0; i < bitsCount; i++) {
            var bit, mid;

            if (isEven) {
                mid = (latMin + latMax) / 2;
                bit = lat > mid ? 1 : 0;

                if (bit) {
                    latMin = mid;
                } else {
                    latMax = mid;
                }
            } else {
                mid = (lonMin + lonMax) / 2;
                bit = lon > mid ? 1 : 0;
                if (bit) {
                    lonMin = mid;
                } else {
                    lonMax = mid;
                }
            }

            shiftOf--;
            value += bit << shiftOf;

            if (shiftOf === 0) {
                hash += this._decimalToBase32[value];
                value = 0;
                shiftOf = 5;
            }

            isEven = !isEven;
        }

        return hash;
    }

    /**
     * Calculate the latitude and longitude rounding error
     * @private
     **/
    _calculateLatLonError() {
        var latBits, lonBits;

        latBits = Math.floor(this._precision * 5 / 2);
        lonBits = Math.ceil(this._precision * 5 / 2);

        var latError = (180 / (2 << latBits));
        var lonError = (360 / (2 << lonBits));

        return {
            lat: latError,
            lon: lonError
        };
    }

    /**
     * Calculate the size of a cell
     * @private
     **/
    _calculateCellArea(unit) {
        var errorArea = this._calculateLatLonError();

        return {
            width: this._haversine.distance(
                { lat: 0, lon: 0 },
                { lat: 0, lon: errorArea.lon * 2 },
                unit),

            height: this._haversine.distance(
                { lat: 0, lon: 0 },
                { lat: errorArea.lat * 2, lon: 0 },
                unit)
        };
    }

    /**
     * Get the adjacent cell for a given hash and direction (top, left, right, bottom)
     * @private
     **/
    _getAdjacent(hash, dir) {
        var char = hash.charAt(hash.length - 1);
        var type = (hash.length % 2) ? 'odd' : 'even';
        var base = hash.substring(0, hash.length - 1);

        if (this._borders[dir][type].indexOf(char) !== -1) {
            base = this._getAdjacent(base, dir);
        }

        return base + this._decimalToBase32[this._neighbors[dir][type].indexOf(char)];
    }

    /**
     * Return the data handled by hashtable
     **/
    getData() {
        return this._data;
    }

    /**
     * Add a point
     **/
    add(point) {
        if (
            point === undefined ||
            point.lat === undefined ||
            point.lon === undefined) {
            throw new Error('Latitude or longitude are missing');
        }

        if (isNaN(point.lat) ||
            point.lat < -90 ||
            point.lat > 90) {
            throw new Error('Invalid latitude, the value must be a number in the range -90, 90');
        }

        if (isNaN(point.lon) ||
            point.lon < -180 ||
            point.lon > 180) {
            throw new Error('Invalid longitude, the value must be a number in the range -180, 180');
        }

        var hash = this._calculateHash(point.lat, point.lon);

        if (this._data[hash] === undefined) {
            this._data[hash] = [ ];
        }

        this._data[hash].push(point);
    }

    /**
     * Get all the points within the range specified in distance in distanceUnit (km or miles) nearby the given latitude and longitude
     **/
    getByDistance(lat, lon, distance, distanceUnit) {
        if (
            lat === undefined ||
            lon === undefined ||
            distance === undefined ||
            distanceUnit === undefined) {
            throw new Error('One or more parameter is missing');
        }

        if (isNaN(lat) ||
            lat < -90 ||
            lat > 90) {
            throw new Error('Invalid latitude, the value must be a number in the range -90, 90');
        }

        if (isNaN(lon) ||
            lon < -180 ||
            lon > 180) {
            throw new Error('Invalid longitude, the value must be a number in the range -180, 180');
        }

        if (isNaN(distance) ||
            distance <= 0) {
            throw new Error('Invalid distance, the value must be a number greater than 0');
        }

        if (distanceUnit !== 'km' &&
            distanceUnit !== 'miles') {
            throw new Error('Invalid distance unit, the value must be km or miles');
        }

        var cellArea = this._calculateCellArea(distanceUnit);

        var widthPerSideCellsCount = Math.floor((distance / cellArea.width) / 2);
        var heightPerSideCellsCount = Math.floor((distance / cellArea.height) / 2);

        var hash = this._calculateHash(lat, lon);

        var points = [ ];

        var addPoints = function(hash) {
            if (this._data[hash] !== undefined) {
                for (var i in this._data[hash]) {
                    points.push(this._data[hash][i]);
                }
            } 
        }.bind(this);

        var loopOverVerticalHashes = function(hash, vDir, offset, count) {
            var cb = function(hDir) {
                var hHash = hDir === 'left' ? hash : this._getAdjacent(hash, hDir),
                    hOffset = hDir === 'left' ? 0 : 1;

                loopOverHorizontalHashes(
                    hHash,
                    hDir,
                    hOffset,
                    widthPerSideCellsCount);
            }.bind(this);

            for (var y = offset; y <= count; y++) {
                [ 'left', 'right' ].forEach(cb);

                hash = this._getAdjacent(hash, vDir);
            }
        }.bind(this);

        var loopOverHorizontalHashes = function(hash, hDir, offset, count) {
            for (var i = offset; i <= count; i++) {
                addPoints(hash);
                hash = this._getAdjacent(hash, hDir);
            }
        }.bind(this);

        var cb = function(vDir) {
            var vHash = vDir === 'top' ? hash : this._getAdjacent(hash, vDir),
                vOffset = vDir === 'top' ? 0 : 1;

            loopOverVerticalHashes(
                vHash,
                vDir,
                vOffset,
                heightPerSideCellsCount);
        }.bind(this);
        [ 'top', 'bottom' ].forEach(cb);

        return points;
    }
}

module.exports = GeoHashTable;
