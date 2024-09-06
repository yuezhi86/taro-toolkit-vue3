<template>
  <div class="select-picker__label">
    <triangle-down
      v-if="iconAlign === 'left'"
      class="mr-[10px]"
      :color="iconColor"
      size="20rpx"
    />
    <div
      class="select-picker__label-text"
      :class="{
        'select-picker__label-placeholder': !name
      }"
      :style="{
        'font-size': textSize,
        'max-width': textMaxWidth
      }"
    >
      <template v-if="loading">加载中</template>
      <template v-else>
        {{ name || placeholder }}
      </template>
    </div>
    <triangle-down
      v-if="iconAlign === 'right'"
      class="ml-[10px]"
      :color="iconColor"
      size="20rpx"
    />
  </div>
</template>

<script setup lang="ts">
import { TriangleDown } from '@nutui/icons-vue-taro';

defineOptions({
  name: 'SelectPickerLabel'
});

withDefaults(
  defineProps<{
    name?: string;
    loading?: boolean;
    iconAlign?: 'left' | 'right';
    iconColor?: string;
    textSize?: string;
    textMaxWidth?: string;
    placeholder?: string;
  }>(),
  {
    name: undefined,
    iconAlign: 'right',
    iconColor: '#ccc',
    textSize: '26rpx',
    textMaxWidth: '200rpx',
    placeholder: '请选择'
  }
);
</script>

<style lang="scss">
@import '../../styles/variable';
@import '../../styles/mixins';

.select-picker {
  &__label {
    display: flex;
    align-items: center;
    min-width: 0;

    &-text {
      @include text-overflow();
      min-width: var(--select-picker-text-min-width, 60px);
      max-width: var(--select-picker-text-max-width, 200px);
      font-family: var(--select-picker-text-font-family, $font-family);
      font-weight: var(--select-picker-text-font-weight, 400);
      font-size: var(--select-picker-text-font-size, 26px);
      color: var(--select-picker-text-color, #333);
      line-height: var(--select-picker-text-line-height, 38px);
    }

    &-placeholder {
      color: var(--select-picker-placeholder-color, rgba(0, 0, 0, 0.25));
    }
  }
}
</style>
