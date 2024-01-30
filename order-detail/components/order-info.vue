<script setup lang="ts">
import dayjs from 'dayjs';

import type { OrderDetailResp } from '../../api/order/types';

const props = defineProps<{
    orderDetail: OrderDetailResp | undefined;
    orderNo: string;
}>();
const filterTime = (value: any) => {
    if (!value) {
        return '--';
    }
    return dayjs(+value).format('YYYY-MM-DD HH:mm:ss');
};
const fnCopyOrderNo = () => {
    uni.setClipboardData({
        data: props.orderNo,
        success: () => {
            uni.showToast({
                title: '复制成功',
                icon: 'none'
            });
        }
    });
};
</script>
<template>
    <view class="container">
        <view class="module-title">订单信息</view>

        <view class="order-line">
            <view class="order-line-title">订单编号</view>
            <view
                class="order-line-btn"
                @tap="fnCopyOrderNo"
            >
                <view class="order-line-btn-inner">复制</view>
            </view>
            <view class="order-line-value">{{ orderNo }}</view>
        </view>
        <view class="order-line">
            <view class="order-line-title">下单时间</view>
            <view class="order-line-value">{{ filterTime(orderDetail?.createTime) }}</view>
        </view>
        <view
            v-if="
                orderDetail?.tuanInfo &&
                orderDetail?.tuanInfo?.completeTime &&
                +orderDetail?.tuanInfo?.completeTime !== 0
            "
            class="order-line"
        >
            <view class="order-line-title">拼团时间</view>
            <view class="order-line-value">{{
                filterTime(orderDetail?.tuanInfo?.completeTime)
            }}</view>
        </view>
        <view
            v-if="orderDetail?.selfPayTime && +orderDetail?.selfPayTime > 0"
            class="order-line"
        >
            <view class="order-line-title">付款时间</view>
            <view class="order-line-value">{{ filterTime(orderDetail?.selfPayTime) }}</view>
        </view>
        <view
            v-if="orderDetail?.remark"
            class="order-line"
        >
            <view class="order-line-title">订单备注</view>
            <view class="order-line-value">{{ orderDetail?.remark }}</view>
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
    padding-bottom: 8rpx;
    color: $uni-text-color;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 32rpx;
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
    &-btn {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 40rpx;
        padding: 0 18rpx;
        flex-direction: row;
        &-inner {
            padding: 0 20rpx;
            border: 2rpx solid rgba(138, 147, 153, 0.3);
            border-radius: 18rpx;
            color: $uni-text-color;
            font-size: 20rpx;
            line-height: 30rpx;
        }
    }
}
</style>
