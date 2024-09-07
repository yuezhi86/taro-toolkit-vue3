<template>
  <div class="agree-h2">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.agree-h2 {
  color: var(--agree-h2-color, #333);
  font-size: var(--agree-h2-font-size, 28rpx);
  font-weight: bold;
}
</style>
