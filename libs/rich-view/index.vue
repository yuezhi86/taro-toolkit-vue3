<template>
  <!-- eslint-disable vue/no-v-html-->
  <view class="rich-text" v-html="data" />
</template>

<script setup lang="ts">
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
.rich-text {
  padding: 32px;
  color: rgba(0, 0, 0, 0.85);
  font-family: $font-family;
  font-size: 28px;
  line-height: 44px;
  font-weight: 400;

  image {
    max-width: 100%;
  }
}
</style>
