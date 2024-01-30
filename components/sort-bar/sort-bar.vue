<script setup lang="ts">
import { ref } from 'vue';

import type { ISortConfig, IStyleConfig } from './types';

const props = defineProps<{
    config: Array<ISortConfig>;
    theme: IStyleConfig;
    indicatorType: number;
    itemFull: Boolean;
}>();

const sortField = ref('');
const sortType = ref('');
const sortConfig = ref<Array<ISortConfig>>([]);
const sortTitle = ref('');
sortConfig.value = props.config || [];
const getCurrColor = (item: ISortConfig, type?: string) => {
    if (sortField.value == item.sortField && type == sortType.value) {
        return props.theme.textActiveColor || 'rgba(44, 44, 44, 1)';
    } else {
        return props.theme.textColor || 'rgba(96, 105, 114, 1)';
    }
};

const changeSort = (item: ISortConfig) => {
    if (item.sortField == sortField.value) {
        if (item.sortRank && sortType.value == 'asc') {
            sortType.value = 'desc';
        } else {
            sortType.value = sortConfig.value[0].sortType;
            sortField.value = sortConfig.value[0].sortField;
        }
    } else {
        sortType.value = item.sortType;
        sortField.value = item.sortField;
    }

    sortTitle.value = item.sortTitle;
    fnSuccess();
};

const fnSuccess = () => {
    emit('change', {
        sortField: sortField.value,
        sortType: sortType.value,
        sortTitle: sortTitle.value
    });
};
const fnStop = (e: any) => {
    e && e.stopPropagation();
};

const emit = defineEmits(['change']);
</script>

<template>
    <view
        class="sort-bar-wrap"
        :style="{
            borderRadius: props.theme.borderRadius || 0,
            backgroundColor: props.theme.backgroundColor,
            '--textColor': props.theme.textColor || 'rgba(96, 105, 114, 1)',
            '--textColorActive': props.theme.textActiveColor || 'rgba(44, 44, 44, 1)'
        }"
        @touchmove.stop="fnStop"
    >
        <view class="sort-bar-seat">
            <view class="sort-bar">
                <view
                    v-for="(item, index) in sortConfig"
                    :key="index"
                    class="sort-unit"
                    :class="{ 'sort-unit-full': itemFull }"
                    @tap="changeSort(item)"
                >
                    <view
                        v-if="props.indicatorType == 2"
                        class="sort-unit-bg"
                        :class="{ 'sort-unit-bg-active': sortField == item.sortField }"
                        :style="{ backgroundImage: props.theme.barBackgroundImage }"
                    ></view>
                    <view class="sort-unit-title">
                        <text
                            class="sort-unit-text"
                            :class="{ 'sort-unit-active': sortField == item.sortField }"
                            :style="{ color: getCurrColor(item, item.sortType) }"
                            >{{ item.sortTitle }}</text
                        >
                        <view
                            v-if="props.indicatorType == 1"
                            class="sort-unit-line"
                            :class="{ 'sort-unit-line-show': sortField == item.sortField }"
                            :style="{ background: getCurrColor(item, item.sortType) }"
                        ></view>
                    </view>

                    <view
                        v-if="item.sortRank"
                        class="sort-type"
                    >
                        <text
                            class="zdfont zdmp-shengxu"
                            :class="{ active: sortField == item.sortField && sortType == 'asc' }"
                            :style="{
                                color:
                                    sortField == item.sortField && sortType == 'asc'
                                        ? props.theme.textActiveColor
                                        : props.theme.textColor
                            }"
                        ></text>
                        <text
                            class="zdfont zdmp-jiangxu"
                            :class="{ active: sortField == item.sortField && sortType == 'desc' }"
                            :style="{
                                color:
                                    sortField == item.sortField && sortType == 'desc'
                                        ? props.theme.textActiveColor
                                        : props.theme.textColor
                            }"
                        ></text>
                    </view>
                </view>

                <view
                    v-if="$slots.right"
                    class="sort-unit"
                >
                    <slot name="right" />
                </view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
$text-color: var(--textColor);
$text-color-active: var(--textColorActive);
.sort-bar-wrap {
    position: relative;
    z-index: 80;
}
.sort-bar-seat {
    height: 76rpx;
}
.sort-bar {
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    flex-direction: row;
}
.sort-fixed {
    position: fixed;
    left: 0;
}
.sort-unit {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 168rpx;
    height: 76rpx;
    flex-direction: row;
}
.sort-unit-full {
    flex: 1;
}
.sort-unit-bg {
    position: absolute;
    top: 46rpx;
    left: 74rpx;
    width: 0;
    height: 16rpx;
    border-radius: 6rpx;
    &-active {
        width: 50rpx;
    }
}
.sort-unit-title {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 76rpx;
    flex-direction: column;
}
.sort-unit-line {
    width: 0rpx;
    height: 4rpx;
    border-radius: 4rpx;
    background-color: $text-color;
    transition: width ease 0.2s;
    &-show {
        width: 20rpx;
    }
}
.sort-unit-text {
    position: relative;
    color: $text-color;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 40rpx;
}
.sort-unit-active {
    color: $text-color-active;
    font-weight: 600;
}
.sort-type {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 10rpx;
    &-active {
        color: $text-color-active;
        font-weight: 600;
    }
}
.zdmp-shengxu,
.zdmp-jiangxu {
    color: #8a9399;
    font-size: 12rpx;
    font-weight: 400;
    line-height: 12rpx;
}

.more-filter {
    width: 750rpx;
}
.filter-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 750rpx;
    height: 2000px;
    background-color: rgba(0, 0, 0, 0.8);
}
.filter-wrap {
    position: relative;
    padding: 30rpx 40rpx;
    background-color: #fff;
}
.title {
    color: rgba(136, 144, 156, 1);
    font-size: 28rpx;
    line-height: 40px;
}
.price-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30rpx;
    flex-direction: row;
    flex-wrap: wrap;
}
.price-selector-item {
    height: 64rpx;
    padding: 0 30rpx;
    border-radius: 32rpx;
    color: rgba(63, 69, 75, 1);
    font-size: 28rpx;
    background-color: rgba(244, 244, 244, 1);
    line-height: 64rpx;
}
.price-selector-item-active {
    color: #fff;
    background-color: #20a0ff;
}
.price-choose {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 30rpx;
}
.splider {
    width: 18rpx;
    height: 1px;
    margin: 0 26rpx;
    background-color: rgba(136, 144, 156, 1);
}
.price-input {
    justify-content: center;
    align-items: center;
    height: 64rpx;
    padding: 0 30rpx;
    border-radius: 32rpx;
    color: rgba(63, 69, 75, 1);
    font-size: 28rpx;
    background-color: rgba(244, 244, 244, 1);
    flex: 1;
    line-height: 64rpx;
    flex-direction: row;
}
.price-input-inner {
    text-align: center;
    font-size: 28rpx;
    flex: 1;
    line-height: 40rpx;
}
.sort-btn {
    width: 176rpx;
    border-radius: 32rpx;
    text-align: center;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    background: #f95b56;
    line-height: 60rpx;
    &-plain {
        margin-right: 50rpx;
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: rgba(102, 102, 102, 1);
        background: #ffffff;
    }
}
.sort-btn:active {
    background-color: rgba(32, 160, 255, 0.7);
}

.full {
    width: 750rpx;
    height: 1000rpx;
    background-color: rgba(0, 0, 0, 0.8);
}
.more-filter {
    z-index: 100;
    flex-direction: column;
    justify-content: flex-start;
}
.top-fixed {
    z-index: 100;
    opacity: 1;
}
.brand-choose {
    flex-direction: row;
    flex-wrap: wrap;
    width: 720rpx;
    margin-bottom: 48rpx;
}
.brand-unit {
    margin-right: 22rpx;
    margin-bottom: 24rpx;
    padding: 0 24rpx;
    border-radius: 68rpx;
    color: #3f454b;
    font-size: 28rpx;
    font-weight: 400;
    background: rgba(0, 0, 0, 0.04);
    line-height: 56rpx;
    &-active {
        color: rgba(249, 91, 86, 1);
        background-color: rgba(249, 91, 86, 0.2);
    }
}
.btn-wrap {
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 120rpx;
    border-top: 1px solid rgba(246, 247, 248, 1);
    flex-direction: row;
}
</style>
