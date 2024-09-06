<template>
  <select-picker-label
    :loading="loading"
    :name="name"
    :icon-align="iconAlign"
    :icon-color="iconColor"
    :text-size="textSize"
    :text-max-width="textMaxWidth"
    :placeholder="placeholder"
    @click="showPicker = true"
  />
  <popup-picker
    v-model:visible="showPicker"
    v-bind="$attrs"
    :title="title"
    :columns="list"
    :match-checked="matchChecked"
    :label-key="labelKey"
    :value-key="valueKey"
    :checked-key="checkedKey"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
const emit = defineEmits(['update:label', 'update:value', 'cancel', 'confirm']);

defineOptions({
  name: 'SelectPicker',
  inheritAttrs: false
});

withDefaults(
  defineProps<{
    list: AnyObject[];
    loading?: boolean;
    height?: string;
    title?: string;
    labelKey?: string;
    valueKey?: string;
    checkedKey?: string; // 匹配勾选的唯一值
    iconAlign?: 'left' | 'right';
    iconColor?: string;
    textSize?: string;
    textMaxWidth?: string;
    placeholder?: string;
  }>(),
  {
    height: '50%'
  }
);

const showPicker = ref(false);
const name = defineModel<string>('label');
const code = defineModel<Numberish>('value');
const matchChecked = (item: AnyObject, checkedKey: string) => {
  return item[checkedKey] === code.value;
};
const handleConfirm = (selectedValue: any) => {
  const { label, value } = selectedValue[0];
  name.value = label;
  code.value = value;
  emit('confirm', selectedValue[0]);
};
const handleCancel = () => {
  showPicker.value = false;
  emit('cancel');
};
</script>
