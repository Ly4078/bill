<template>
  <view>
    <view class="tabs">
      <view
        v-for="(item, index) in items"
        class="tab-item"
        :key="index"
        @click="_onClick(index)"
        :class="{ active: index === current }"
      >
        {{ item }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "tab",
  props: {
    current: {
      type: Number,
      default: 0
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    _onClick(index) {
      if (this.current !== index) {
        this.$emit("clickItem", index);
      }
    }
  }
};
</script>

<style lang="scss">
$active-color: #488ee9;

view {
  font-size: 16px;
}

.tabs {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 0;
  background-color: #fff;

  .tab-item {
    padding: 5px 0;
    font-size: 16px;
    flex: 1;
    text-align: center;
    box-sizing: border-box;

    &.active {
      color: $active-color;
      border-bottom: 2px solid $active-color;
    }
  }
}
</style>
