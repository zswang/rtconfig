/// <reference types="node" />
import * as EventEmitter from 'events';
export interface IRealtimeConfigOptions {
    interval?: number;
    onupdate?: (...args: any[]) => void;
    onerror?: (...args: any[]) => void;
    modifyTime?: number;
    filename?: string;
    debug?: boolean;
}
export declare class RealtimeConfig extends EventEmitter {
    /**
     * @file rtconfig
     *
     * A real time updated configuration.
     * @author
     *   zswang (http://weibo.com/zswang)
     * @version 1.0.0
     * @date 2018-02-09
     */
    /**
     * 创建实时配置对象
     *
     * @param filename 文件名
     * @param options 配置项
     * @example RealtimeConfig:base
      ```js
      var filename = './test/config/test1.json'
      var obj = new RealtimeConfig(filename)
      console.log(obj.host)
      // > 127.0.0.1
      ```
     * @example RealtimeConfig:module.exports
      ```js
      var filename = './test/config/test2.js'
      var obj = new RealtimeConfig(filename)
      console.log(obj.host)
      // > 127.0.0.1
      ```
     * @example RealtimeConfig:yaml
      ```js
      var filename = './test/config/test1.yaml'
      var obj = new RealtimeConfig(filename)
      console.log(obj.host)
      // > 192.168.0.101
      ```
     * @example RealtimeConfig:option.onupdate
      ```js
      var filename = './test/config/test3.js'
      var fs = require('fs')
      fs.writeFileSync(filename, 'module.exports = { host: "127.0.0.1" }')
      var obj = new RealtimeConfig(filename, {
        onupdate: function (config) {
          fs.unlinkSync(filename)
          console.log(config.host)
          // > 127.0.0.1
          // * done
        }
      })
      ```
     * @example RealtimeConfig:option.interval
      ```js
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
        console.log(obj.host)
        // > 192.168.0.1
        // * done
      }, 1000)
      ```
     * @example RealtimeConfig:option.onerror catch
      ```js
      var filename = './test/config/test5.js'
      var fs = require('fs')
      fs.writeFileSync(filename, '#error')
      var obj = new RealtimeConfig(filename)
      // * throw
      ```
     * @example RealtimeConfig:option.onerror
      ```js
      var filename = './test/config/test5.js'
      var fs = require('fs')
      fs.writeFileSync(filename, '#error')
      new RealtimeConfig(filename, {
        debug: true,
        onerror: function (error) {
          console.log(['Unexpected token ILLEGAL', 'Invalid or unexpected token'].indexOf(error) >= 0)
          // > true
          // * done
        }
      })
      new RealtimeConfig(filename, {
        onerror: function (error) {}
      })
      setTimeout(function () {
        fs.unlinkSync(filename)
      }, 1000)
      ```
     */
    constructor(filename: string, options?: IRealtimeConfigOptions);
    /**
     * 转换为 JSON 对象
     *
     * @return {Object}
     */
    getJSON(): any;
    /**
     * 转为字符串
     *
     * @return {String}
     * @example RealtimeConfig:toString()
      ```js
      var filename = './test/config/test2-1.config'
      var fs = require('fs')
      fs.writeFileSync(filename, '{host: "127.0.0.1", port: 3309}')
      var obj = new RealtimeConfig(filename)
      fs.unlinkSync(filename)
      console.log(obj.toString())
      // > {"host":"127.0.0.1","port":3309}
      ```
     */
    toString(): string;
    /**
     * 定时更新数据
     */
    update(): void;
}
