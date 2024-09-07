<template>
  <view class="y-fixed-bar">
    <slot name="before"></slot>

    <view class="y-fixed-bar--inner">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
defineOptions({
  name: 'FixedBar'
});
</script>

<style lang="scss">
@import '../../styles/mixins';

.y-fixed-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--fixed-bar-z-index, 900);
  min-height: var(--fixed-bar-min-height, 148rpx);
  background-color: var(--fixed-bar-bg-color, #fff);
  box-shadow: 0 -4rpx 8rpx 0 rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);

  &--inner {
    position: relative;
    @include margin-h(var(--fixed-bar-inner-margin, 40rpx));
    @include padding-v(var(--fixed-bar-inner-padding, 26rpx));
  }
}
</style>
