<script setup lang="ts">
import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
}>();

const timeOutStyle = {
    color: '#fff',
    fontSize: '24rpx',
    height: '28rpx',
    lineHeight: '28rpx',
    fontWeight: 600
};
const timeUnitStyle = {
    color: '#fff',
    fontSize: '24rpx',
    height: '28rpx',
    lineHeight: '28rpx',
    fontWeight: 600
};
const fnTimeup = () => {
    setTimeout(() => {
        emits('fnInit');
    }, 1000);
};
const getTime = () => {
    let date = Date.parse(new Date() + '');
    if (props.goodsDetail?.activityInfo?.schoolDumplingId) {
        return props.goodsDetail?.activityInfo?.expireTime
            ? (props.goodsDetail?.activityInfo?.expireTime - date) / 1000
            : 0;
    } else {
        return props.goodsDetail?.activityInfo?.activityEndTime
            ? (props.goodsDetail.activityInfo.activityEndTime - date) / 1000
            : 0;
    }
};

const emits = defineEmits(['fnInit']);
</script>
<template>
    <view class="atmosphere-wrap">
        <image
            class="atmosphere-bg"
            src="https://cdn.zsdx.cn/mp-cs/images/activity/campus-group/group-mood.png"
            mode="scaleToFill"
        />
        <view class="atmosphere-left">
            <view class="price-label">团购件</view>
            <zd-price
                :value="goodsDetail?.activityInfo?.activityPrice || 0"
                color="#ffffff"
                :font-size-large="48"
                :font-size-small="32"
                :font-size-unit="24"
            />
            <view class="price-origin">¥{{ goodsDetail?.activityInfo?.activityPriceOrigin }}</view>
        </view>
        <view class="atmosphere-right">
            <!--  v-if="goodsDetail?.activityInfo?.activityStatus === 1 && remainTime > 0" -->
            <view class="atmosphere-end-title">{{
                goodsDetail?.activityInfo?.schoolDumplingId ? '距团购结束' : '距结束'
            }}</view>
            <zd-timer-out
                :time="getTime()"
                :splider-style="timeOutStyle"
                :unit-type="1"
                :unit-style="timeUnitStyle"
                :show-second="true"
                :show-day="true"
                :zero="true"
                @time-end="fnTimeup()"
            ></zd-timer-out>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.atmosphere-wrap {
    position: relative;
    z-index: 0;
    display: flex;
    justify-content: space-between;
    width: 710rpx;
    height: 140rpx;
    margin: 20rpx 20rpx -56rpx;
    box-sizing: border-box;
    padding: 0rpx 10rpx 48rpx 20rpx;
    .atmosphere-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 710rpx;
        height: 140rpx;
    }
    .atmosphere-left {
        position: relative;
        display: flex;
        align-items: flex-end;
        margin-bottom: 16rpx;
        .price-label {
            margin-right: 8rpx;
            color: #ffffff;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;
        }
        .price-origin {
            margin-left: 12rpx;
            text-decoration: line-through;
            color: #ffffff;
            font-size: 20rpx;
            font-weight: 400;
        }
    }
    .atmosphere-right {
        position: relative;
        display: flex;
        align-items: center;
        margin-top: 68rpx;
        .atmosphere-end-title {
            margin-right: 8rpx;
            color: #ffffff;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }
}
</style>
