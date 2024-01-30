<script setup lang="ts">
import dayjs from 'dayjs';

import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
}>();
const emit = defineEmits(['timeup']);
const now = ref(dayjs().valueOf());
const remainTime = computed(() => {
    if (props.goodsDetail?.activityInfo?.activityStatus === 0) {
        return (props.goodsDetail?.activityInfo.activityStartTime - now.value) / 1000;
    } else if (props.goodsDetail?.activityInfo?.activityStatus === 1) {
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
            :src="
                goodsDetail?.activityInfo?.goodsBanner ||
                'https://cdn.zsdx.cn/student-app/images/mall/agent-shop/subsidy-banner.png'
            "
            mode="scaleToFill"
        />
        <view class="atmosphere-main">
            <view class="atmosphere-center">
                <zd-price
                    :value="goodsDetail?.activityInfo?.activityPrice || 0"
                    color="#fff"
                    :font-size-unit="24"
                    :font-size-large="48"
                    :font-size-small="32"
                />
                <view
                    v-if="
                        goodsDetail?.activityInfo?.activitySubsidy &&
                        goodsDetail?.activityInfo.activitySubsidy > 0
                    "
                    class="price-activity-tag"
                    >官方补贴¥{{ goodsDetail?.activityInfo.activitySubsidy }}</view
                >
            </view>
            <view class="atmosphere-bottom">
                <view class="price-title">原价</view>
                <view
                    class="price-origin"
                    :class="{
                        'price-origin-through': goodsDetail?.activityInfo?.activityStatus === 1
                    }"
                    >¥{{ goodsDetail?.goodsShowOriginPrice }}</view
                >
            </view>
        </view>
        <view class="atmosphere-end">
            <view
                v-if="goodsDetail?.activityInfo?.activityStatus == 0"
                class="atmosphere-end-title"
                >距开始</view
            >
            <view
                v-else
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
        &-through {
            text-decoration: line-through;
        }
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
            padding: 0 10rpx 0 32rpx;
            border-radius: 4rpx;
            color: rgba(255, 53, 0, 1);
            font-size: 24rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            line-height: 40rpx;
            background-image: url(https://cdn.zsdx.cn/mp-cs/images/shop/detail/pop-bg.png);
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
        color: #ffffff;
        font-size: 24rpx;
        line-height: 1;
    }
}
</style>
