"use strict";

var sax = require('sax');

var Request = require('./Request.js');

/**
 * NextbusXmlRequest implementation
 * @extends Request
 */ 
class NextbusXmlRequest extends Request {
    constructor(options) {
        super(options);

        this._parser = null;

        this._initParser();
    }

    /**
     * Init the sax parser
     * @private
     **/
    _initParser() {
        this._parser = sax.createStream(true, { 
            trim: true, 
            normalize: true
        });

        this._parser.on('error', function (e) {
            console.error('error!', e);
            this._parser.error = null;
            this._parser.resume();
        }.bind(this));
    }

    /**
     * Init the error
     * @protected
     * @override
     **/
    _initError() {
        super._initError();

        this._error.shouldRetry = null;
    }

    /**
     * Handle sax parser text event
     * @private
     **/
    _parserOnText(text, cb) {
        if (super._isAborted()) {
            return;
        }

        if (this._hasError()) {
            this._error.text = text;

            return;
        }

        cb({ name: 'text', data: text });
    }

    /**
     * Handle sax parser opentag event
     * @private
     **/
    _parserOnOpenTag(tag, cb) {
        if (super._isAborted()) {
            return;
        }

        if (tag.name === 'Error') {
            this._initError();
            this._error.shouldRetry = tag.attributes.shouldRetry;

            return;
        }

        cb({ name: 'opentag', data: tag });
    }

    /**
     * Handle sax parser onclose event
     * @private
     **/
    _parserOnCloseTag(name, cb) {
        if (super._isAborted()) {
            return;
        }

        if (this._hasError()) {
            super._abort();
            cb({ name: 'error', data: this._error });

            return;
        }
        
        cb({ name: 'closetag', data: name });
    }

    /**
     * Query a given url
     * @override
     **/
    query(qs, cb) {
        this._parser.on('text', function(text) {
            this._parserOnText(text, cb);
        }.bind(this));

        this._parser.on('opentag', function(tag) {
            this._parserOnOpenTag(tag, cb);
        }.bind(this));

        this._parser.on('closetag', function(name) {
            this._parserOnCloseTag(name, cb);
        }.bind(this));

        return super.query(qs, cb)
            .pipe(this._parser);
    }
}

module.exports = NextbusXmlRequest;
