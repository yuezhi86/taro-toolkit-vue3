<template>
  <!-- eslint-disable vue/no-v-html-->
  <view class="rich-text" v-html="data" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import Taro from '@tarojs/taro';

defineOptions({
  name: 'RichView'
});

defineProps<{ data?: string }>();

const handleTap = ({ currentTarget: { dataset } }) => {
  const { src } = dataset;
  Taro.previewImage({
    urls: [src]
  });
};

let imageElements = [];

if (Taro.options.html) {
  Taro.options.html.transformElement = (el) => {
    if (el.nodeName === 'image') {
      el.setAttribute('mode', 'widthFix');
      el.setAttribute('data-src', el.props.src);
      el.removeEventListener('tap', handleTap, false);
      el.addEventListener('tap', handleTap, false);
      imageElements.push(el);
    }

    return el;
  };
}

onBeforeUnmount(() => {
  imageElements.forEach((el) => {
    el.removeEventListener('tap', handleTap, false);
  });
});
</script>

<style lang="scss">
@import '../../styles/variable';

.rich-text {
  padding: var(--rich-text-padding, 32rpx);
  color: var(--rich-text-color, rgba(0, 0, 0, 0.85));
  font-family: var(--rich-text-font-family, $font-family);
  font-size: var(--rich-text-font-size, 28rpx);
  line-height: var(--rich-text-line-height, 44rpx);
  font-weight: var(--rich-text-font-weight, 400);

  image {
    max-width: 100%;
  }
}
</style>
