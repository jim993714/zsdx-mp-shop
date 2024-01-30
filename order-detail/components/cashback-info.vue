<script setup lang="ts">
import dayjs from 'dayjs';

import type { OrderDetailResp } from '../../api/order/types';

const props = defineProps<{
    orderDetail: OrderDetailResp;
}>();
const filterTime = (value: any) => {
    if (!value) {
        return '--';
    }
    return dayjs(+value).format('YYYY-MM-DD HH:mm:ss');
};
</script>
<template>
    <view class="container">
        <view class="module-title">退款信息</view>
        <view class="module-sub-title"
            >现金已退回到原支付账户，优惠金额退款请在「我的-红包卡券」中查看</view
        >
        <view class="order-line">
            <view class="order-line-title">退款金额</view>
            <view class="order-line-value"
                ><zd-price
                    :value="orderDetail?.refundMoney || 0"
                    :font-size-large="40"
                    :font-size-small="28"
                    :font-size-unit="20"
                    color="rgba(255, 71, 52, 1)"
                ></zd-price
            ></view>
        </view>
        <view class="order-line">
            <view class="order-line-title">退款时间</view>
            <view class="order-line-value">{{ filterTime(orderDetail?.refundTime) }}</view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    width: 710rpx;
    margin: 20rpx 20rpx 0;
    padding: 30rpx 24rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
}
.module-title {
    padding-bottom: 16rpx;
    color: $uni-text-color;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 32rpx;
}
.module-sub-title {
    padding-bottom: 8rpx;
    color: #8a9399;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 24rpx;
}
.order-line {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-top: 16rpx;
    color: $uni-text-color;
    font-size: 24rpx;
    line-height: 40rpx;
    &-title {
        width: 300rpx;
        min-width: 130rpx;
        color: $uni-text-color;
        font-size: 24rpx;
        flex: 1;
        line-height: 40rpx;
        flex-shrink: 0;
    }
    &-value {
        color: $uni-text-color;
        font-size: 24rpx;
        line-height: 40rpx;
    }
}
</style>
