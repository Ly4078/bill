# simple loading skeleton

简单的加载骨架

## 安装

```
npm install @buuug7/uniapp-components
```

## 使用

```html
<!-- 单行 -->
<simple-loading-skeleton v-if="isLoading"></simple-loading-skeleton>

<!-- 多行 -->
<view v-if="isLoading">
  <simple-loading-skeleton></simple-loading-skeleton>
  <simple-loading-skeleton></simple-loading-skeleton>
  <simple-loading-skeleton></simple-loading-skeleton>
</view>
```

```javascript
import SimpleLoadingSkeleton from "@buuug7/uniapp-components/lib/simple-loading-skeleton";

export default {
  component: { SimpleLoadingSkeleton },
  data() {
    return {
      isLoading: true
    };
  }
};
```

## 属性

无

## CHANGELOG

- 0.4.0
  - Init
