<script setup lang="ts">
import type { FilterItem } from '../types';
import filterPopup from './filter-popup.vue';

const filterPopRef = ref();
const keyword = ref('');
const filterData = ref<FilterItem>();
const emit = defineEmits(['search']);
const openFilter = () => {
    filterPopRef.value.open();
};
const fnChangeFilter = (filterItem: FilterItem) => {
    console.log(filterItem);
    filterData.value = filterItem;
    fnSearch();
};
const fnSearch = () => {
    emit('search', {
        keyword: keyword.value,
        startTime: filterData.value?.startTime,
        endTime: filterData.value?.endTime
    });
};
</script>
<template>
    <view class="search-bar">
        <view class="input-bar">
            <zd-icon
                type="zdmp-sousuo1"
                :size="40"
                color="#8A9399"
            />
            <input
                v-model.trim="keyword"
                class="zd-search-input"
                placeholder-class="zd-search-input-placeholder"
                type="text"
                placeholder="输入商品的名称/订单编号"
                confirm-type="search"
                @confirm="fnSearch"
            />
        </view>
        <view
            class="filter-btn"
            @tap="openFilter()"
        >
            <zd-icon
                type="zdmp-shaixuan"
                :size="40"
                color="rgba(41, 47, 51, 1)"
            />
        </view>
    </view>
    <filterPopup
        ref="filterPopRef"
        :top="84"
        @change="fnChangeFilter"
    />
</template>

<style lang="scss" scoped>
.search-bar {
    position: relative;
    z-index: 120;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 750rpx;
    height: 84rpx;
    background-color: #fff;
    flex-direction: row;
    .input-bar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 0 0 0 20rpx;
        padding: 0 20rpx;
        border: 1px solid $zd-main-color;
        border-radius: 32rpx;
        flex: 1;
        box-sizing: border-box;
        flex-direction: row;
    }
    .zd-search-icon {
        display: inline-block;
    }
    .zd-search-input {
        height: 64rpx;
        padding-left: 20rpx;
        color: $uni-text-color;
        font-size: 28rpx;
        flex: 1;
        line-height: 64rpx;
        box-sizing: border-box;
    }
    .zd-search-input-placeholder {
        color: $uni-text-color-grey;
        font-size: 28rpx;
        line-height: 64rpx;
    }
}

.filter-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 84rpx;
    flex-direction: row;
}
</style>
