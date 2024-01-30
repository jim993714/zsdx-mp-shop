<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import definePageProps from '@/utils/definePageProps';
import { generateTrackSearchSession } from '@/utils/track/search';

import SearchHeader from '../components/search-header/index.vue';
import HistoryList from './components/history-list.vue';
import KeywordSuggest from './components/keyword-suggest.vue';

definePageProps<{
    /** 目标页面 */
    to: string;

    /** 来源页面 */
    from?: string;

    /** 搜索词 */
    keyword?: string;

    /** 本地存储 key */
    cacheKey?: string;

    /** 输入框占位符 */
    placeholder?: string;

    /** 活动编号 */
    activityNo?: string;

    /** 自定义页面搜索参数 */
    type?: string;

    search_source_key?: string;

    customPageNo?: string;
}>();

const options = reactive({
    to: '',
    from: '',
    keyword: '',
    storageKey: '',
    placeholder: '',
    activityNo: '',
    zoneId: '',
    discountAreaTimeId: '',
    /** 自定义页面搜索参数 */
    customPageNo: '',
    search_source_key: '',
    type: '',
    __trackSearchSession: '' // 埋点搜索携带, searchSession, 跟单用
});

const historyListRef = ref<InstanceType<typeof HistoryList>>();

const searchInput = ref('');
const localStorage = storage();
const studentShopId = ref('');
// 搜索埋点searchSession,从进入搜索页面开始保持同一个search_session，格式为时间戳+用户id
const trackSearchSession = ref('');
onLoad(options_ => {
    console.log('ff', options_);

    options.to = options_?.to ?? 'searchResult';
    options.from = options_?.from ?? '';
    options.keyword = options_?.keyword ?? '';
    options.storageKey = options_?.storageKey ?? 'search-history';
    options.placeholder = options_?.placeholder ?? '';
    options.activityNo = options_?.activityNo ?? '';
    options.zoneId = options_?.zoneId ?? '';
    options.discountAreaTimeId = options_?.discountAreaTimeId ?? '';
    /** 自定义页面搜索参数 */
    options.customPageNo = options_?.customPageNo;
    options.search_source_key = options_?.search_source_key;
    options.type = options_?.type;
    studentShopId.value = localStorage.get('studentShopId') || '';
    trackSearchSession.value = options_?.__trackSearchSession || generateTrackSearchSession();
    options.__trackSearchSession = trackSearchSession.value;
});

function onBack() {
    router.back();
}

async function onSearch(value: string) {
    historyListRef.value?.addHistory(value);
    router.redirect(options.to, options);
}

function onChange(value: string) {
    options.keyword = value;
    onSearch(value);
}
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <search-header
        v-model="options.keyword"
        :placeholder="options.placeholder"
        focus
        @back="onBack"
        @search="onSearch"
        @input="(val:string) => (searchInput = val)"
    />
    <history-list
        v-if="!searchInput"
        ref="historyListRef"
        :student-shop-id="studentShopId"
        :storage-key="options.storageKey"
        :track-search-session="trackSearchSession"
        @change="onChange"
    />
    <keyword-suggest
        v-if="searchInput && !options.customPageNo"
        :search-input="searchInput"
        :student-shop-id="studentShopId"
        :track-search-session="trackSearchSession"
        @change="onChange"
    />
</template>

<style scoped></style>
