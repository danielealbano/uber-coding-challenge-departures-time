"use strict";

/**
 * Haversine (formula) implementation
 * https://en.wikipedia.org/wiki/Haversine_formula
 */ 
class Haversine {
    constructor() {
        this._meanEarthRadius = {
            km: 6371,
            miles: 3960
        };
    }

    /**
     * Convert to radians
     * @private
     **/
    _toRad(num) {
        return num * Math.PI / 180;
    }

    /**
     * Calculate the distance between two points
     **/
    distance(point1, point2, unit) {
        if (
            point1 === undefined ||
            point1.lat === undefined ||
            point1.lon === undefined ||
            point2 === undefined ||
            point2.lat === undefined ||
            point2.lon === undefined) {
            throw new Error('point1 or point2 are missing');
        }

        if (isNaN(point1.lat) ||
            point1.lat < -90 ||
            point1.lat > 90) {
            throw new Error('Invalid point1.latitude, the value must be a number in the range -90, 90');
        }

        if (isNaN(point1.lon) ||
            point1.lon < -180 ||
            point1.lon > 180) {
            throw new Error('Invalid point1.longitude, the value must be a number in the range -180, 180');
        }

        if (isNaN(point2.lat) ||
            point2.lat < -90 ||
            point2.lat > 90) {
            throw new Error('Invalid point2.latitude, the value must be a number in the range -90, 90');
        }

        if (isNaN(point2.lon) ||
            point2.lon < -180 ||
            point2.lon > 180) {
            throw new Error('Invalid point2.longitude, the value must be a number in the range -180, 180');
        }

        if (unit !== 'km' &&
            unit !== 'miles') {
            throw new Error('Invalid unit, the value must be km or miles');
        }

        var dLat = this._toRad(point2.lat - point1.lat);
        var dLon = this._toRad(point2.lon - point1.lon);
        var lat1 = this._toRad(point1.lat);
        var lat2 = this._toRad(point2.lat);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return c * this._meanEarthRadius[unit];
    }
}

module.exports = Haversine;