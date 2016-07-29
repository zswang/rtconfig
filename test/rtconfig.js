var RealtimeConfig = require('../');


describe("src/rtconfig.js", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("RealtimeConfig:base", function () {
    examplejs_printLines = [];
    var filename = 'test/test1.config';
    var fs = require('fs');
    fs.writeFileSync(filename, '{host: "127.0.0.1"}');
    var obj = new RealtimeConfig(filename);
    fs.unlinkSync(filename);
    examplejs_print(obj.host);
    assert.equal(examplejs_printLines.join("\n"), "127.0.0.1"); examplejs_printLines = [];
  });
          
  it("RealtimeConfig:module.exports", function () {
    examplejs_printLines = [];
    var filename = 'test/test2.config';
    var fs = require('fs');
    fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" };');
    var obj = new RealtimeConfig(filename);
    fs.unlinkSync(filename);
    examplejs_print(obj.host);
    assert.equal(examplejs_printLines.join("\n"), "127.0.0.1"); examplejs_printLines = [];
  });
          
  it("RealtimeConfig:option.onupdate", function (done) {
    examplejs_printLines = [];
    var filename = 'test/test3.config';
    var fs = require('fs');
    fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" };');
    var obj = new RealtimeConfig(filename, {
      onupdate: function (config) {
        fs.unlinkSync(filename);
        examplejs_print(config.host);
        assert.equal(examplejs_printLines.join("\n"), "127.0.0.1"); examplejs_printLines = [];
        done();
      }
    });
  });
          
  it("RealtimeConfig:option.interval", function (done) {
    examplejs_printLines = [];
    var filename = 'test/test4.config';
    var fs = require('fs');
    fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" };');
    var obj = new RealtimeConfig(filename, {
      interval: 500
    });
    setTimeout(function () {
      fs.writeFileSync(filename, 'module.exports = { host: "192.168.0.1" };');
    }, 10);
    setTimeout(function () {
      fs.unlinkSync(filename);
      examplejs_print(obj.host);
      assert.equal(examplejs_printLines.join("\n"), "192.168.0.1"); examplejs_printLines = [];
      done();
    }, 1000);
  });
          
  it("RealtimeConfig:toString()", function () {
    examplejs_printLines = [];
    var filename = 'test/test2-1.config';
    var fs = require('fs');
    fs.writeFileSync(filename, '{host: "127.0.0.1", port: 3309}');
    var obj = new RealtimeConfig(filename);
    fs.unlinkSync(filename);
    examplejs_print(obj.toString());
    assert.equal(examplejs_printLines.join("\n"), "{\"host\":\"127.0.0.1\",\"port\":3309}"); examplejs_printLines = [];
  });
          
});
         