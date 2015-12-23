var assert = require('assert');
var Libs = require(__dirname + '/../src/Libs');

describe('GeoHashTable', function()
{
	describe('#constructor()', function() {
		it('should throw an exception with no parameters', function() {
			assert.throws(function() {
				var geoHashTable = new Libs.GeoHashTable();	
			});
		});
		
		it('should throw an exception when precision is undefined', function() {
			assert.throws(function() {
				var geoHashTable = new Libs.GeoHashTable({ haversine: new Libs.Haversine() });
			});
		});

		it('should throw an exception when haversine is undefined', function() {
			assert.throws(function() {
				var geoHashTable = new Libs.GeoHashTable({ precision: 10 });
			});
		});

		it('should throw an exception when precision is < 1', function() {
			assert.throws(function() {
				var geoHashTable = new Libs.GeoHashTable({ precision: 0 });
			});
		});
	});

	describe('#_calculateHash()', function() {
		var geoHashTable;

		beforeEach(function() {
			geoHashTable = new Libs.GeoHashTable({ 
				precision: 8,
				haversine: new Libs.Haversine()
			});
		});

		it('hash of -90,-180 should be equals to 00000000', function() {
			assert.equal(geoHashTable._calculateHash(-90, -180), '00000000');
		});

		it('hash of -90,-180 should be equals to bpbpbpbp', function() {
			assert.equal(geoHashTable._calculateHash(90, -180), 'bpbpbpbp');
		});

		it('hash of -90,-180 should be equals to pbpbpbpb', function() {
			assert.equal(geoHashTable._calculateHash(-90, 180), 'pbpbpbpb');
		});

		it('hash of -90,-180 should be equals to zzzzzzzz', function() {
			assert.equal(geoHashTable._calculateHash(90, 180), 'zzzzzzzz');
		});

		it('hash of -90,-180 should be equals to 7zzzzzzz', function() {
			assert.equal(geoHashTable._calculateHash(0, 0), '7zzzzzzz');
		});

		it('hash of 37.79096,-122.4020799 should be equals to 9q8yyxts', function() {
			assert.equal(geoHashTable._calculateHash(37.79096, -122.4020799), '9q8yyxts');
		});
	});

	describe('#_calculateLatLonError()', function() {
		var geoHashTable;

		beforeEach(function() {
			geoHashTable = new Libs.GeoHashTable({ 
				precision: 8,
				haversine: new Libs.Haversine()
			});
		});

		it('with precision of 8 should be equal to { lat: 0.0000858306884765625, lon: 0.000171661376953125 }', function() {
			assert.deepEqual(geoHashTable._calculateLatLonError(), { lat: 0.0000858306884765625, lon: 0.000171661376953125 });
		});
	});

	describe('#_calculateCellArea()', function() {
		var geoHashTable;

		beforeEach(function() {
			geoHashTable = new Libs.GeoHashTable({ 
				precision: 8,
				haversine: new Libs.Haversine()
			});
		});

		it('with precision of 8, in km, should be equal to { width: 0.03817574843601337, height: 0.01908787421800668 }', function() {
			assert.deepEqual(geoHashTable._calculateCellArea('km'), { width: 0.03817574843601337, height: 0.01908787421800668 });
		});

		it('with precision of 8, in miles, should be equal to { width: 0.023728765312606016, height: 0.011864382656303006 }', function() {
			assert.deepEqual(geoHashTable._calculateCellArea('miles'), { width: 0.023728765312606016, height: 0.011864382656303006 });
		});

		it('with precision of 8, with undefined distance unit, should be equal to { width: NaN, height: NaN }', function() {
			assert.throws(function() {
				var cellArea = geoHashTable._calculateCellArea();
			});
		});

		it('with precision of 8, with unsupported distance unit, should be equal to { width: NaN, height: NaN }', function() {
			assert.throws(function() {
				var cellArea = geoHashTable._calculateCellArea('unsupported');
			});
		});
	});

	describe('#_getAdjacent()', function() {
		var geoHashTable;
		var hash = '9q8yyxts';
		var expected = {
			top: '9q8yyxtt',
			left: '9q8yyxtk',
			right: '9q8yyxtu',
			bottom: '9q8yyxte'
		};

		beforeEach(function() {
			geoHashTable = new Libs.GeoHashTable({ 
				precision: 8,
				haversine: new Libs.Haversine()
			});
		});

		it('with the given hash 9q8yyxts the top cell should be 9q8yyxtt', function() {
			assert.equal(geoHashTable._getAdjacent(hash, 'top'), expected.top);
		});

		it('with the given hash 9q8yyxts the left cell should be 9q8yyxtk', function() {
			assert.equal(geoHashTable._getAdjacent(hash, 'left'), expected.left);
		});

		it('with the given hash 9q8yyxts the right cell should be 9q8yyxtu', function() {
			assert.equal(geoHashTable._getAdjacent(hash, 'right'), expected.right);
		});

		it('with the given hash 9q8yyxts the bottom cell should be 9q8yyxte', function() {
			assert.equal(geoHashTable._getAdjacent(hash, 'bottom'), expected.bottom);
		});
	});

	describe('#add()', function() {
		var geoHashTable;

		beforeEach(function() {
			geoHashTable = new Libs.GeoHashTable({ 
				precision: 8,
				haversine: new Libs.Haversine()
			});
		});

		it('should throw an exception with no parameters', function() {
			assert.throws(function() {
				geoHashTable.add();
			});
		});

		it('should throw an exception when latitude is undefined', function() {
			assert.throws(function() {
				geoHashTable.add({
					lon: 0
				});
			});
		});

		it('should throw an exception when latitude is undefined', function() {
			assert.throws(function() {
				geoHashTable.add({
					lat: 0
				});
			});
		});

		it('should throw an exception when latitude is smaller than -90', function() {
			assert.throws(function() {
				geoHashTable.add({
					lat: -91,
					lon: 0
				});
			});
		});

		it('should throw an exception when latitude is greater than 90', function() {
			assert.throws(function() {
				geoHashTable.add({
					lat: 91,
					lon: 0
				});
			});
		});

		it('should throw an exception when longitude is smaller than -180', function() {
			assert.throws(function() {
				geoHashTable.add({
					lat: 0,
					lon: -181
				});
			});
		});

		it('should throw an exception when longitude is greater than 180', function() {
			assert.throws(function() {
				geoHashTable.add({
					lat: 0,
					lon: 181
				});
			});
		});
	});

	describe('#getData()', function() {
		var geoHashTable;
		var dataset = { '00000000': [ ] };

		beforeEach(function() {
			geoHashTable = new Libs.GeoHashTable({ 
				precision: 8,
				haversine: new Libs.Haversine(),
				data: dataset
			});
		});

		it('should return the given dataset', function() {
			assert.deepEqual(geoHashTable.getData(), dataset);
		});
	});
});
