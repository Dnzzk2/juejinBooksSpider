# 前端｜tdesign-vue 初始化组件

### 本章任务提供

[若川](https://juejin.cn/user/1415826704971918 "https://juejin.cn/user/1415826704971918")

## 学习任务

* github仓库地址 [github.com/Tencent/tde…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FTencent%2Ftdesign-vue%2Fblob%2Fdevelop%2Fscript%2Finit%2Findex.js "https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FTencent%2Ftdesign-vue%2Fblob%2Fdevelop%2Fscript%2Finit%2Findex.js")
* github1s: [github1s.com/Tencent/tde…](https://link.juejin.cn?target=https%3A%2F%2Fgithub1s.com%2FTencent%2Ftdesign-vue%2Fblob%2Fdevelop%2Fscript%2Finit%2Findex.js "https://link.juejin.cn?target=https%3A%2F%2Fgithub1s.com%2FTencent%2Ftdesign-vue%2Fblob%2Fdevelop%2Fscript%2Finit%2Findex.js")
* 克隆源码

```bash
git clone --recurse-submodules https://github.com/Tencent/tdesign-vue.git

cd tdesign-vue
# 开发预览
npm i # 可以用 yarn install yarn 相对更快
复制代码
```

* 主要学习这两个命令。可以查看贡献文档。
* 新增组件： npm run init \[组件名\]
* 删除组件：npm run init \[组件名\] del
* 如果出现克隆时没有权限问题，可以修改 根目录的 .gitmodules 的 url 为 https 的

```ini
[submodule "src/_common"]
	path = src/_common
	url = https://github.com/Tencent/tdesign-common.git
复制代码
```

## 参考文章

[每次新增页面复制粘贴？100多行源码的 element-ui 新增组件功能告诉你减少重复工作](https://juejin.cn/post/7031331765482422280 "https://juejin.cn/post/7031331765482422280")

[原文地址](https://juejin.cn/book/7169108142868365349/section/7169108142893203487)