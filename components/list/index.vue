<template>
  <loading-view
    class="x-list"
    :class="{
      'x-list__init': !isReady || isFail
    }"
    :loading="!isReady && !isFail"
  >
    <slot :result="list" :refresh="refresh" :next-page="nextPage"></slot>

    <view v-show="nodata || isFail" class="x-list-nodata">
      <slot v-if="showNodataImg" name="img">
        <image
          class="x-list-nodata-img"
          :src="nodataImg ?? nodataImgDef"
        ></image>
      </slot>
      <view v-if="isFail">{{ failText }}</view>
      <view v-else>
        <slot name="nodata">{{ nodataText }}</slot>
      </view>
    </view>

    <view v-if="isReady && !nodata" v-show="loading" class="x-list-status">
      <view class="x-list-loading"> <loading class="x-list-img" />加载中 </view>
    </view>
  </loading-view>
</template>

<script setup lang="ts">
import { PropType, ref, computed, watch } from 'vue';
import Taro from '@tarojs/taro';
import LoadingView from '../loading-view/index.vue';
import Loading from '../loading/index.vue';
import nodataImgDef from './assets/nodata.png';

defineOptions({
  name: 'List'
});

const emit = defineEmits([
  'fetch:complete', // 当接口请求成功时触发，返回接口数据
  'fetch:fail', // 当接口请求失败时触发，返回接口错误信息
  'render', // 当前页准备渲染时触发，返回渲染数据
  'get:data', // 当接口请求成功时触发，返回全部渲染数据，适用于客户端分页模式
  'ready' // 第一次接口请求成功或失败时触发
]);
const props = defineProps({
  apiFn: {
    type: Function as PropType<(query?: AnyObject) => Promise<any>>,
    required: true
  },
  query: {
    type: Object,
    default: () => ({})
  },
  resFormat: {
    type: Function,
    default: undefined
  },
  pageSize: {
    type: Number,
    default: 20
  },
  paginationMode: {
    type: String as PropType<'server' | 'client'>,
    default: 'server'
  },
  nodataText: {
    type: String,
    default: '暂无内容'
  },
  failText: {
    type: String,
    default: '加载失败，请刷新重试'
  },
  nodataImg: {
    type: String,
    default: undefined
  },
  showNodataImg: {
    type: Boolean,
    default: true
  },
  onShowRefresh: {
    type: Boolean,
    default: false
  }
});

let requestToken = 1;
let lastToken = 0;
const isReady = ref(false);
const isFail = ref(false);
const loading = ref(false);
const nodata = ref(false);
const isLastPage = ref(false);
const pageNo = ref(1);
const listAll = ref<AnyObject[]>([]);
const list = ref<AnyObject[]>([]);
const isClient = computed(() => props.paginationMode === 'client');

const fetchData = async () => {
  const query = {
    ...props.query
  };

  if (!isClient.value) {
    query.pageSize = props.pageSize;
    query.pageNo = pageNo.value;
  }

  if (isClient.value && listAll.value.length) {
    const newList = list.value.concat(
      listAll.value.slice(
        props.pageSize * (pageNo.value - 1),
        props.pageSize * pageNo.value
      )
    );
    loading.value = false;
    list.value = newList;
    isLastPage.value = newList.length >= listAll.value.length;
    Taro.hideLoading();
    Taro.stopPullDownRefresh();
    emit('render', newList);
    return;
  }

  try {
    lastToken = requestToken;
    let { token, res } = await createFetch(
      requestToken++,
      props.apiFn,
      preprocessQuery(query)
    );

    // 忽略过期请求的返回数据
    if (lastToken > token) return;

    emit('fetch:complete', res);
    let resData;
    try {
      resData =
        typeof props.resFormat === 'function' ? props.resFormat(res) : res;
    } catch (e) {
      resData = res;
    }

    if (!isClient.value) {
      resData = resData || { result: [] };
    }

    const result = (isClient.value ? resData : resData.result) ?? [];
    loading.value = false;

    if (!isReady.value) {
      isReady.value = true;
      emit('ready', props.onShowRefresh);
    }

    if (
      (result.length && result.length < props.pageSize) ||
      (pageNo.value > 1 && !result.length)
    ) {
      isLastPage.value = true;
    }

    if (pageNo.value === 1 && !result.length) {
      nodata.value = true;
      isLastPage.value = true;
    }

    if (isClient.value) {
      listAll.value = result || [];
      list.value = listAll.value.slice(0, props.pageSize);
    } else {
      list.value = [...list.value, ...result];
      listAll.value = list.value;
    }

    Taro.hideLoading();
    Taro.stopPullDownRefresh();
    emit('render', list.value);
    emit('get:data', listAll.value);
  } catch (e) {
    Taro.hideLoading();
    Taro.stopPullDownRefresh();
    isFail.value = true;
    emit('fetch:fail', e);
  }
};

const resetData = () => {
  listAll.value = [];
  list.value = [];
  pageNo.value = 1;
  isLastPage.value = false;
  nodata.value = false;
  isFail.value = false;
};

const nextPage = () => {
  if (isLastPage.value) return;
  loading.value = true;
  pageNo.value = pageNo.value + 1;
  fetchData();
};
const refresh = () => {
  resetData();
  fetchData();
  Taro.pageScrollTo({
    scrollTop: 0
  });
};

defineExpose({
  nextPage,
  refresh
});

watch(
  () => props.query,
  () => {
    if (isReady.value || isFail.value) {
      resetData();
      fetchData();
    }
  },
  {
    deep: true
  }
);

Taro.useDidShow(() => {
  if (isReady.value && props.onShowRefresh) {
    refresh();
  } else if (!isReady.value) {
    nextTick(() => {
      fetchData();
    });
  }
});

Taro.useReachBottom(() => {
  nextPage();
});

Taro.usePullDownRefresh(() => {
  Taro.showLoading({
    title: '加载中',
    mask: true
  });
  refresh();
});
</script>
<script lang="ts">
function createFetch(token, request, query) {
  return new Promise((resolve, reject) => {
    try {
      request(query)
        .then((res) => {
          resolve({ token, res });
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

// 预处理参数，去掉无效值和字符两端空格
function preprocessQuery(data: AnyObject) {
  const query = {};
  Object.keys(data).forEach((key) => {
    let value = data[key];

    if (typeof value === 'string') {
      value = value.trim();
    }

    if (value !== undefined && value !== null && value !== '') {
      query[key] = value;
    }
  });

  return query;
}
</script>

<style lang="scss">
@import '../../styles/variable';
@import '../../styles/mixins';

.x-list {
  height: auto;
  padding-bottom: env(safe-area-inset-bottom);

  &__init {
    min-height: 100vh;
  }
}

.x-list-status {
  @include padding-v(var(--list-status-padding, 30px));
  color: var(--list-status-color, #999);
  font-size: var(--list-status-font-size, 24px);
  line-height: var(--list-status-line-height, 40px);
  text-align: center;

  .x-list-img {
    width: var(--list-img-width, 40px);
    height: var(--list-img-height, 40px);
    margin-right: var(--list-img-margin-right, 10px);
    margin-bottom: var(--list-img-margin-bottom, 0);
    vertical-align: bottom;

    .x-loading-icon {
      font-size: var(--list-loading-icon-font-size, 40px);
    }
  }
}

.x-list-nodata {
  padding-top: var(--list-nodata-padding-top, 230px);
  color: var(--list-nodata-color, #999);
  font-size: var(--list-nodata-font-size, 28px);
  font-family: var(--list-nodata-font-family, $font-family-regular);
  text-align: center;
  line-height: var(--list-nodata-line-height, 44px);

  .x-list-nodata-img {
    width: var(--list-nodata-img-width, 340px);
    height: var(--list-nodata-img-height, 340px);
  }
}
</style>
