'use strict';
/*istanbul ignore next*/

let symbolFilename = Symbol();
let symbolInterval = Symbol();
let symbolOnUpdate = Symbol();
let symbolModifyTime = Symbol();
let symbolConfig = Symbol();

const EventEmitter = require('events');

/*istanbul ignore next*/
module.exports = class RealtimeConfig extends EventEmitter {
  /*<jdists encoding="ejs" data="../package.json">*/
  /**
   * @file <%- name %>
   *
   * <%- description %>
   * @author
       <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
   *   <%- item.name %> (<%- item.url %>)
       <% }); %>
   * @version <%- version %>
       <% var now = new Date() %>
   * @date <%- [
        now.getFullYear(),
        now.getMonth() + 101,
        now.getDate() + 100
      ].join('-').replace(/-1/g, '-') %>
   */
  /*</jdists>*/

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
   * @example RealtimeConfig:option.onerror catch
    ```js
    var filename = 'test/test5.config';
    var fs = require('fs');
    fs.writeFileSync(filename, '#error');
    var obj = new RealtimeConfig(filename);
    // * throw
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
  constructor(filename, options) {
    super();
    options = options || {};
    this[symbolInterval] = options.interval || 60000;
    if (typeof options.onupdate === 'function') {
      this.on('update', options.onupdate);
    }
    if (typeof options.onerror === 'function') {
      this.on('error', options.onerror);
    }
    this[symbolOnUpdate] = options.onupdate;
    this[symbolFilename] = filename;
    this[symbolConfig] = {};

    this.update();
  }

  /**
   * 转换为 JSON 对象
   *
   * @return {Object}
   */
  getJSON() {
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
  toString() {
    return JSON.stringify(this.getJSON());
  }

  /**
   * 定时更新数据
   */
  update() {
    const fs = require('fs');
    let self = this;
    try {
      var stat = fs.statSync(this[symbolFilename]);
      if (this[symbolModifyTime] !== Number(stat.mtime)) {
        let content = String(fs.readFileSync(this[symbolFilename]));
        let config = {};
        if (content.indexOf('module.exports') >= 0) {
          config = new Function(`
var module = {
  exports: {}
};
${content}
return module.exports;`
          )();
        }
        else {
          config = new Function(`
return (
  ${content}
);`
          )();
        }
        this[symbolModifyTime] = Number(stat.mtime);

        // Object.assign(this[symbolConfig], config);
        Object.keys(config).forEach(function (key) {
          self[symbolConfig][key] = config[key];
        });

        Object.keys(self[symbolConfig]).forEach(function (key) {
          Object.defineProperty(self, key, {
            get: function () {
              return self[symbolConfig][key];
            },
            configurable: true
          });

        });
        this.emit('update', config);
      }
    }
    catch (ex) {
      this.emit('error', ex.message);
      console.error('Read config error. %s', ex.message);
    }
    setTimeout(function () {
      self.update();
    }, this[symbolInterval]);
  }
};