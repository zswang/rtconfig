/*istanbul ignore next*/
module.exports = class RealtimeConfig {
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
   */
  constructor(filename, options) {
    options = options || {};
    this.interval = options.interval || 60000;
    this.onupdate = options.onupdate;
    this.filename = filename;

    this.update();
  }

  update() {
    const fs = require('fs');
    let self = this;
    try {
      var stat = fs.statSync(this.filename);
      if (this.modifyTime !== Number(stat.mtime)) {
        let content = String(fs.readFileSync(this.filename));
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
        this.modifyTime = Number(stat.mtime);

        Object.keys(config).forEach(function (key) {
          Object.defineProperty(self, key, {
            get: function () {
              return config[key];
            },
            configurable: true
          });

        });

        if (typeof this.onupdate === 'function') {
          this.onupdate(config);
        }
      }
    }
    catch (ex) {
      console.error('Read config error. %s', ex.message);
    }
    setTimeout(function () {
      self.update();
    }, this.interval);
  }
};