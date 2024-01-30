<script setup lang="ts">
import dayjs from 'dayjs';

import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
}>();
const emit = defineEmits(['timeup']);
const now = ref(dayjs().valueOf());
const remainTime = computed(() => {
    if (props.goodsDetail?.saleStartTime && now.value < props.goodsDetail?.saleStartTime) {
        return (props.goodsDetail?.saleStartTime - now.value) / 1000;
    } else if (props.goodsDetail?.saleEndTime && now.value < props.goodsDetail?.saleEndTime) {
        return (props.goodsDetail?.saleEndTime - now.value) / 1000;
    }
    return -1;
});
const showDay = computed((): boolean => {
    return remainTime.value > 60 * 60 * 24;
});
const fnTimeup = () => {
    now.value = dayjs().valueOf();
    setTimeout(() => {
        emit('timeup');
    }, 1000);
};
</script>
<template>
    <view class="atmosphere-wrap">
        <image
            class="atmosphere-bg"
            src="https://cdn.zsdx.cn/mp-cs/images/shop/seckill/banner.png?v=1"
            mode="scaleToFill"
        />
        <view class="atmosphere-main">
            <view class="atmosphere-top">
                <view class="price-title">秒杀价</view>
                <view class="goods-sale-num">库存{{ goodsDetail?.goodsNum }}件</view>
            </view>
            <view class="atmosphere-center">
                <zd-price
                    :value="goodsDetail?.goodsPricePay || 0"
                    color="#fff"
                    :font-size-unit="24"
                    :font-size-large="48"
                    :font-size-small="32"
                />
                <view class="price-origin price-origin-through"
                    >￥{{ goodsDetail?.goodsPriceOrigin }}</view
                >
            </view>
        </view>
        <view class="atmosphere-end">
            <view
                v-if="
                    goodsDetail?.status === 3 ||
                    (goodsDetail?.saleEndTime && now > goodsDetail?.saleEndTime)
                "
                class="atmosphere-end-title disabled"
                >该场次已结束</view
            >
            <view
                v-if="
                    goodsDetail?.goodsNum &&
                    goodsDetail?.goodsSale &&
                    goodsDetail.goodsNum <= goodsDetail.goodsSale
                "
                class="atmosphere-end-title"
                >该产品已售罄</view
            >
            <view
                v-else-if="goodsDetail?.saleStartTime && goodsDetail?.saleStartTime > now"
                class="atmosphere-end-title"
                >距开始</view
            >
            <view
                v-else-if="goodsDetail?.saleEndTime && goodsDetail?.saleEndTime > now"
                class="atmosphere-end-title"
                >距结束</view
            >

            <uni-countdown
                v-if="remainTime > 0"
                :font-size="12"
                :second="remainTime"
                splitor-color="#fff"
                color="#FF4734"
                :show-day="showDay"
                background-color="#FFF9E6"
                border-color="#fff"
                @timeup="fnTimeup"
            />
        </view>
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
        margin-left: 10rpx;
        color: #ffffff;
        font-size: 20rpx;
        line-height: 20rpx;
        &-through {
            text-decoration: line-through;
        }
    }
    .atmosphere-top {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        margin-bottom: 8rpx;
    }
    .price-title {
        margin-right: 4rpx;
        padding: 0 8rpx;
        border-radius: 4rpx;
        color: $zd-color-red;
        font-size: 20rpx;
        background: #ffffff;
        line-height: 28rpx;
    }
    .goods-sale-num {
        margin-left: 10rpx;
        padding: 0 8rpx;
        border-radius: 16rpx;
        color: #ffffff;
        font-size: 20rpx;
        background: rgba(0, 0, 0, 0.2);
        line-height: 28rpx;
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
            padding: 0 10rpx 0 20rpx;
            border-radius: 4rpx;
            color: #ff8026;
            font-size: 24rpx;
            background: #ffffff;
            line-height: 40rpx;
            &::before {
                position: absolute;
                top: 5rpx;
                left: -14rpx;
                width: 30rpx;
                height: 30rpx;
                border-radius: 8rpx;
                background-color: #fff;
                content: '';
                transform: rotate(-45deg);
            }
            &::after {
                content: '';
                position: absolute;
                top: calc(50% - 3rpx);
                left: 0;
                width: 8rpx;
                height: 8rpx;
                border-radius: 100%;
                background-color: #ff8026;
            }
        }
    }

    .atmosphere-bottom {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        flex-direction: row;
        margin-top: 8rpx;
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
        color: #fff9e6;
        font-size: 24rpx;
        line-height: 1;
        &.disabled {
            margin-bottom: 0rpx;
            color: #fef9e8;
            font-size: 24rpx;
            line-height: 24px;
        }
    }
}
</style>
