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
.y-fixed-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 900;
  min-height: 148px;
  background-color: #fff;
  box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);

  &--inner {
    position: relative;
    @include margin-h(40px);
    @include padding-v(26px);
  }
}
</style>
