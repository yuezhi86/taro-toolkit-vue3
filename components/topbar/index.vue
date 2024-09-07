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
      <rect-left :color="fontColor" size="36rpx" style="font-weight: 300" />
    </template>
    <template #content>
      <slot name="title"></slot>
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

withDefaults(
  defineProps<{
    title?: string;
    leftShow?: boolean;
    fontColor?: string;
  }>(),
  {
    title: undefined,
    leftShow: true,
    fontColor: '#fff'
  }
);

const handleBack = () => {
  Taro.navigateBack();
};
</script>

<style lang="scss">
@import '@nutui/nutui-taro/dist/packages/navbar/index.scss';

.topbar {
  --nut-navbar-title-font-color: v-bind(fontColor);
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
