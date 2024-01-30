<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import { getSummerFreeGoodsList, getSummerGoodsList } from '../api/activity/company-subsidy/index';
import { getGoodsList as getNewYearShopGoodsList } from '../api/activity/new-year-shop/index';
import { getCustomPageData } from '../api/custom-page/index';
import { getGoodsList } from '../api/search/index';
import type { GoodsItem as GoodsItemType } from '../api/search/types';
import type { SearchType } from '../components/search-header/index.vue';
import SearchHeader from '../components/search-header/index.vue';
import SortBar from '../components/sort-bar/sort-bar.vue';
import type { ISortConfig } from '../components/sort-bar/types';
import FilterPopup from './components/filter-popup.vue';
import GoodsItem from './components/goods-item.vue';
import { sortConfig, sortConfig2, sortStyleConfig } from './constants';

const options = reactive({
    to: '',
    from: '',
    keyword: '',
    storageKey: '',
    placeholder: '',
    studentShopId: '',
    searchType: 1,
    activityNo: '',
    discountAreaTimeId: '',
    /** 自定义页面搜索参数 */
    customPageNo: '',
    search_source_key: '',
    type: '',
    __trackSearchSession: ''
});
const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
const scrollId = ref('');
const sortField = ref('');
const sortType = ref('');
const priceRange = ref<number[]>([]);
const sortTitle = ref('默认');
const trackSearchSession = ref('');
const trackSearchKey = ref('');

const list = ref<GoodsItemType[]>([]);
const navbarHeight = (uni.getSystemInfoSync().statusBarHeight || 0) + 44;
const filterRef = ref<InstanceType<typeof FilterPopup>>();
const localStorage = storage();
onLoad(options_ => {
    options.to = options_?.to ?? '';
    options.from = options_?.from ?? '';
    options.keyword = options_?.keyword ?? '';
    options.storageKey = options_?.storageKey ?? 'search-history';
    options.placeholder = options_?.placeholder ?? '';
    options.studentShopId = options_?.studentShopId ?? (localStorage.get('studentShopId') || '');
    options.activityNo = options_?.activityNo ?? '';
    options.discountAreaTimeId = options_?.discountAreaTimeId ?? '';

    /** 自定义页面搜索参数 */
    options.customPageNo = options_?.customPageNo;
    options.search_source_key = options_?.search_source_key;
    options.type = options_?.type;
    options.__trackSearchSession = options_?.__trackSearchSession || '';
    trackSearchSession.value = options_?.__trackSearchSession || '';
    trackSearchKey.value = new Date().getTime() + '_' + localStorage.get('uuid');
    getData(true);
});

function onToggle() {
    router.redirect('search', { ...options });
}

function goBack() {
    router.back();
}

function onSearch() {
    list.value = [];
    getData(true);
}

function onSortChange(sort: ISortConfig) {
    if (sort.sortField === 'filter') {
        // 如果是筛选,则弹窗
        return filterRef.value?.show();
    } else {
        filterRef.value?.close();
    }
    sortTitle.value = sort.sortTitle;
    console.log(sort, ' sortTitle.value=========_');

    priceRange.value = [];
    sortField.value = sort.sortField;
    sortType.value = sort.sortType;
    list.value = [];
    getData(true);
}

function onChangeType(type: SearchType) {
    options.searchType = type;
    getData(true);
}

function onChangeFilter(filter: number[]) {
    console.log('====', filter);
    priceRange.value = filter;
    getData(true);
}

async function getData(init?: boolean) {
    // 添加搜索
    if (init) {
        scrollId.value = '';
        list.value = [];
    }

    if (scrollId.value === 'null') return;
    let resp: any;

    if (options.customPageNo) {
        // 自定义页面搜索
        const res = await getCustomPageData({
            type: options.type,
            dataJson: JSON.stringify({
                scroll_id: scrollId.value,
                search_source_key: options.search_source_key,
                keyword: options.keyword
            })
        });
        resp = res.data;
        resp.scrollId = resp.scroll_id;
        resp.list =
            resp?.list?.map?.((item: any) => ({
                goodsCover: item.goods_cover,
                goodsNo: item.goods_no,
                goodsPrice: item.goods_price,
                goodsPriceOrigin: item.goods_price_origin,
                goodsTitle: item.goods_title,
                platformStudentPriceStatus: item.platform_student_price_status
            })) ?? [];
    } else if (options.activityNo) {
        if (options.from === 'goodsDetailDiscount') {
            // 自有折扣搜索
            resp = await getSummerFreeGoodsList({
                keywords: options.keyword,
                scrollId: scrollId.value,
                sortField: sortField.value,
                sortType: sortType.value ?? 'desc',
                size: 20,
                activityNo: options.activityNo,
                timeIds: options.discountAreaTimeId
            });
        } else if (options.from === 'NewYearShop') {
            // 年货节
            resp = await getNewYearShopGoodsList({
                keywords: options.keyword,
                scrollId: scrollId.value,
                sortField: sortField.value,
                sortType: sortType.value ?? 'desc',
                size: 20,
                activityNo: options.activityNo
            });
        } else {
            resp = await getSummerGoodsList({
                keywords: options.keyword,
                scrollId: scrollId.value,
                sortField: sortField.value,
                sortType: sortType.value ?? 'desc',
                size: 20,
                activityNo: options.activityNo
            });
        }
    } else {
        resp = await getGoodsList({
            keyWord: options.keyword,
            scrollId: scrollId.value,
            sortField: sortField.value,
            sortType: sortType.value ?? 'desc',
            studentShopId: options.studentShopId,
            size: 20,
            searchType: options.searchType,
            priceRange: priceRange.value
        });
    }
    list.value = [...list.value, ...(resp.list ?? [])];
    scrollId.value = resp.scrollId || 'null';
    uni.stopPullDownRefresh();
}

onPullDownRefresh(() => {
    list.value = [];
    getData(true);
});
onReachBottom(() => {
    getData();
});
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view class="page">
        <search-header
            v-model="options.keyword"
            :show-search-type="!options.activityNo"
            @back="onToggle"
            @search="onSearch"
            @focus="onToggle"
            @change-type="onChangeType"
        />
        <view style="height: 76rpx"></view>
        <view
            v-if="!options.customPageNo"
            class="sortbar"
            :style="{
                top: navbarHeight + 'px'
            }"
        >
            <sort-bar
                v-if="options.activityNo"
                :config="sortConfig2"
                :theme="sortStyleConfig"
                :indicator-type="0"
                item-full
                @change="onSortChange"
            />
            <sort-bar
                v-else
                :config="sortConfig"
                :theme="sortStyleConfig"
                :indicator-type="0"
                item-full
                @change="onSortChange"
            />
            <filter-popup
                ref="filterRef"
                @change="onChangeFilter"
            />
        </view>
        <view class="list-wrapper">
            <view v-if="list.length === 0 && scrollId === 'null'">
                <track-view
                    :track-data="{
                        type: 'all',
                        observerName: '.empty',
                        eventData: {
                            path: 'bi_search',
                            student_shop_id: options.studentShopId,
                            search_word: options.keyword,
                            search_session: trackSearchSession,
                            search_key: trackSearchKey,
                            data_type: 'NoResult',
                            rank_type: sortField + '_' + sortType
                        },
                        clickData: {
                            action: 12
                        },
                        exposureData: {
                            action: 13
                        }
                    }"
                >
                    <zd-empty
                        :image="
                            options.from === 'goodsDetailDiscount'
                                ? 'https://nss1.zsdx.cn/mp-cs/images/shop/search/empty.png'
                                : 'https://nss1.zsdx.cn/mp-material/images/list_empty.png'
                        "
                    >
                        <template #description>
                            <view class="empty"> 没有搜索到符合条件的商品，换个关键词搜搜看~ </view>
                            <zd-button
                                type="primary"
                                class="return-btn"
                                @tap="goBack"
                            >
                                {{
                                    options.from === 'goodsDetailDiscount' ||
                                    options.from === 'NewYearShop'
                                        ? '返回专区'
                                        : '返回店铺首页'
                                }}
                            </zd-button>
                        </template>
                    </zd-empty>
                </track-view>
            </view>
            <template v-else>
                <view class="goods-list">
                    <grid-view
                        type="masonry"
                        :cross-axis-count="2"
                        :main-axis-gap="14"
                        :cross-axis-gap="14"
                    >
                        <view
                            v-for="(item, index) in list"
                            :key="index"
                        >
                            <track-view
                                :track-data="{
                                    type: 'all',
                                    observerName: '.search-goods' + index,
                                    eventData: {
                                        path: 'bi_search',
                                        student_shop_id: options.studentShopId,
                                        search_word: options.keyword,
                                        search_session: trackSearchSession,
                                        search_key: trackSearchKey,
                                        data_type: 'Goods',
                                        data_id: item.goodsNo,
                                        index: index,
                                        data_info: {
                                            studentShopId: options.studentShopId,
                                            activityNo: options.activityNo,
                                            ...item
                                        },
                                        rank_type: sortField + '/' + sortType
                                    },
                                    clickData: {
                                        action: 13
                                    },
                                    exposureData: {
                                        action: 12
                                    }
                                }"
                            >
                                <goods-item
                                    :goods="item"
                                    :options="options"
                                />
                            </track-view>
                        </view>
                    </grid-view>
                </view>
                <view class="tail-text">-到底了-</view>
            </template>
        </view>
    </view>
</template>

<style scoped lang="scss">
.page {
    min-height: 100vh;
    padding-bottom: calc(env(safe-area-inset-bottom));
    background-color: #f5f8fa;
}
.sortbar {
    position: fixed;
    z-index: 99;
}
.filter-text {
    color: #8a9399;
    font-size: 28rpx;
}
.empty {
    width: 378rpx;
    height: 90rpx;
    margin-top: -100rpx;
    text-align: center;
    color: #576066;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 44rpx;
}
.return-btn {
    :deep(button) {
        height: 80rpx;
        margin-top: 40rpx;
        font-size: 28rpx;
        line-height: 80rpx;
    }
}
.list-wrapper {
    padding: 20rpx;
    box-sizing: border-box;
}
.tail-text {
    text-align: center;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
}
</style>
