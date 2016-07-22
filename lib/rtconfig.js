'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*istanbul ignore next*/
module.exports = function () {
  /**
   * @file rtconfig
   *
   * A real time updated configuration.
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.0.29
   * @date 2016-07-22
   */
  /**
   * 创建实时配置对象
   *
   * @param{String} filename 文件名
   * @param{Object} options 配置项
   * @param{Number=} options.interval 读取文件周期
   * @param{Function=} options.onupdate 更新时回调
   * @example RealtimeConfig:base
    ```js
    var filename = 'test/test1.config';
    var fs = require('fs');
    fs.writeFileSync(filename, '{host: "127.0.0.1"}');
    var obj = new RealtimeConfig(filename);
    fs.unlinkSync(filename);
    console.log(obj.host);
    // > 127.0.0.1
    ```
   * @example RealtimeConfig:module.exports
    ```js
    var filename = 'test/test2.config';
    var fs = require('fs');
    fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" };');
    var obj = new RealtimeConfig(filename);
    fs.unlinkSync(filename);
    console.log(obj.host);
    // > 127.0.0.1
    ```
   * @example RealtimeConfig:option.onupdate
    ```js
    var filename = 'test/test3.config';
    var fs = require('fs');
    fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" };');
    var obj = new RealtimeConfig(filename, {
      onupdate: function (config) {
        fs.unlinkSync(filename);
        console.log(config.host);
        // > 127.0.0.1
        // * done
      }
    });
    ```
   * @example RealtimeConfig:option.interval
    ```js
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
      console.log(obj.host);
      // > 192.168.0.1
      // * done
    }, 1000);
    ```
   */
  function RealtimeConfig(filename, options) {
    _classCallCheck(this, RealtimeConfig);

    options = options || {};
    this.interval = options.interval || 60000;
    this.onupdate = options.onupdate;
    this.filename = filename;
    this.update();
  }

  _createClass(RealtimeConfig, [{
    key: 'update',
    value: function update() {
      var _this = this;

      var fs = require('fs');
      var self = this;
      try {
        var stat = fs.statSync(this.filename);
        if (this.modifyTime !== Number(stat.mtime)) {
          (function () {
            var content = String(fs.readFileSync(_this.filename));
            var config = {};
            if (content.indexOf('module.exports') >= 0) {
              config = new Function('\nvar module = {\n  exports: {}\n};\n' + content + '\nreturn module.exports;')();
            } else {
              config = new Function('\nreturn (\n  ' + content + '\n);')();
            }
            _this.modifyTime = Number(stat.mtime);
            Object.keys(config).forEach(function (key) {
              Object.defineProperty(self, key, {
                get: function get() {
                  return config[key];
                },
                configurable: true
              });
            });
            if (typeof _this.onupdate === 'function') {
              _this.onupdate(config);
            }
          })();
        }
      } catch (ex) {
        console.error('Read config error. %s', ex.message);
      }
      setTimeout(function () {
        self.update();
      }, this.interval);
    }
  }]);

  return RealtimeConfig;
}();