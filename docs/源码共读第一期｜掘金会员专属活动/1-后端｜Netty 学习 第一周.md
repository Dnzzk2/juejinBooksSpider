# 后端｜Netty 学习 第一周

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

## 项目介绍

为了不增加额外的复杂度，这个项目采用最简单的 Netty echo server 来做演示。netty 启动以后监听 8888 端口，客户端使用 nc、telent 等可以直接进行连接，发送任意字符会回复任何字符。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddb331defa724df2b3fad3e60e558674~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

连接空闲 10s 以后会断开连接。

## 克隆项目

```bash
git clone https://github.com/arthur-zhang/netty-study.git
```

使用 idea 导入项目，使用 debug 模式启动 `me.ya.study.netty.MyServer`，通过调试源码的方式来学习 netty 源码。

## 源码学习

### Netty 服务端启动服务流程

#### 学习任务一

> backlog 参数有什么作用，请仔细研究这个重要参数。

在 `sun.nio.ch.ServerSocketChannelImpl#bind` 上打断点，看调用堆栈。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bc269ad577448f3a327dc5624389057~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

#### 学习任务二

> 阅读 `ServerBootstrapAcceptor` 类，搞清楚这个类的职责

阅读 `io.netty.bootstrap.ServerBootstrap#init` 查看 Netty 配置服务端启动流程

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d48f58dbff844a3898efb2a8aa4f1ec7~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

### 学习任务三

> 阻塞非阻塞、同步异步的最底层的区别是什么？这里为什么要设置为非阻塞

在 \`io.netty.channel.nio.AbstractNioChannel#AbstractNioChannel 构造函数上打断点，阅读构造函数的调用堆栈

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1307c19787354748a6d2f8841771f8c2~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

#### 学习任务四

> 梳理 Netty 启动服务端的所有流程
>
> 在哪里创建 Channel
>
> 如何初始化 Channel、注册 handler
>
> 如何做端口 bind 触发 active 事件，注册 accept 事件，开始准备接收连接

在 `io.netty.channel.nio.AbstractNioChannel#doBeginRead` 上打断点，查看 Netty 是如何注册 Accept 事件的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/065b66259b524f5ca9c01e8080786f11~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

### Netty 的连接创建是如何进行的

#### 学习任务五

> 任务：分析 `io.netty.channel.nio.NioEventLoop#run`做了哪些事情

在 `io.netty.channel.nio.NioEventLoop#processSelectedKey(java.nio.channels.SelectionKey, io.netty.channel.nio.AbstractNioChannel)` 打断点，然后使用 nc 或者 telnet 连接上 Netty

```yaml
nc localhost 8888
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1ec45c5bad942aaa3b808dadf21a3e1~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

阅读堆栈，溯源调用链路

#### 额外任务

> * 什么是 Reactor 模型
> * Netty 事件循环采用的是什么模式，与 Nginx、redis、muduo 等框架是一样的吗

### Netty 读取、发送数据流程

#### 学习任务六

> 任务：分析 allocator 变量，学习 Netty 中所有的 Allocator
>
> 额外任务：Netty 在 linux 上采用的是边缘触发还是水平触发

在 `io.netty.channel.nio.AbstractNioByteChannel.NioByteUnsafe#read` 上打断点，在 nc 中发送数据

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad94cac133f6470b8093d6158e8d2625~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

#### 学习任务七

> 分析 Netty 发送数据的全流程，画时序图

在 `me.ya.study.netty.handler.MyEchoServerHandler#channelRead` 打断点，跟进 write 方法，同时在 `io.netty.channel.AbstractChannelHandlerContext#write(java.lang.Object, io.netty.channel.ChannelPromise)` 上打断点，分析 Netty 发送数据的全过程。

## 额外任务

### Netty Idle 检测是如何实现的

* 什么是 tcp 的 keep-alive
* 有了 TCP 层面的 keep-alive 为什么还需要应用层 keepalive ?
* Netty 的 Idle 检测是如何实现的，是用 HashedWheelTimer 时间轮吗？

[原文地址](https://juejin.cn/book/7169108142868365349/section/7169476373352808455)