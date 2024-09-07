<template>
  <nut-popup
    v-model:visible="visible"
    v-bind="$attrs"
    class="popup-picker-view"
    position="bottom"
    round
    safe-area-inset-bottom
    :catch-move="true"
    :style="{ height }"
    @click-overlay="handleClickOverlay"
  >
    <div v-if="showAction" class="nut-picker nut-picker__bar">
      <div class="nut-picker__cancel nut-picker__left nut-picker__button">
        <div
          v-if="showCancelBtn"
          class="popup-picker-view__button"
          @click="handleCancel"
        >
          {{ cancelText }}
        </div>
      </div>
      <div class="nut-picker__title">{{ title }}</div>
      <div class="nut-picker__confirm nut-picker__right nut-picker__button">
        <div
          v-if="showConfirmBtn"
          class="popup-picker-view__button"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </div>
      </div>
    </div>
    <view
      class="popup-picker-view__body"
      :class="{
        'popup-picker-view__has-action': showAction
      }"
      :catch-move="true"
    >
      <slot></slot>
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { Popup as NutPopup } from '@nutui/nutui-taro';

defineOptions({
  name: 'PopupPickerView'
});

const emit = defineEmits(['update:visible', 'cancel', 'confirm', 'close']);
withDefaults(
  defineProps<{
    title?: string;
    height?: string;
    confirmText?: string;
    cancelText?: string;
    showAction?: boolean;
    showConfirmBtn?: boolean;
    showCancelBtn?: boolean;
  }>(),
  {
    title: '请选择',
    height: '60%',
    confirmText: '确定',
    cancelText: '取消',
    showAction: true,
    showConfirmBtn: true,
    showCancelBtn: true
  }
);

const visible = defineModel<boolean>('visible');
const handleCancel = () => {
  emit('cancel');
};
const handleConfirm = async () => {
  emit('confirm');
};
const handleClickOverlay = () => {
  emit('close');
  visible.value = false;
};
</script>

<style lang="scss">
@import '@nutui/nutui-taro/dist/packages/popup/index.scss';
@import '../../styles/variable';
$bar-height: 92rpx;

.nut-picker {
  position: relative;
  background: #fff;

  &__bar {
    display: flex;
    height: var(--popup-picker-view-bar-height, $bar-height);
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid
      var(--popup-picker-view-bar-border-color, $border-color-def);
  }

  &__title {
    flex: 1;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    color: var(--nut-picker-bar-title-color, var(--nut-title-color, #1a1a1a));
    font-size: var(--nut-picker-bar-title-font-size, 32rpx);
    font-weight: var(--nut-picker-bar-title-font-weight, normal);
  }

  &__left {
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100rpx;
    height: 100%;
    color: var(--nut-picker-cancel-color, #808080);
    font-size: var(--nut-picker-bar-cancel-font-size, 28rpx);
  }

  &__right {
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100rpx;
    height: 100%;
    color: var(--nut-picker-ok-color, var(--nut-primary-color, #fa2c19));
    font-size: var(--nut-picker-bar-ok-font-size, 28rpx);
  }
}

.popup-picker-view {
  &__body {
    position: relative;
    height: 100%;
    padding: var(--popup-picker-view-body-padding, 14rpx 0);
  }

  &__has-action {
    height: calc(
      100% - var(--popup-picker-view-bar-height, $bar-height)
    ) !important;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: var(--nut-picker-bar-button-padding, 0 30rpx);
  }
}
</style>
