<template>
  <div class="agree-text">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.agree-text {
  padding: 40px;
  color: #333;
  font-size: 28px;
  line-height: 1.7;
  text-align: justify;
  @include text-break;
}
</style>
