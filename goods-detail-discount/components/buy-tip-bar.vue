<script setup lang="ts">
import dayjs from 'dayjs';

import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
}>();
const now = ref(dayjs().valueOf());
const remainTime = computed(() => {
    if (props.goodsDetail?.activityInfo?.activityStatus === 1) {
        return (props.goodsDetail?.activityInfo.activityStartTime - now.value) / 1000;
    }
    // 只有未开始展示倒计时
    // else if (props.goodsDetail?.activityInfo?.activityStatus === 2) {
    //     return (props.goodsDetail?.activityInfo.activityEndTime - now.value) / 1000;
    // }
    return -1;
});
const showDay = computed((): boolean => {
    return remainTime.value > 60 * 60 * 24;
});
</script>
<template>
    <view
        v-if="remainTime > 0"
        class="tip-bar-seat savepadding"
    ></view>
    <view
        v-if="remainTime > 0"
        class="tip-bar savebottom"
    >
        <view class="tip-title">活动价购买</view>
        <view class="tip-status">
            <uni-countdown
                v-if="remainTime > 0"
                :font-size="12"
                :font-weight="500"
                :second="remainTime"
                splitor-color="#fff"
                color="#fff"
                :show-day="showDay"
                background-color="rgba(255,255,255,0.13)"
                border-color="rgba(255,255,255,0.13)"
            />
            <view
                v-if="goodsDetail?.activityInfo?.activityStatus === 2"
                class="time-type"
                >后结束</view
            >
            <view
                v-else
                class="time-type"
                >后开始</view
            >
        </view>
    </view>
</template>
<style lang="scss" scoped>
.tip-bar-seat {
    height: 110rpx;
}
.tip-bar {
    position: fixed;
    left: 20rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 710rpx;
    height: 96rpx;
    margin-bottom: 120rpx;
    padding: 0 14rpx;
    border-radius: 4rpx;
    border-radius: 96rpx;
    background: rgba(0, 0, 0, 0.6);
    flex-direction: row;
    box-sizing: border-box;
}
.tip-title {
    text-align: center;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    flex: 1;
    line-height: 40px;
}
.tip-status {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 72rpx;
    padding: 0 36rpx;
    background-image: linear-gradient(to right, #4bd97b, #2ca9d4);
    flex-direction: row;
    border-radius: 36rpx;
}
.time-type {
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
}
</style>
