<template>
  <div class="agree-h1">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.agree-h1 {
  margin-bottom: var(--agree-h1-margin-bottom, 40px);
  color: var(--agree-h1-color, #333);
  font-size: var(--agree-h1-font-size, 36px);
  font-weight: bold;
  line-height: var(--agree-h1-line-height, 1);
  text-align: center;
}
</style>
