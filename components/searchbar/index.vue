<template>
  <nut-searchbar
    v-model="searchKey"
    class="search-bar"
    :class="{
      'search-bar__no-left': !slots.leftin
    }"
    :clearable="false"
    :placeholder="placeholder"
    @change="handleChange"
    @search="handleSearch"
  >
    <template #leftin>
      <slot name="leftin"></slot>
    </template>
    <template #rightin>
      <slot name="action" :search="handleSearch">
        <search color="#ccc" size="30rpx" @click="handleSearch" />
      </slot>
    </template>
  </nut-searchbar>
</template>

<script setup lang="ts">
import { ref, watch, useSlots } from 'vue';
import { Search } from '@nutui/icons-vue-taro';

defineOptions({
  name: 'SearchBar'
});

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue: string;
    debounce?: number;
    autoTriggerEmit?: boolean;
    placeholder?: string;
  }>(),
  {
    debounce: undefined,
    autoTriggerEmit: true,
    placeholder: undefined
  }
);

const searchKey = ref('');
watch(
  () => props.modelValue,
  (value) => {
    searchKey.value = value;
  }
);
const handleSearch = () => {
  emit('update:modelValue', searchKey.value);
};

let timer: any;
const handleChange = () => {
  if (!props.autoTriggerEmit) return;
  clearTimeout(timer);
  timer = setTimeout(handleSearch, props.debounce ?? 500);
};

const slots = useSlots();
</script>

<style lang="scss">
.search-bar {
  .nut-searchbar__iptleft-search-icon {
    width: auto;
    margin-right: 0;
    padding-right: 12px;
    padding-left: 12px;
    border-right: 1px solid #979797;
  }

  .nut-searchbar__search-input .nut-searchbar__input-inner {
    padding-left: 20px;
  }

  &__no-left {
    .nut-searchbar__iptleft-search-icon {
      display: none;
    }
  }
}
</style>
