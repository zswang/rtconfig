'use strict';
/*istanbul ignore next*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var symbolFilename = Symbol();
var symbolInterval = Symbol();
var symbolOnUpdate = Symbol();
var symbolModifyTime = Symbol();
var symbolConfig = Symbol();
var EventEmitter = require('events');
/*istanbul ignore next*/
module.exports = function (_EventEmitter) {
  _inherits(RealtimeConfig, _EventEmitter);

  /**
   * @file rtconfig
   *
   * A real time updated configuration.
   * @author
   *   zswang (http://weibo.com/zswang)
   * @version 0.1.6
   * @date 2016-08-05
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
   * @example RealtimeConfig:option.onerror
    ```js
    var filename = 'test/test5.config';
    var fs = require('fs');
    fs.writeFileSync(filename, '#error');
    var obj = new RealtimeConfig(filename, {
      onerror: function (error) {
        fs.unlinkSync(filename);
        console.log(error);
        // > Unexpected token ILLEGAL
        // * done
      }
    });
    ```
   */
  function RealtimeConfig(filename, options) {
    _classCallCheck(this, RealtimeConfig);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RealtimeConfig).call(this));

    options = options || {};
    _this[symbolInterval] = options.interval || 60000;
    if (typeof options.onupdate === 'function') {
      _this.on('update', options.onupdate);
    }
    if (typeof options.onerror === 'function') {
      _this.on('error', options.onerror);
    }
    _this[symbolOnUpdate] = options.onupdate;
    _this[symbolFilename] = filename;
    _this[symbolConfig] = {};
    _this.update();
    return _this;
  }
  /**
   * 转换为 JSON 对象
   *
   * @return {Object}
   */


  _createClass(RealtimeConfig, [{
    key: 'getJSON',
    value: function getJSON() {
      return this[symbolConfig];
    }
    /**
     * 转为字符串
     *
     * @return {String}
     * @example RealtimeConfig:toString()
      ```js
      var filename = 'test/test2-1.config';
      var fs = require('fs');
      fs.writeFileSync(filename, '{host: "127.0.0.1", port: 3309}');
      var obj = new RealtimeConfig(filename);
      fs.unlinkSync(filename);
      console.log(obj.toString());
      // > {"host":"127.0.0.1","port":3309}
      ```
     */

  }, {
    key: 'toString',
    value: function toString() {
      return JSON.stringify(this.getJSON());
    }
    /**
     * 定时更新数据
     */

  }, {
    key: 'update',
    value: function update() {
      var fs = require('fs');
      var self = this;
      try {
        var stat = fs.statSync(this[symbolFilename]);
        if (this[symbolModifyTime] !== Number(stat.mtime)) {
          var content = String(fs.readFileSync(this[symbolFilename]));
          var config = {};
          if (content.indexOf('module.exports') >= 0) {
            config = new Function('\nvar module = {\n  exports: {}\n};\n' + content + '\nreturn module.exports;')();
          } else {
            config = new Function('\nreturn (\n  ' + content + '\n);')();
          }
          this[symbolModifyTime] = Number(stat.mtime);
          Object.assign(this[symbolConfig], config);
          Object.keys(self[symbolConfig]).forEach(function (key) {
            Object.defineProperty(self, key, {
              get: function get() {
                return self[symbolConfig][key];
              },
              configurable: true
            });
          });
          this.emit('update', config);
        }
      } catch (ex) {
        this.emit('error', ex.message);
        console.error('Read config error. %s', ex.message);
      }
      setTimeout(function () {
        self.update();
      }, this[symbolInterval]);
    }
  }]);

  return RealtimeConfig;
}(EventEmitter);