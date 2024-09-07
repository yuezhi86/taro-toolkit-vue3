<template>
  <div class="agree-text">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import '../../styles/mixins';

.agree-text {
  padding: var(--agree-text-padding, 40rpx);
  color: var(--agree-text-color, #333);
  font-size: var(--agree-text-font-size, 28rpx);
  line-height: var(--agree-text-line-height, 1.7);
  text-align: var(--agree-text-text-align, justify);
  @include text-break;
}
</style>
