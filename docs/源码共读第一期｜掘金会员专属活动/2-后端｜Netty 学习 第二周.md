# 后端｜Netty 学习 第二周

### 本章任务提供

[挖坑的张师傅](https://juejin.cn/user/430664257374270 "https://juejin.cn/user/430664257374270")

### 领读员说

> 大家好，我是张师傅。为了能帮助到更多对源码感兴趣、想学会看源码、提升自己后端技术能力的同学。组织了大家一起学习源码共读活动。
>
> 我对各个中间件源码非常感兴趣，过去一段时间阅读了 MySQL、JVM、Nginx、Netty、Spring、Linux 内核相关的源码，也写过很多关于根据源码来定位问题的文章，详见我的掘金博客 [juejin.cn/user/430664…](https://juejin.cn/user/430664257374270 "https://juejin.cn/user/430664257374270")
>
> 对于 Java 后端的同学，Netty 的源码是非常经典的学习资料，它不仅包含了丰富的网络编程相关的知识，还在代码中展示了很多 Java 编程的高级技巧，是我们深入学习网络编程、理解事件驱动、高性能编程不可多得的经典。

## 任务说明

后端任务在整个源码学习的过程中出现，和前端分离的子任务不同，本篇包含了多个学习任务，除了以学习任务为核心产出的笔记以外，在阅读源码的时候产出的其他笔记也可参与本次活动。

## 学习任务

阅读 NioEventLoopGroup 的代码

> 任务：NioEventLoopGroup 默认的构造函数会起多少线程，可以通过什么方式修改？这些线程的职责是什么

早期 Java 版本 NIO 存在严重的 epoll 空轮询 bug，请查询相关的文章。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c611f49bfd74c03b707a844fc93cc8d~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

> 任务 : 阅读 NioEventLoop.java 的代码，尝试分析 Netty 是如何解决 JDK 中的 epoll 空轮询 BUG 的？

Netty 内部有一个核心的类 ByteToMessageDecoder，它定义了两个累加器 MERGE\_CUMULATOR、COMPOSITE\_CUMULATOR

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e27f06cdb60a42f19d58cc3a098ff63c~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

> 任务 1：分析这两个累加器有什么不同

> 任务2：写一个 LengthFieldBasedFrameDecoder 定长编码的消息拆包类，实现如下格式消息的解码，并按逗号拼接

|Length|Content|
|---|---|
|4 字节|变长|

### 额外任务：零拷贝知识

1. 任务 1：了解什么是零拷贝，C/C++中如何实现零拷贝
2. 任务 2：Java 中如何实现零拷贝
3. 任务 3：netty 是如何实现零拷贝的

[原文地址](https://juejin.cn/book/7169108142868365349/section/7171463783146061862)