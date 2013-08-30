doc-httpd
=========

>文档系统webserver
>
>默认监听端口 8000
>
>markdown文件后缀为 `.md`
>
>默认文档为 	`index.md`

##TODO

- 自动读取列表页文档
- 文档结构图的样式美化
- 显示文档作者/svn信息
- 显示文档修改记录
- 可视化编辑

##使用

1.下载代码后，先下载依赖包

	npm install


2.需要将server.js中的 `DOCUMENT_ROOT` 改成本地文档目录

	// set your document root
	var DOCUMENT_ROOT = '../doc_svn';

3.运行

	node server.js

