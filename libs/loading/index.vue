<template>
  <view class="x-loading" :style="style">
    <nut-loading
      class="x-loading-icon nut-icon-am-rotate nut-icon-am-infinite"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loading1 as NutLoading } from '@nutui/icons-vue-taro';

defineOptions({
  name: 'Loading'
});

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
});
const style = computed(() => ({
  transform: `scale(${props.scale})`
}));
</script>

<style lang="scss">
.x-loading {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  vertical-align: bottom;
  width: 80px;
  height: 80px;

  &-icon {
    font-size: 72px;
    line-height: 1;
  }
}
</style>
