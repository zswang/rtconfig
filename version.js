const fs = require('fs')
const path = require('path')
const filename = path.join(__dirname, 'package.json')
const package = JSON.parse(fs.readFileSync(filename))
package.version = package.version.replace(/-?\d+$/, value => {
  return parseInt(value) + 1
})
fs.writeFileSync(filename, JSON.stringify(package, null, '  '))