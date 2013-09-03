doc-httpd
=========

>一个简单的markdown标签文档系统的web服务器，支持JavaScript代码高亮显示。
>
>默认监听端口 8000
>
>markdown文件后缀为 `.md`
>
>默认文档为 `index.md`

##TODO

- 文档结构图的样式美化
- 显示文档作者/svn信息
- 显示文档修改记录
- 可视化编辑（或者浏览器插件）

##使用

1.下载代码后，先下载依赖包

	npm install


2.需要将server.js中的 `DOCUMENT_ROOT` 改成本地文档目录

	// set your document root
	var DOCUMENT_ROOT = '../doc_svn';

3.运行

	node server.js

