# egg mock util

将 egg 插件变为 midway 组件的工具包，包含两个方法。

使用方式如下，比如在 configuration 里，由于 egg 的目录是固定的，所以使用文件加载的形式直接执行即可。

```ts
import { completeAssign, createMockApp } from '@midwayjs/mw-util';

export class AutConfiguration {
  @App()
  app;

  async onReady() {
    // 创建一个 egg 认识的模拟 app
    const mockApp = createMockApp(this.app);
    // 执行 egg 的 app.js 中的方法
    require('@ali/egg-********/app')(mockApp);

    // 可选：将 egg 赋到 app 上的对象拿到，比如赋给 midway 的 app
    this.app.changefree = mockApp.changefree;

    // 用于合并 egg 的 context 方法，这样就有 ctx.xxx 方法了
    completeAssign(
      this.app.context,
      require('@ali/egg--********//app/extend/context')
    );
  }
}
```