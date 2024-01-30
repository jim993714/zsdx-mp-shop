<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import dayjs from 'dayjs';

import type { SeckillItem } from '../../types';

const props = defineProps<{
    list: SeckillItem[];
    modelValue: number;
}>();
const emit = defineEmits(['update:modelValue']);
const activeIndex = useVModel(props, 'modelValue', emit);

function statusFilter(startTime: number, endTime: number) {
    let date = new Date();
    let distStartDay = new Date(startTime * 1000);

    const currTime = dayjs().unix();

    if (currTime > endTime) {
        return '已结束';
    } else if (currTime < startTime && date.getDate() == distStartDay.getDate()) {
        //今天， 即将开始
        return '即将开始';
    } else if (currTime < startTime && date.getDate() + 1 == distStartDay.getDate()) {
        // 明天
        return '明日预告';
    } else if (currTime < startTime) {
        return dayjs(endTime * 1000).format('MM/dd');
    } else {
        return '疯抢中';
    }
}
</script>

<template>
    <view class="seckill-time">
        <view
            v-for="(item, index) in props.list"
            :key="item.time_no"
            class="time-item"
            :class="{ active: activeIndex === index }"
            @tap.stop="activeIndex = index"
        >
            <view class="text">
                {{ dayjs(item.start_time).format('HH:mm') }}
            </view>
            <view class="status">
                {{ statusFilter(item.start_time, item.end_time) }}
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.seckill-time {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24rpx 0 30rpx;
    gap: 20rpx;
}
.time-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150rpx;
    height: 74rpx;
    flex-direction: column;
    gap: 4rpx;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
    transition: color 0.3s;

    .text {
        font-size: 36rpx;
    }

    .status {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 34rpx;
        padding: 6rpx 16rpx;
        border-radius: 17rpx;
        font-size: 20rpx;
        line-height: 22rpx;
    }

    &.active {
        color: #ffffff;

        .status {
            background: rgba(255, 255, 255, 0.2);
        }
    }
}
</style>
