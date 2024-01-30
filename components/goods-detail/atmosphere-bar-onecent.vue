<script setup lang="ts">
import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
}>();
const money = ref(100000);
const showDay = computed((): boolean => {
    return money.value > 60 * 60 * 24;
});
</script>
<template>
    <view class="atmosphere-wrap">
        <image
            class="atmosphere-bg"
            src="https://cdn.zsdx.cn/mp-cs/images/activity/one-cent-purchase/detail-bg.png"
            mode="scaleToFill"
        />
        <view class="atmosphere-main">
            <view class="atmosphere-center">
                <view class="price-title"> 补贴价 </view>
                <zd-price
                    :value="goodsDetail?.activityInfo?.activityPrice || 0"
                    color="#fff"
                    :font-size-unit="24"
                    :font-size-large="48"
                    :font-size-small="32"
                />
                <view
                    v-if="goodsDetail?.activityInfo && goodsDetail.activityInfo.activitySubsidy > 0"
                    class="price-activity-tag"
                >
                    已补贴{{ goodsDetail.activityInfo?.activitySubsidy }}元
                </view>
            </view>
            <view class="atmosphere-bottom">
                <view class="price-title"> 学生价 </view>
                <view class="price-origin"
                    >¥{{ goodsDetail?.activityInfo?.activityPriceOrigin }}</view
                >
            </view>
        </view>
        <view class="atmosphere-end"> </view>
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
    justify-content: center;
    align-items: stretch;
    width: 100%;
    height: 100%;
    flex-direction: column;
    .atmosphere-top {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;

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
        .price-activity-tag {
            position: relative;
            height: 40rpx;
            margin-left: 24rpx;
            padding: 0 16rpx;
            border-radius: 4rpx;
            border-radius: 20rpx;
            color: #fff;
            font-size: 24rpx;
            box-shadow: inset 0 0 12rpx #fff;
            line-height: 40rpx;
            border-bottom-left-radius: 0;
        }
    }

    .atmosphere-bottom {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        flex-direction: row;
        margin-top: 8rpx;
        opacity: 0.7;
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
