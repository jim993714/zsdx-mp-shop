<script setup lang="ts">
import { storage } from '@zsdx/mp-utils';

import { keywordSuggest } from '@/api/search';
import debounce from '@/utils/tools/debounce';

const list = ref<string[]>([]);
const localStorage = storage();
const searchKey = ref('');
const props = defineProps<{
    searchInput: string;
    studentShopId?: string;
    trackSearchSession?: string;
}>();

onMounted(() => {
    getSuggestList(props.searchInput);
});

watch(
    () => props.searchInput,
    val => {
        getSuggestList(val);
    }
);

const getSuggestList = debounce(async (input: string) => {
    searchKey.value = new Date().getTime() + '_' + localStorage.get('uuid') || '';
    const resp = await keywordSuggest({ keyWord: input });
    list.value = resp;
}, 600);

const emits = defineEmits<{
    (e: 'change', val: string): void;
}>();
</script>

<template>
    <view class="container">
        <track-view
            v-for="(item, index) in list"
            :key="index"
            :track-data="{
                type: 'all',
                clientTop: 200,
                observerName: '.search-suggest' + index,
                eventData: {
                    path: 'bi_search',
                    student_shop_id: studentShopId,
                    search_word: item,
                    edit_word: searchInput,
                    search_session: trackSearchSession,
                    search_key: searchKey
                },
                clickData: {
                    action: 9
                },
                exposureData: {
                    action: 8
                }
            }"
        >
            <view
                class="item"
                :class="'search-suggest' + index"
                @tap="emits('change', item)"
            >
                <zd-keywords-text
                    :keywords="searchInput"
                    :value="item"
                ></zd-keywords-text>
            </view>
        </track-view>
    </view>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    padding: 10rpx 0rpx;
    flex-direction: column;
    box-sizing: border-box;
}
.item {
    width: 100%;
    height: 68rpx;
    border-bottom: 1rpx solid rgba($color: $uni-border-color, $alpha: 0.2);
    font-size: 28rpx;
    line-height: 68rpx;
}
</style>
