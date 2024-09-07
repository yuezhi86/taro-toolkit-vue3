<template>
  <view
    class="oss-image"
    :class="{
      'oss-image--error': error,
      'oss-image-loading': loading
    }"
  >
    <image-error v-if="error && !defaultImg" class="oss-image--error-icon" />
    <image
      v-else-if="error && defaultImg"
      class="oss-image--error-img"
      :class="{
        'oss-image--error-img-full': errorImgFull
      }"
      :src="defaultImg"
      mode="aspectFit"
    />
    <image
      v-else
      v-bind="$attrs"
      class="oss-img"
      :style="{
        width,
        height
      }"
      :src="imgSrc"
      :mode="imgMode"
      :webp="webp"
      :lazy-load="lazyLoad"
      :show-menu-by-longpress="showMenuByLongpress"
      @load="onLoad"
      @error="onError"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ImageError } from '@nutui/icons-vue-taro';

defineOptions({
  name: 'OssImage',
  inheritAttrs: false
});

const emit = defineEmits(['load', 'error']);
const props = withDefaults(
  defineProps<{
    src?: string;
    width?: string;
    height?: string;
    mode?: string;
    lazyLoad?: boolean;
    webp?: boolean;
    showMenuByLongpress?: boolean;
    defaultImg?: string;
    rule?: string;
    enableRule?: boolean;
    errorImgFull?: boolean;
  }>(),
  {
    src: undefined,
    width: undefined,
    height: undefined,
    defaultImg: undefined,
    rule: 'resize,m_fixed,h_${h},w_${w}',
    mode: 'aspectFill',
    lazyLoad: true,
    enableRule: true
  }
);

const imgSrc = ref('');
const loading = ref(true);
const error = ref(false);
const imgMode = ref(props.mode);

const setState = () => {
  if (!props.src) {
    error.value = true;
    loading.value = false;
    return;
  }

  if (!props.width || !props.height) {
    imgSrc.value = props.src ?? '';
    return;
  }

  const _rule = props.rule
    .replace(/\${w}/, `${parseInt(props.width)}`)
    .replace(/\${h}/, `${parseInt(props.height)}`);
  imgSrc.value = props.src ? `${props.src}?x-oss-process=image/${_rule}` : '';
};

const onLoad = (e: Event) => {
  if (error.value) return;
  error.value = false;
  loading.value = false;
  emit('load', e);
};
const onError = (e: Event) => {
  if (error.value) return;
  error.value = true;
  loading.value = false;
  emit('error', e);
};

watch(
  () => props.src,
  () => {
    error.value = false;
    loading.value = false;
    setState();
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss">
.oss-image {
  overflow: hidden;
  height: 100%;
  font-size: var(--oss-image-icon-size, 50rpx);

  &--loading {
    background-color: var(--oss-image-bg-color, #f5f5f5);
  }

  &--error {
    position: relative;
    background-color: var(--oss-image-bg-color, #f5f5f5);

    &-icon,
    &-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      height: 100%;
    }

    &-icon {
      color: var(--oss-image-icon-color, #ccc);
      font-size: 1em;
    }

    &-img-full {
      width: 100%;
    }
  }
}

.oss-img {
  display: block;
}
</style>
