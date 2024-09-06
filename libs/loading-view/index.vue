<template>
  <view class="loading-view">
    <view
      v-if="loading"
      class="loading-view__loading"
      :class="[`loading-view__loading__align-${position}`]"
    >
      <loading v-if="showIcon" :scale="scale" />
      <text v-if="text" class="loading-view__text">{{ text }}</text>
    </view>
    <slot v-if="!loadingHideContent || !loading"></slot>
    <slot name="outer"></slot>
  </view>
</template>

<script setup lang="ts">
import Loading from '../loading/index.vue';
import { PropType } from 'vue';

defineOptions({
  name: 'LoadingView'
});

defineProps({
  loading: Boolean,
  loadingHideContent: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: '正在加载...'
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  scale: {
    type: Number,
    default: 1
  },
  position: {
    type: String as PropType<'default' | 'middle'>,
    default: 'default'
  }
});
</script>

<style lang="scss">
.loading-view {
  position: relative;
  width: 100%;
  height: 100%;

  &__loading {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $color-primary;
    text-align: center;

    &__align-default {
      top: 45%;
    }

    &__align-middle {
      top: 50%;
    }
  }

  &__text {
    display: block;
    margin-left: 10px;
    color: #999;
    font-size: 26px;
  }
}
</style>
