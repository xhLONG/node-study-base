# Node.js基础

简介

```
node本身是基于CommonJs规范设计的，所以node是模块的组成
内置模块：node天生提供给js调取
三方模块：别人写好的，我们可以基于npm安装使用
自定义模块：自己创建一些模块

CommonJS模块化设计的思想（AMD/CMD/ES6 module）都是模块设计思想
1.CommonJS规定，每一个JS都是一个单独的模块（模块是私有的：里面涉及的值和函数、变量都是私有的，和其他JS文件中的内容是不冲突的）
2.CommonJS允许模块之中的方法互相的调用
```

npm基础命令

```
npm init （初始化包管理）
npm install 包名 -g(全局安装)
npm install 包名 --save-dev(安装运行依赖)
npm install 包名 --dev(安装开发依赖)
npm uninstall 包名 （卸载）
npm list  (列举依赖包)
npm info 包名  （详细信息）
npm install 包名@版本  （安装指定版本）
npm outdated  (检查包是否已经过时)

"dependencies": {
    "axios": "^0.27.2",	^锁定大版本
}
"dependencies": {
    "axios": "～0.27.2",	～锁定前两版本
}
"dependencies": {
    "axios": "*",	安装最新版
}
```

获取当前源

```
npm config get registry
```

切换淘宝源

```
npm config set registry https://registry.npm .taobao.org
```

使用nrm管理多个源

```
npm i nrm -g
```

Nodemon持续监听js文件，响应变化

```
npm i -g nodemon
```

