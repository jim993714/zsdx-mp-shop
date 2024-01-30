<script setup lang="ts">
import dayjs from 'dayjs';

import type { FilterItem } from '../types';

const popup = ref();
const props = defineProps<{
    top: number;
}>();
const selected = ref<number>();
let lastSelected: number | undefined = undefined;
const emit = defineEmits(['change']);
/**
 * 带选择列表
 */
const filterList = ref<FilterItem[]>([]);
const statusBarHeight = ref(0);
const popTop = computed(() => {
    const headerHeight = statusBarHeight.value + uni.upx2px(86 + props.top);
    return headerHeight;
});
const open = (filterData: FilterItem) => {
    // 每次开启自动设置上次确认的值
    selected.value = lastSelected;
    popup.value.open('top');
};
// const stop = (e: any) => {
//     e && e.stopPropagation();
// };
const close = () => {
    popup.value.close();
};
/**
 * 促使华筛选列表
 */
const initList = () => {
    const currTime = dayjs();

    let list: FilterItem[] = [];

    list.push({
        label: '1个月内',
        startTime: currTime.subtract(1, 'month').valueOf(),
        endTime: currTime.valueOf()
    });
    list.push({
        label: '3个月内',
        startTime: currTime.subtract(3, 'month').valueOf(),
        endTime: currTime.valueOf()
    });
    list.push({
        label: '6个月内',
        startTime: currTime.subtract(6, 'month').valueOf(),
        endTime: currTime.valueOf()
    });
    list.push({
        label: currTime.year() + '年',
        startTime: dayjs(currTime.year() + '/01/01').valueOf(),
        endTime: dayjs(currTime.year() + '/12/31 23:59:59').valueOf()
    });
    list.push({
        label: currTime.year() - 1 + '年',
        startTime: dayjs(currTime.year() - 1 + '/01/01').valueOf(),
        endTime: dayjs(currTime.year() - 1 + '/12/31 23:59:59').valueOf()
    });
    list.push({
        label: currTime.year() - 2 + '年',
        startTime: dayjs(currTime.year() - 2 + '/01/01').valueOf(),
        endTime: dayjs(currTime.year() - 2 + '/12/31 23:59:59').valueOf()
    });

    filterList.value = list;
};
const fnCheck = (index: number) => {
    lastSelected = selected.value;
    selected.value = index;
};
const fnReset = () => {
    selected.value = undefined;
};
const fnSubmit = () => {
    lastSelected = selected.value;
    emit('change', selected.value !== undefined ? filterList.value[selected.value] : undefined);
    close();
};
initList();
onMounted(() => {
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
});
defineExpose({
    open,
    close
});
</script>
<template>
    <uni-popup
        ref="popup"
        mask-background-color="rgba(0,0,0,0.6)"
    >
        <view
            class="filter-main"
            :style="{ paddingTop: popTop + 'px' }"
        >
            <view class="filter-title">按时间</view>
            <view class="filter-list">
                <view
                    v-for="(item, index) in filterList"
                    :key="index"
                    class="filter-item"
                    :class="{ active: selected === index }"
                    @tap="fnCheck(index)"
                    >{{ item.label }}</view
                >
            </view>
            <view class="filter-foot">
                <view
                    class="filter-foot-button"
                    @tap="fnReset"
                    >重置</view
                >
                <view
                    class="filter-foot-button primary"
                    @tap="fnSubmit"
                    >确定</view
                >
            </view>
        </view>
    </uni-popup>
</template>
<style lang="scss" scoped>
.filter-main {
    position: relative;
    z-index: 130;
    background-color: #fff;
}
.filter-body {
    background-color: #fff;
}

.filter-title {
    padding: 30rpx 20rpx;
    color: $uni-text-color;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 40rpx;
}
.filter-list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 750rpx;
    max-height: 500rpx;
    padding: 0 0 60rpx 20rpx;
    box-sizing: border-box;
    flex-direction: row;
    flex-wrap: wrap;
}

.filter-item {
    margin: 20rpx 20rpx 0 0;
    padding: 0 24rpx;
    border-radius: 30rpx;
    color: $uni-text-color;
    font-size: 28rpx;
    background: #f5f8fa;
    line-height: 60rpx;
    &.active {
        color: $uni-color-primary;
        background-color: rgba(25, 159, 255, 0.1);
    }
}

.filter-foot {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    width: 750rpx;
    height: 120rpx;
    padding: 0 40rpx;
    border-top: 1px solid rgba(237, 240, 242, 1);
    flex-direction: row;
    &-button {
        width: 320rpx;
        border: 2rpx solid $uni-text-color-disable;
        border-radius: 46rpx;
        text-align: center;
        color: $uni-text-color-grey;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 80rpx;
        &.primary {
            color: #fff;
            background-color: $zd-main-color;
        }
    }
}
</style>
