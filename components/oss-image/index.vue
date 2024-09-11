<template>
  <view
    :id="'img' + id"
    ref="imgRef"
    class="oss-image"
    :class="{
      'oss-image--error': error,
      'oss-image--loading': loading
    }"
  >
    <view v-if="loading" class="oss-image--loading-content">
      <loading1
        class="nut-icon-am-rotate nut-icon-am-infinite oss-image--loading-icon"
      />
    </view>
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
      v-else-if="firstLoad"
      v-bind="$attrs"
      class="oss-img"
      :style="{
        width,
        height
      }"
      :src="imgSrc"
      :mode="imgMode"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      @load="onLoad"
      @error="onError"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Taro from '@tarojs/taro';
import { ImageError, Loading1 } from '@nutui/icons-vue-taro';
import { randomStr } from '../../utils';

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
    webp?: boolean;
    showMenuByLongpress?: boolean;
    defaultImg?: string;
    iconColor?: string;
    iconSize?: string;
    loadingColor?: string;
    loadingSize?: string;
    lazyLoad?: boolean;
    rule?: string;
    enableRule?: boolean;
    errorImgFull?: boolean;
  }>(),
  {
    src: undefined,
    width: undefined,
    height: undefined,
    defaultImg: undefined,
    iconColor: '#ccc',
    iconSize: '50rpx',
    loadingColor: '#ccc',
    loadingSize: '40rpx',
    rule: 'resize,m_fixed,h_${h},w_${w}',
    mode: 'aspectFill',
    lazyLoad: true,
    enableRule: true
  }
);

const id = ref(randomStr(10));
const imgRef = ref<any>(null);
const url = ref('');
const imgSrc = ref('');
const firstLoad = ref(false);
const loading = ref(false);
const error = ref(false);
const imgMode = ref(props.mode);

const isShow = ref(false);
const setSrc = () => {
  if (!props.src) {
    url.value = '';
    error.value = true;
    loading.value = false;
    firstLoad.value = true;
    return;
  }

  if (!props.enableRule || !props.width || !props.height) {
    url.value = props.src;
  } else {
    const rule = props.rule
      .replace(/\${w}/, `${parseInt(props.width)}`)
      .replace(/\${h}/, `${parseInt(props.height)}`);
    url.value = `${props.src}?x-oss-process=image/${rule}`;
  }

  if (!props.lazyLoad || firstLoad.value || !isShow.value) {
    imgSrc.value = url.value;
    loading.value = !!imgSrc.value;
    firstLoad.value = true;
  }
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
    loading.value = true;
    setSrc();
  },
  {
    immediate: true
  }
);

let inst: any = Taro.createIntersectionObserver(imgRef.value);

Taro.useDidShow(() => {
  isShow.value = true;
});
Taro.useDidHide(() => {
  isShow.value = false;
});
onMounted(() => {
  if (!props.lazyLoad || firstLoad.value) return;
  Taro.nextTick(() => {
    inst.relativeToViewport({ bottom: 100 }).observe(`#img${id.value}`, () => {
      if (firstLoad.value) return;
      imgSrc.value = url.value;
      loading.value = !!imgSrc.value;
      firstLoad.value = true;
    });
  });
});
onUnmounted(() => {
  inst.disconnect();
  inst = null;
});
</script>

<style lang="scss">
.oss-image {
  overflow: hidden;
  height: 100%;

  &--loading {
    position: relative;
    background-color: #f5f5f5;

    &-content {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-icon {
      color: v-bind(loadingColor);
      font-size: v-bind(loadingSize);
    }
  }

  &--error {
    position: relative;
    z-index: 2;
    background-color: #f5f5f5;

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
      color: v-bind(iconColor);
      font-size: v-bind(iconSize);
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
