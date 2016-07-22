var fs = require('fs');
var path = require('path');

var filename = path.join(__dirname, 'package.json');
var package = JSON.parse(fs.readFileSync(filename));
package.main = 'lib/' + package.name + '.js';
package.version = package.version.replace(/-?\d+$/, function(value) {
  return parseInt(value) + 1;
});

fs.writeFileSync(filename, JSON.stringify(package, null, '  '));