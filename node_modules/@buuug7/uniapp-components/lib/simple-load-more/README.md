# simple load more

简单的加载更多

## 安装

```
npm install @buuug7/uniapp-components
```

## 使用

```html
<simple-load-more :more="haveMoreArticle" @loadMore="handleLoadMore">
</simple-load-more>
```

```javascript
import SimpleLoadMore from "@buuug7/uniapp-components/lib/simple-load-more";

export default {
  component: { SimpleLoadMore },
  data() {
    return {
      haveMoreArticle: false
    };
  },
  methods: {
    handleLoadMore() {
      // do some
      // and then
      // this.haveMoreArticle = true | false
    }
  }
};
```

## 属性

- `more` 类型 `Boolean`，是否有更多
- `text` 类型 `Array`，自定义显示的文字，例如`:text=['More', 'No More']`，请注意顺序
- `color` 类型`Array`，自定义显示的颜色，例如`:color=['red', '#f8f8f8']`，请注意顺序
- `@loadMore` 类型`function`, 监听点击事件

## CHANGELOG

- 0.3.0
  - Init
