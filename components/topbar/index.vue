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
import { Navbar as NutNavbar } from '@nutui/nutui-taro';
import Taro from '@tarojs/taro';

defineOptions({
  name: 'Topbar'
});

const props = withDefaults(
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
  if (!props.leftShow) return;
  Taro.navigateBack();
};
</script>

<style lang="scss">
@import '@nutui/nutui-taro/dist/packages/navbar/index.scss';

.topbar {
  --nut-navbar-title-font-color: #fff;
  --nut-navbar-background: rgba(0, 0, 0, 0);
  --nut-navbar-box-shadow: none;
  --nut-navbar-title-font-weight: 600;
  --nut-navbar-title-font: 30rpx;

  .nut-navbar__left {
    left: 12rpx;
    padding-left: 12rpx;
  }

  .nut-navbar--fixed {
    top: 80rpx;
  }
}
</style>
