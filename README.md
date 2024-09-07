## 编译配置

引用组件时，必须添加以下配置

```ts
// config/index.ts 配置片段
const config = {
  designWidth(input) {
    const fileName = input?.file?.replace(/\\+/g, '/');
    if (
      fileName.indexOf('@nutui') > -1 ||
      fileName.indexOf('taro-toolkit-vue3') > -1
    ) {
      return 375;
    }

    return 750;
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`
  }
};
```

## 文件目录

- components
- helper
- styles
- types
- utils

## 组件开发注意事项

- 样式单位 _1倍_ 像素必须使用 `px`
- 样式单位 _2倍_ 像素必须使用 `rpx`
