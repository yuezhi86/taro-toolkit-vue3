<template>
  <nut-navbar
    :left-show="leftShow"
    fixed
    :placeholder="false"
    :title="title"
    z-index="900"
    class="topbar"
    @click-back="handleBack"
  >
    <template #left-show>
      <rect-left color="#fff" size="36rpx" style="font-weight: 300" />
    </template>
    <template #left>
      <slot name="left"></slot>
    </template>
  </nut-navbar>
</template>

<script setup lang="ts">
import { RectLeft } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';

defineOptions({
  name: 'Topbar'
});

withDefaults(
  defineProps<{
    title?: string;
    leftShow?: boolean;
  }>(),
  {
    title: undefined,
    leftShow: true
  }
);

const handleBack = () => {
  Taro.navigateBack();
};
</script>

<style lang="scss">
.topbar {
  --nut-navbar-title-font-color: #fff;
  --nut-navbar-background: rgba(0, 0, 0, 0);
  --nut-navbar-box-shadow: none;
  --nut-navbar-title-font-weight: 600;
  --nut-navbar-title-font: 30px;

  .nut-navbar__left {
    left: 12px;
    padding-left: 12px;
  }

  .nut-navbar--fixed {
    top: 80px;
  }
}
</style>
