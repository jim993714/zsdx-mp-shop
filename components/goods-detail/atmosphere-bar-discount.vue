<script setup lang="ts">
import dayjs from 'dayjs';

import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
}>();
const emit = defineEmits(['timeup']);
const now = ref(dayjs().valueOf());
const remainTime = computed(() => {
    if (props.goodsDetail?.activityInfo?.activityStatus === 1) {
        return (props.goodsDetail?.activityInfo.activityStartTime - now.value) / 1000;
    } else if (props.goodsDetail?.activityInfo?.activityStatus === 2) {
        return (props.goodsDetail?.activityInfo.activityEndTime - now.value) / 1000;
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
            src="https://cdn.zsdx.cn/student-app/images/mall/agent-shop/subsidy-banner.png"
            mode="scaleToFill"
        />
        <view class="atmosphere-main">
            <view class="atmosphere-center">
                <view
                    v-if="goodsDetail?.discount && goodsDetail?.discount > 0"
                    class="price-title"
                    >活动价</view
                >
                <view
                    v-else-if="goodsDetail?.goodsShowPriceType === 2"
                    class="price-title"
                    >学生价</view
                >
                <zd-price
                    :value="goodsDetail?.activityInfo?.activityPrice || 0"
                    color="#fff"
                    :font-size-unit="24"
                    :font-size-large="48"
                    :font-size-small="32"
                />
                <view class="price-activity-tag-left"></view>
                <view
                    v-if="goodsDetail?.discount && goodsDetail?.discount > 0"
                    class="price-activity-tag"
                >
                    {{ goodsDetail?.discount }}折钜惠
                </view>
            </view>
            <view class="atmosphere-bottom">
                <!-- <view
                    v-if="
                        goodsDetail?.discount &&
                        goodsDetail?.discount > 0 &&
                        goodsDetail?.goodsShowPriceType === 2
                    "
                    class="price-title"
                    >学生价</view
                >
                <view
                    v-else
                    class="price-title"
                    >原价</view
                > -->
                <view
                    class="price-origin"
                    :class="{ through: goodsDetail?.activityInfo?.activityStatus === 2 }"
                    >¥{{
                        goodsDetail?.activityInfo?.activityStatus === 2
                            ? goodsDetail?.goodsShowOriginPrice
                            : goodsDetail?.goodsShowPrice
                    }}</view
                >
            </view>
        </view>
        <view
            v-if="
                goodsDetail?.activityInfo?.activityStatus === 3 ||
                goodsDetail?.activityInfo?.activityStatus === -2
            "
            class="atmosphere-end-tag"
            >活动已结束</view
        >
        <view
            v-else
            class="atmosphere-end"
        >
            <view
                v-if="goodsDetail?.activityInfo?.activityStatus === 1 && remainTime > 0"
                class="atmosphere-end-title"
                >距开始</view
            >
            <view
                v-else-if="goodsDetail?.activityInfo?.activityStatus === 2 && remainTime > 0"
                class="atmosphere-end-title"
                >距结束</view
            >
            <uni-countdown
                v-if="remainTime > 0"
                :font-size="12"
                :font-weight="500"
                :second="remainTime"
                splitor-color="#fff"
                color="#FF4734"
                :show-day="showDay"
                background-color="#FFFFFF"
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
        margin-left: 4rpx;
        color: #ffffff;
        font-size: 20rpx;
        line-height: 20rpx;
        &.through {
            text-decoration: line-through;
        }
    }
    .atmosphere-center {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        flex-direction: row;
        padding-bottom: 6rpx;
        .price-activity-tag {
            position: relative;
            height: 40rpx;
            padding: 0 10rpx 0 20rpx;
            border-radius: 0 4rpx 4rpx 0;
            color: #ff8026;
            font-size: 24rpx;
            background: #ffffff;
            line-height: 40rpx;
            &-left {
                position: relative;
                overflow: hidden;
                width: 30rpx;
                height: 40rpx;
                margin-right: -1rpx;
                margin-left: 16rpx;
                &::before {
                    position: absolute;
                    top: 0rpx;
                    left: 10rpx;
                    width: 40rpx;
                    height: 40rpx;
                    border-radius: 8rpx;
                    background-color: #fff;
                    content: '';
                    transform: rotate(-45deg) translate(0, 0);
                }
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
.atmosphere-end-tag {
    position: absolute;
    top: 40rpx;
    right: 0;
    margin-bottom: 20rpx;
    padding: 0 20rpx;
    border-radius: 24rpx 0 0 24rpx;
    color: #ffffff;
    font-size: 24rpx;
    background-color: rgba(238, 128, 101, 1);
    line-height: 40rpx;
}
</style>
