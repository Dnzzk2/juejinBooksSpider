# 后端｜Netty 学习 第四周

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

Netty Recycler 是 Netty 中的对象回收池，用于复用对象，减少内存分配和 GC 的次数。它通过使用双向链表维护对象池，在对象被回收时将其插入链表的头部，在对象需要被分配时从链表的头部取出。这样可以减少内存分配的次数，提高系统的效率。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b59100eb73914c4095f4b22211127c69~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

任务 1：用 Recycler 写一个 demo 实现自定义类 User 的对象复用

任务 2：阅读 Recycler 轻量级对象池的源码，画出 Recycler 的内部结构图

FastThreadLocal 是 Netty 中的快速线程局部变量工具，在高并发场景下表现优异。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fa252b8824b42418a10d29da149ad28~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

FastThreadLocal 是 Netty 重新设计的更快的 ThreadLocal，主要实现涉及：

* FastThreadLocalThread
* FastThreadLocal
* InternalThreadLocalMap

阅读相关类的代码：

任务 3：分析 FastThreadLocal 的创建过程

任务 4：分析 FastThreadLocal 的 get、set 方法实现

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef5758553c0e48b5822a1103f890abff~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e3630797bcf4f84ba6093c7e3bcc80b~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

任务 5：分析 FastThreadLocal 为什么会比 Java 中的 ThreadLocal 性能更加优秀？

任务 6：分析 FastThreadLocal 在了 Netty 的哪些场景比较适用

[原文地址](https://juejin.cn/book/7169108142868365349/section/7176118503878393916)