var collate = require('../'),
    assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    _templateComparison;

describe('renaming behaviour', function() {
    before(function(done) {
        fs.readFile(path.resolve(__dirname, '_collated/_templates_renamed.js'), 'utf8', function(err, data) {
            _templateComparison = data;
            done(err);
        });
    });
    
    it('can collate files', function(done) {
        collate(null, __filename, '_templates', 'cows', function(err, output) {
            assert.equal(output, _templateComparison);
            done();
        });
    });
});