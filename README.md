Real Time Config 实时配置
-------

# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

## 背景

通常配置修改后需要重启进程才生效，重启进程会中断服务，严重时会导致 IO 异常。

### 需求场景

* 标识服务器升级中，停止写入操作；
* 按运营需要调整数值；
* 动态切换连接服务器。

## 使用

### 安装

```bash
$ npm install rtconfig
```

### 示例

```js
var RealtimeConfig = require('rtconfig');

var config = new RealtimeConfig('config/config.js');

app.get('commit', function (req, res) {
	if (config.updating) {
		res.json({
			error: '正在升级，请稍后重试。'
		});
		return;
	}
	// ...
});
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/rtconfig
[npm-image]: https://badge.fury.io/js/rtconfig.svg
[travis-url]: https://travis-ci.org/zswang/rtconfig
[travis-image]: https://travis-ci.org/zswang/rtconfig.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/rtconfig?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/rtconfig/badge.svg?branch=master&service=github
