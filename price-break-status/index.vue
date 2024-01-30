<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view class="container">
        <template>
            <image
                class="status-icon"
                src="http://cdn.zsdx.cn/mp-cs/images/shop/order/status-sussess.png"
                mode="heightFix"
            ></image>
            <view class="status-text status-1">爆料信息提示成功</view>
            <view class="info-text"> 工作人员将在1~3个工作日内完成信息审核 </view>
            <zd-button
                class="btn submit-btn"
                type="primary"
                @tap="router.back()"
            >
                返回商品详情
            </zd-button>
        </template>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    height: 100%;
    height: 100%;
    padding-bottom: 50rpx;
    flex-direction: column;
    flex: 1;
}
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 200rpx;
}
.status-icon {
    width: 230rpx;
    height: 194rpx;
}
.status-text {
    margin-top: 40rpx;
    color: $zd-main-color;
    font-size: 32rpx;
    font-weight: 500;
    &.status-2 {
        color: $zd-color-red;
    }
}
.info-text {
    width: 522rpx;
    height: 132rpx;
    margin-top: 48rpx;
    margin-bottom: 80rpx;
    text-align: center;
    color: #999999;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 44rpx;
}
.btn {
    :deep(button) {
        width: 360rpx;
        height: 80rpx;
        border: none;
    }
}
</style>
