<template>
  <div class="details-header">
    <page-header v-if="showBanner" v-bind="$attrs">
      <slot name="banner"></slot>
    </page-header>
    <div class="details-title">
      <slot name="title"></slot>
    </div>
    <div class="details-attrs">
      <div class="details-attrs__left"><slot name="attrs-left"></slot></div>
      <div class="details-attrs__right"><slot name="attrs-right"></slot></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ showBanner?: boolean }>();
defineOptions({
  inheritAttrs: false
});
</script>

<style lang="scss">
.details {
  &-header {
    margin-bottom: 28px;
  }

  &-title {
    padding: 16px 32px 24px;
    font-family: $font-family;
    font-weight: 500;
    font-size: 42px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 58px;
  }

  &-attrs {
    display: flex;
    padding: 0 32px;
    justify-content: space-between;
    font-family: $font-family;
    font-weight: 400;
    font-size: 28px;
    color: rgba(0, 0, 0, 0.25);
    line-height: 40px;

    &__left {
      display: flex;
      align-items: center;
    }

    &__right {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
