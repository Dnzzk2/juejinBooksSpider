# 后端｜Netty 学习 第三周

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

Netty 的数据读写是以 ByteBuf 为单位的，它的结构如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eabb3b13370401c93ef1485cc1e20a4~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

任务 1：阅读 ByteBuf 的代码，总结它与 Java NIO 中的 ByteBuffer 有什么区别？

ByteBuf 可以通过扩展底层的数组来实现自动扩展。当缓冲区的容量不足以存储新的数据时，ByteBuf 就会自动扩展底层数组的大小，以便容纳更多的数据

任务 2：Netty 中的 ByteBuf 源码是如何实现自动扩展的，请写出伪代码

任务 3：阅读相关代码，ByteBuf 是线程安全的吗？

任务 4：为什么 ByteBuf 读写需要加锁？

ByteBuf 支持多种内存管理模型，包括堆内内存（heap buffer）、堆外内存（direct buffer）和内存池（pooled buffer）。

任务 5：堆外内存、堆外内存、内存池的优缺点有哪些，分别用在哪些场景

任务 6：下面的分配方式分别对应上面的哪种类型

```ini

ByteBufAllocator allocator = ByteBufAllocator.DEFAULT;
ByteBuf buffer = allocator.heapBuffer();

ByteBufAllocator allocator = ByteBufAllocator.DEFAULT;
ByteBuf buffer = allocator.directBuffer();

ByteBufAllocator allocator = ByteBufAllocator.DEFAULT;
ByteBuf buffer = allocator.pooledBuffer();
```

ByteBuf 的读写操作是非阻塞的，阅读相关代码。

任务 7：非阻塞特性是通过 ByteBuf 的什么原理实现的

[原文地址](https://juejin.cn/book/7169108142868365349/section/7172389086643093537)