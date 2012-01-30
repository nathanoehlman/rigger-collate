var fs = require('fs'),
    path = require('path'),
    findit = require('findit'),
    seq = require('seq'),
    reStripExt = /(.*)\..*$/;
    
function _makeJS(collated, varName) {
    var lines = [];
        
    // ensure we have a varname
    varName = varName || 'collated';
    if (varName[0] !== '_') {
        varName = '_' + varName;
    }
    
    Object.keys(collated).forEach(function(key) {
        lines.push('  \'' + key + '\': \'' + collated[key] + '\'');
    });
    
    return 'var ' + varName + ' = {\n' + lines.join(',\n') + '\n};\n';
};

exports = module.exports = function(targetPath, callback) {
    var finder = findit.find(targetPath),
        files = [],
        collated = {};
        
    function readFile(filename, index) {
        var stack = this;
        
        fs.readFile(filename, 'utf8', function(err, data) {
            var itemName = filename.slice(targetPath.length + 1).replace(reStripExt, '$1');
            
            if (err) {
                throw err;
            }
            else {
                // remove line breaks from the string
                collated[itemName] = data.replace(/[\n\r]/g, '');
                stack.ok();
            }
        });
    }
    
    finder.on('file', function(file, stat) {
        files.push(file);
    });
    
    finder.on('end', function() {
        seq(files).parEach(readFile).seq(function() {
            callback(null, _makeJS(collated, path.basename(targetPath)));
        });
        
    });
};