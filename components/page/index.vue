<template>
  <loading-view
    v-bind="$attrs"
    class="page-root"
    :class="{
      'page-root__has-action': hasAction && showAction,
      'page-root__full': fullscreen
    }"
    :loading="!show"
    :loading-hide-content="loadingHideContent"
    :text="text"
    :scale="scale"
  >
    <slot></slot>
    <template #outer>
      <div v-show="showBackTopBtn" class="back-top" @click="handleBackTop">
        <top class="back-top__icon" />
      </div>
      <nut-toast v-model:visible="toast.show" v-bind="toast" />
      <nut-dialog
        v-model:visible="dialog.show"
        v-bind="dialog"
        @ok="handleConfirm"
        @cancel="handleCancel"
      >
        <slot name="dialog-content">{{ dialog.content }}</slot>
      </nut-dialog>
      <slot name="actions"></slot>
    </template>
  </loading-view>
</template>

<script setup lang="ts">
import { ref, computed, provide, useSlots } from 'vue';
import Taro from '@tarojs/taro';
import LoadingView from '../loading-view/index.vue';
import { Toast as NutToast, Dialog as NutDialog } from '@nutui/nutui-taro';
import { Top } from '@nutui/icons-vue-taro';

defineOptions({
  name: 'PageRoot'
});

const props = withDefaults(
  defineProps<{
    show?: boolean;
    loadingHideContent?: boolean;
    text?: string;
    scale?: number;
    showAction?: boolean;
    fullscreen?: boolean;
    actionHeight?: string;
    showBackTop?: boolean;
    backTopScreenNum?: number;
  }>(),
  {
    loadingHideContent: true,
    text: '正在加载...',
    scale: 1,
    showAction: true,
    fullscreen: true,
    actionHeight: '140rpx',
    backTopScreenNum: 2
  }
);

const windowInfo = Taro.getWindowInfo();
const showBackTopBtn = ref(false);
Taro.usePageScroll(({ scrollTop }) => {
  showBackTopBtn.value =
    scrollTop > props.backTopScreenNum * windowInfo.windowHeight;
});

const handleBackTop = () => {
  Taro.pageScrollTo({
    scrollTop: 0
  });
};

const slots = useSlots();
const hasAction = computed(() => slots.actions);
const { toast, showToast } = useToast();
const { dialog, showDialog, handleConfirm, handleCancel } = useDialog();

provide('showToast', showToast);
provide('showDialog', showDialog);
defineExpose({
  showToast,
  showDialog
});
</script>
<script lang="ts">
import { reactive } from 'vue';
const useToast = () => {
  const toast = reactive({
    show: false,
    msg: '',
    type: 'text',
    cover: false,
    title: '',
    bottom: '',
    center: true
  });
  const showToast = (message: string, options: AnyObject = {}) => {
    toast.show = true;
    toast.msg = message;
    toast.type = options.type ?? 'text';
    toast.cover = options.cover ?? false;
    toast.title = options.title ?? '';
    toast.bottom = options.bottom ?? '';
    toast.center = options.center ?? true;
  };

  return {
    toast,
    showToast
  };
};

const useDialog = () => {
  let onConfirm: (() => void) | undefined;
  let onCancel: (() => void) | undefined;
  const dialog = reactive<any>({
    show: false,
    content: '',
    title: '',
    okText: '确定',
    cancelText: '取消',
    noCancelBtn: false,
    closeOnPopstate: true,
    closeOnClickOverlay: false,
    beforeClose: null
  });
  const showDialog = (content: string, options: AnyObject = {}) => {
    dialog.show = true;
    dialog.content = content;
    dialog.title = options.title ?? '';
    dialog.okText = options.okText ?? '确定';
    dialog.cancelText = options.cancelText ?? '取消';
    dialog.noCancelBtn = options.noCancelBtn ?? false;
    dialog.closeOnPopstate = options.closeOnPopstate ?? true;
    dialog.closeOnClickOverlay = options.closeOnClickOverlay ?? false;
    dialog.beforeClose = options.beforeClose ?? null;

    onConfirm = options.onConfirm;
    onCancel = options.onCancel;
  };
  const handleConfirm = () => {
    onConfirm?.();
  };
  const handleCancel = () => {
    onCancel?.();
  };

  return {
    dialog,
    showDialog,
    handleConfirm,
    handleCancel
  };
};
</script>

<style lang="scss">
@import '@nutui/nutui-taro/dist/packages/toast/index.scss';
@import '@nutui/nutui-taro/dist/packages/dialog/index.scss';
@import '../../styles/variable';

.page-root {
  --nut-dialog-header-font-weight: 600;

  display: flex;
  box-sizing: border-box;
  flex-direction: column;

  &__full {
    min-height: 100vh;
    height: auto;
  }

  &__has-action {
    min-height: 100vh;
    height: auto;
    padding-bottom: calc(
      v-bind('actionHeight') + env(safe-area-inset-bottom)
    ) !important;

    .actions {
      .nut-button {
        font-weight: bold;
      }
    }
  }

  .nut-dialog {
    padding: var(--dialog-padding, 48rpx 0 0);
    font-size: var(--dialog-font-size, 30rpx);

    &__content {
      padding: var(--dialog-content-padding, 0 48rpx);
      font-size: inherit !important;
    }

    &__footer.horizontal {
      height: var(--dialog-footer-height, 100rpx);
      border-top: 1rpx solid
        var(--dialog-footer-border-top-color, $border-color-def);

      .nut-button {
        --nut-button-small-round-border-radius: 0;

        flex: 1;
        flex-shrink: 0;
        flex-grow: 0;
        display: block;
        min-width: 50%;
        width: 50%;
        height: 100%;
        border: none;
        background: var(--dialog-button-bg, #fff);
        color: var(--dialog-button-color, $color-primary);
        font-family: var(--dialog-button-font-family, $font-family);
        font-weight: var(--dialog-button-font-weight, 500);
        font-size: var(--dialog-button-font-size, 36rpx);
        line-height: var(--dialog-button-line-height, 1);

        &.nut-button--plain {
          color: var(--dialog-button-second-color, rgba(0, 0, 0, 0.65));
          border-right: 1rpx solid
            var(--dialog-button-second-border-right-color, $border-color-def);
        }
      }
    }
  }
}

.back-top {
  position: fixed;
  bottom: calc(var(--backtop-bottom, 40rpx) + env(safe-area-inset-bottom));
  right: var(--backtop-right, 20rpx);
  z-index: var(--backtop-zindex, 100);
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--backtop-width, 80rpx);
  height: var(--backtop-height, 80rpx);
  background: var(--backtop-bg-color, #fff);
  border: 1rpx solid var(--backtop-border-color, #e0e0e0);
  border-radius: 50%;
}
</style>
