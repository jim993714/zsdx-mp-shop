<script setup lang="ts">
import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
}>();
</script>
<template>
    <view class="atmosphere-wrap">
        <image
            class="atmosphere-bg"
            src="https://cdn.zsdx.cn/mp-cs/images/shop/detail/student-price-bg.png"
            mode="scaleToFill"
        />
        <view class="atmosphere-main">
            <view class="atmosphere-center">
                <view
                    v-if="goodsDetail?.goodsShowOriginPrice === goodsDetail?.goodsShowPrice"
                    class="price-title"
                    >学生价</view
                >
                <zd-price
                    :value="goodsDetail?.goodsShowOriginPrice || 0"
                    color="#fff"
                    :font-size-unit="24"
                    :font-size-large="48"
                    :font-size-small="32"
                />
            </view>
            <view
                v-if="goodsDetail?.goodsShowOriginPrice !== goodsDetail?.goodsShowPrice"
                class="atmosphere-right"
            >
                <view class="price-title">学生价</view>
                <zd-price
                    :value="goodsDetail?.goodsShowPrice || 0"
                    color="#ff4734"
                    :font-size-unit="20"
                    :font-size-large="32"
                    :font-size-small="24"
                />
            </view>
        </view>
        <view class="atmosphere-end"></view>
    </view>
</template>
<style lang="scss" scoped>
.atmosphere-wrap {
    position: relative;
    z-index: 0;
    width: 710rpx;
    height: 140rpx;
    margin: 20rpx 20rpx -52rpx;
    padding: 0 20rpx 32rpx;
    box-sizing: border-box;
}
.atmosphere-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 24rpx;
    background: linear-gradient(135deg, #ff8f40 0%, #ff4734 100%);
}
.atmosphere-main {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    flex-direction: row;

    .atmosphere-top {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        //         <view class="red-tag">库存20件</view>
        .flash-sale-tag {
            padding: 0 8rpx;
            border-radius: 4rpx;
            color: #ff4734;
            font-size: 20rpx;
            font-weight: 400;
            background: #ffffff;
            line-height: 28rpx;
        }
        .red-tag {
            margin-left: 8rpx;
            padding: 0 8rpx;
            border-radius: 16rpx;
            color: #ffffff;
            font-size: 20rpx;
            background: rgba(0, 0, 0, 0.2);
            line-height: 28rpx;
            line-height: 20px;
        }
    }
    .price-title {
        margin-right: 4rpx;
        color: #ffffff;
        font-size: 20rpx;
        line-height: 20rpx;
    }
    .price-origin {
        margin-left: 4rpx;
        text-decoration: line-through;
        color: #ffffff;
        font-size: 20rpx;
        line-height: 20rpx;
    }
    .atmosphere-center {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        flex-direction: row;
    }

    .atmosphere-right {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        height: 40rpx;
        margin-top: 4rpx;
        margin-left: 10rpx;
        padding: 0 14rpx;
        padding-bottom: 8rpx;
        border-radius: 21px;
        background: #ffffff;
        box-sizing: border-box;
        flex-direction: row;
        .price-title {
            margin-right: 4rpx;
            color: #ff4734;
            font-size: 20rpx;
            font-weight: 600;
            line-height: 20rpx;
        }
    }
}
.atmosphere-end {
    position: absolute;
    top: 0;
    right: 20rpx;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    padding-bottom: 20rpx;
    flex-direction: column;
    box-sizing: border-box;
    .atmosphere-end-title {
        margin-bottom: 12rpx;
        color: #ffffff;
        font-size: 24rpx;
        line-height: 1;
    }
}
</style>
