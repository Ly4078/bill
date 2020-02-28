<template>
  <view class="simple-load-more" @click="_onClick">
    <text :class="{ more: more }" :style="{ color: more ? color[0] : color[1] }"
      >{{ more ? text[0] : text[1] }}
    </text>
  </view>
</template>

<script>
export default {
  name: "SimpleLoadMore",
  props: {
    more: {
      type: Boolean,
      default: false
    },
    text: {
      type: Array,
      default: function() {
        return ["加载更多", "没有更多了"];
      }
    },
    color: {
      type: Array,
      default: function() {
        return ["#488ee9", "#808080"];
      }
    }
  },
  methods: {
    _onClick() {
      if (this.more === false) {
        return;
      }

      this.$emit("loadMore");
    }
  }
};
</script>

<style lang="scss">
$primary: #488ee9;

.simple-load-more {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #808080;

  .more {
    color: $primary;
  }
}
</style>
