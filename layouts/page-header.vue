<template>
  <div class="page-header" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  height?: Numberish;
  minHeight?: Numberish;
}>();
const style = computed(() => {
  if (props.minHeight) {
    return {
      minHeight: props.minHeight
    };
  }

  return {
    height: props.height
  };
});
</script>

<style lang="scss">
.page-header {
  overflow: hidden;
  position: relative;
  padding-bottom: 32px;
  background-color: var(--page-header-bg-color, $color-primary);

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 32px;
    background-color: var(--page-header-border-color, #fff);
    border-radius: 22px 22px 0 0;
    content: '';
  }
}
</style>
