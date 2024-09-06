<template>
  <popup-picker-view
    v-model:visible="visible"
    class="popup-picker"
    v-bind="$attrs"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <slot name="before-outer" :clear="clear"></slot>
    <scroll-view
      class="popup-picker__column"
      :scroll-into-view="scrollIntoView"
      :scroll-y="true"
      :show-scrollbar="false"
      :enhanced="true"
    >
      <slot name="before-inner" :clear="clear"></slot>
      <template v-for="(item, i) in columnList" :key="i">
        <div
          :id="`item-${item[valueKey]}`"
          class="popup-picker__item-wrap"
          :class="[
            `popup-picker__item-${iconAlign}`,
            {
              'popup-picker__item-checked': item._checked_
            }
          ]"
          @click="handleChecked(item, i)"
        >
          <template v-if="showCheckedIcon && iconAlign === 'left'">
            <checked
              v-if="item._checked_"
              color="var(--nut-primary-color)"
              size="36rpx"
            />
            <check-normal
              v-else
              color="var(--nut-checkbox-icon-disable-color, rgba(0, 0, 0, 0.15))"
              size="36rpx"
            />
          </template>
          <slot
            name="item"
            :item="item"
            :index="i"
            :checked="item._checked_"
            :clear="clear"
          >
            <div class="popup-picker__item">{{ item.label }}</div>
          </slot>
          <checked
            v-if="showCheckedIcon && iconAlign === 'right' && item._checked_"
            color="var(--nut-primary-color)"
            size="36rpx"
          />
        </div>
      </template>
      <slot name="after-inner" :clear="clear"></slot>
    </scroll-view>
    <slot name="after-outer" :clear="clear"></slot>
  </popup-picker-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Taro from '@tarojs/taro';
import { cloneDeep } from 'lodash-es';
import { Checked, CheckNormal } from '@nutui/icons-vue-taro';
import PopupPickerView from '../popup-picker-view/index.vue';
import { isValidValue } from '../../utils';

defineOptions({
  name: 'PopupPicker'
});

const emit = defineEmits(['update:visible', 'click:item', 'cancel', 'confirm']);

const props = withDefaults(
  defineProps<{
    columns: AnyObject[];
    multiple?: boolean;
    required?: boolean;
    placeholder?: string;
    labelKey?: string;
    valueKey?: string;
    iconAlign?: 'left' | 'right';
    matchChecked?: (data: AnyObject, checkedKey: string) => boolean; // 匹配回显数据
    disabledKey?: string; // 匹配禁用的唯一值
    disabledValue?: Numberish | boolean | ((item: any) => boolean); // 匹配禁用的唯一值
    checkedKey?: string; // 匹配勾选的唯一值
    showCheckedIcon?: boolean;
    autoClose?: boolean; // 单选时有效
    scrollIntoId?: string;
    beforeConfirm?:
      | ((data: AnyObject[]) => boolean)
      | ((data: AnyObject[]) => Promise<boolean>);
  }>(),
  {
    required: true,
    labelKey: 'label',
    valueKey: 'value',
    iconAlign: 'right',
    placeholder: '请选择数据',
    checkedKey: 'id',
    showCheckedIcon: true
  }
);

const visible = defineModel('visible');
const columnList = ref<AnyObject[]>([]);
const selectedList = new Set();
const scrollIntoView = ref<string>();

const clear = () => {
  selectedList.clear();
  columnList.value.forEach((item) => {
    item._checked_ = false;
  });
};

defineExpose({
  clear
});

watch(
  () => props.columns,
  (value) => {
    columnList.value = (value ?? []).map((item) => {
      item.label = item[props.labelKey];
      item.value = item[props.valueKey];
      return item;
    });
  },
  {
    immediate: true
  }
);
watch(visible, (show) => {
  if (show) {
    selectedList.clear();
    props.columns.forEach((item) => {
      item._checked_ = props.matchChecked?.(item, props.checkedKey) ?? false;
      if (item._checked_) {
        selectedList.add(item[props.checkedKey]);
      }
    });

    if (show) {
      Taro.nextTick(() => {
        if (props.scrollIntoId) {
          scrollIntoView.value = `item-${props.scrollIntoId}`;
        }
      });
    } else {
      scrollIntoView.value = undefined;
    }
  }
});

const getCheckedData = () => {
  return columnList.value.filter((item) => item._checked_);
};
const handleConfirm = async () => {
  if (props.required && !selectedList.size) {
    return Taro.showToast({
      title: props.placeholder,
      icon: 'none'
    });
  }

  const value = cloneDeep(getCheckedData());
  // 清理数据
  value.forEach((item) => {
    delete item._checked_;
  });

  if (props.beforeConfirm && !(await props.beforeConfirm(value))) return;
  visible.value = false;
  emit('confirm', value);
};
const handleCancel = () => {
  emit('cancel', clear);
};
const emitClick = (item: AnyObject, index: number) => {
  emit('click:item', {
    columns: props.columns,
    item,
    index,
    selectedList,
    clear
  });
};
const handleChecked = (item: AnyObject, i) => {
  if (isValidValue(props.disabledValue)) {
    if (
      typeof props.disabledValue === 'function' &&
      props.disabledValue(item)
    ) {
      emitClick(item, i);
      return;
    } else if (
      props.disabledKey &&
      item[props.disabledKey] === props.disabledValue
    ) {
      emitClick(item, i);
      return;
    }
  }

  if (!props.multiple) {
    selectedList.clear();
    const oldCheckedItem = getCheckedData()[0];
    if (oldCheckedItem) {
      oldCheckedItem._checked_ = false;
    }
  }

  item._checked_ = !item._checked_;

  if (item._checked_) {
    selectedList.add(item[props.checkedKey]);
  } else {
    selectedList.delete(item[props.checkedKey]);
  }

  emitClick(item, i);

  if (!props.multiple && props.autoClose) {
    handleConfirm();
  }
};
</script>

<style lang="scss">
@import '../../styles/variable';
@import '../../styles/mixins';

.popup-picker {
  &__column {
    height: 100%;
  }

  &__item {
    &-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      column-gap: var(--popup-picker-column-gap, 20px);
      min-width: 0;
      padding: var(--popup-picker-wrap-padding, 28px 32px);
    }

    &-label {
      @include text-overflow();
      min-height: var(--popup-picker-label-min-height, 44px);
      font-family: var(--popup-picker-label-font-family, $font-family);
      font-weight: var(--popup-picker-label-font-weight, 400);
      font-size: var(--popup-picker-label-font-size, 28px);
      color: var(--popup-picker-label-color, rgba(0, 0, 0, 0.65));
      line-height: var(--popup-picker-label-line-height, 44px);
    }

    &-left {
      justify-content: flex-start;
    }

    &-checked {
      color: var(--popup-picker-checked-color, $color-primary);
    }
  }
}
</style>
