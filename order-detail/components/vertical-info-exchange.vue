<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { ResponseOrder11 } from '../../api/order/types';

const props = defineProps<{
    info?: ResponseOrder11;
}>();

const fnCopy = () => {
    let content = '链接：' + props.info?.exchangeUrl + '\n' + props.info?.exchangeCode;
    uni.setClipboardData({
        data: content,
        success: () => {
            uni.showToast({
                title: '复制成功',
                icon: 'none'
            });
        }
    });
};
const fnExchange = () => {
    router.push('webview', {
        url: props.info?.exchangeUrl
    });
};
</script>
<template>
    <view class="container">
        <view class="info-head">
            <view class="info-title">发货信息</view>
            <view
                class="info-btn"
                @tap="fnCopy"
                >复制</view
            >
        </view>
        <view
            v-if="info?.exchangeUrl"
            class="info-line"
        >
            <view class="info-line-value ellipsis">链接: {{ info?.exchangeUrl }}</view>
        </view>
        <view class="info-line">
            <view class="info-line-value ellipsis">{{ info?.exchangeCode }}</view>
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
.info-head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20rpx;
    .info-title {
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 32rpx;
        flex: 1;
    }
    .info-btn {
        height: 40rpx;
        padding: 0 20rpx;
        border: 1px solid $uni-color-primary;
        border-radius: 26rpx;
        color: $uni-color-primary;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24px;
    }
}
.info-line {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 36rpx;
    &-value {
        color: $uni-text-color;
    }
}
</style>
