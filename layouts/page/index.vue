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
import { useSlots } from 'vue';

defineOptions({
  name: 'PageRoot'
});

withDefaults(
  defineProps<{
    show?: boolean;
    loadingHideContent?: boolean;
    text?: string;
    scale?: number;
    showAction?: boolean;
    fullscreen?: boolean;
    actionHeight?: string;
  }>(),
  {
    loadingHideContent: true,
    text: '正在加载...',
    scale: 1,
    showAction: true,
    fullscreen: true,
    actionHeight: '140rpx'
  }
);

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
  const dialog = reactive({
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
.page-root {
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
}
</style>
