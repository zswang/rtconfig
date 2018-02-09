
const { RealtimeConfig } = require('../')
      

describe("src/index.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("RealtimeConfig:base", function () {
    examplejs_printLines = [];
    var filename = './test/config/test1.json'
    var obj = new RealtimeConfig(filename)
    examplejs_print(obj.host)
    assert.equal(examplejs_printLines.join("\n"), "127.0.0.1"); examplejs_printLines = [];
  });
          
  it("RealtimeConfig:module.exports", function () {
    examplejs_printLines = [];
    var filename = './test/config/test2.js'
    var obj = new RealtimeConfig(filename)
    examplejs_print(obj.host)
    assert.equal(examplejs_printLines.join("\n"), "127.0.0.1"); examplejs_printLines = [];
  });
          
  it("RealtimeConfig:yaml", function () {
    examplejs_printLines = [];
    var filename = './test/config/test1.yaml'
    var obj = new RealtimeConfig(filename)
    examplejs_print(obj.host)
    assert.equal(examplejs_printLines.join("\n"), "192.168.0.101"); examplejs_printLines = [];
  });
          
  it("RealtimeConfig:option.onupdate", function (done) {
    examplejs_printLines = [];
    var filename = './test/config/test3.js'
    var fs = require('fs')
    fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" }')
    var obj = new RealtimeConfig(filename, {
      onupdate: function (config) {
        fs.unlinkSync(filename)
        examplejs_print(config.host)
        assert.equal(examplejs_printLines.join("\n"), "127.0.0.1"); examplejs_printLines = [];
        done();
      }
    })
  });
          
  it("RealtimeConfig:option.interval", function (done) {
    examplejs_printLines = [];
    var filename = './test/config/test4.js'
    var fs = require('fs')
    fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" }')
    var obj = new RealtimeConfig(filename, {
      interval: 500
    })
    setTimeout(function () {
      fs.writeFileSync(filename, 'module.exports = { host: "192.168.0.1" }')
    }, 10)
    setTimeout(function () {
      fs.unlinkSync(filename)
    }, 1200)
    setTimeout(function () {
      examplejs_print(obj.host)
      assert.equal(examplejs_printLines.join("\n"), "192.168.0.1"); examplejs_printLines = [];
      done();
    }, 1000)
  });
          
  it("RealtimeConfig:option.onerror catch", function () {
    examplejs_printLines = [];

    (function() {
    var filename = './test/config/test5.js'
    var fs = require('fs')
    fs.writeFileSync(filename, '#error')
    var obj = new RealtimeConfig(filename)
    // * throw
    }).should.throw();
  });
          
  it("RealtimeConfig:option.onerror", function (done) {
    examplejs_printLines = [];
    var filename = './test/config/test5.js'
    var fs = require('fs')
    fs.writeFileSync(filename, '#error')
    new RealtimeConfig(filename, {
      debug: true,
      onerror: function (error) {
        examplejs_print(error)
        assert.equal(examplejs_printLines.join("\n"), "Invalid or unexpected token"); examplejs_printLines = [];
        done();
      }
    })
    new RealtimeConfig(filename, {
      onerror: function (error) {}
    })
    setTimeout(function () {
      fs.unlinkSync(filename)
    }, 1000)
  });
          
  it("RealtimeConfig:toString()", function () {
    examplejs_printLines = [];
    var filename = './test/config/test2-1.config'
    var fs = require('fs')
    fs.writeFileSync(filename, '{host: "127.0.0.1", port: 3309}')
    var obj = new RealtimeConfig(filename)
    fs.unlinkSync(filename)
    examplejs_print(obj.toString())
    assert.equal(examplejs_printLines.join("\n"), "{\"host\":\"127.0.0.1\",\"port\":3309}"); examplejs_printLines = [];
  });
          
});
         