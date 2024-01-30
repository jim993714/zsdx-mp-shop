<script setup lang="ts">
import dayjs from 'dayjs';

const props = withDefaults(
    defineProps<{
        item: any;
        checked: string[];
        keyName: string;
        type: string;
        disabled: boolean;
    }>(),
    {
        disabled: false
    }
);
const emit = defineEmits(['check']);
const filterLimit = (limit: number, limitType: number) => {
    switch (limitType) {
        case 0:
            return '无门槛';
        case 1:
            return `满${limit}元可用`;
        case 2:
            return `满${limit}件可用`;
        default:
            return '';
    }
};
const filterTitle = (type: string) => {
    switch (type) {
        case 'coupon':
            return '优惠券';
        case 'redPacket':
            return '红包';
        case 'studentShopRedPacket':
            return '社群红包';
        default:
            return '津贴';
    }
};
const filterTime = (time: number) => {
    return dayjs(time).format('YYYY.MM.DD');
};
const fnCheck = () => {
    emit('check');
};
</script>
<template>
    <view
        class="coupon-item"
        :class="{
            coupon: type === 'coupon',
            'red-packet': type === 'redPacket',
            'student-red-packet': type === 'studentShopRedPacket'
        }"
        @tap="fnCheck()"
    >
        <view class="coupon-head">
            <view
                v-if="item?.couponType === '2'"
                class="coupon-money"
            >
                <view class="bebas-neue-regular coupon-money-number">{{
                    +item?.discountNum || +item?.discountMoney
                }}</view>
                <view class="bebas-neue-regular coupon-money-unit">折</view>
            </view>
            <view
                v-else
                class="coupon-money"
            >
                <view class="bebas-neue-regular coupon-money-unit">¥</view>
                <view class="bebas-neue-regular coupon-money-number">{{
                    item?.discountNum || item?.discountMoney
                }}</view>
            </view>
            <view class="coupon-limit">{{
                filterLimit(item.discountLimit, item.discountLimitType)
            }}</view>
            <view class="coupon-type">{{ filterTitle(type) }}</view>
        </view>
        <view class="coupon-main">
            <view class="coupon-title ellipsis">
                {{ item.title }}
            </view>
            <view class="coupon-time"
                >有效期: {{ filterTime(item.useStartTime) }}
                -
                {{ filterTime(item.useEndTime) }}</view
            >
            <view
                v-if="+item.discountNumMax > 0"
                class="coupon-max"
                >最高可减{{ item.discountNumMax }}元</view
            >
            <zd-icon
                v-if="!disabled && checked.indexOf(item[keyName]) === -1"
                class="coupon-checkbox"
                type="zdmp-weigouxuanbeifen"
                :size="40"
                color="rgba(207, 207, 207, 1)"
            />
            <zd-icon
                v-else-if="!disabled"
                class="coupon-checkbox"
                type="zdmp-yigouxuan1"
                :size="40"
                color="rgba(25, 159, 255, 1)"
            />
            <view
                v-if="disabled"
                class="disable-title"
                >所结算的商品中没有符合的商品
            </view>
        </view>
        <view
            v-if="
                !disabled &&
                item.combineType === 1 &&
                checked.indexOf(item[keyName]) === -1 &&
                checked.length > 0
            "
            class="top-tag"
            >可叠加</view
        >
        <view
            v-else-if="!disabled && item.combineType === 0 && checked.indexOf(item[keyName]) === -1"
            class="bottom-tip"
            >此券不可和已选优惠叠加</view
        >
    </view>
</template>
<style lang="scss" scoped>
.coupon-item {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 710rpx;
    height: 176rpx;
    margin: 20rpx 20rpx 0;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    flex-direction: row;
    background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/allowance-bg.png);
    &.coupon {
        background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/coupon-bg.png);
    }
    &.red-packet {
        background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/package-bg.png);
    }
    &.student-red-packet {
        background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/packet-bg.png);
    }
}
.coupon-head {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 154rpx;
    height: 100%;
    margin-right: 20rpx;
    flex-direction: column;
}
.coupon-money {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: row;
    color: rgba(255, 71, 52, 1);
    &-unit {
        font-size: 32rpx;
        line-height: 32rpx;
    }
    &-number {
        font-size: 64rpx;
        line-height: 50rpx;
    }
}
.coupon-limit {
    margin-top: 10rpx;
    color: rgba(255, 71, 52, 1);
    font-size: 20rpx;
    font-weight: 400;
    line-height: 28rpx;
}
.coupon-type {
    height: 32rpx;
    margin-top: 10rpx;
    padding: 0 30rpx;
    border-radius: 16rpx;
    color: rgba(255, 255, 255, 0.9);
    font-size: 20rpx;
    background: rgba(255, 71, 52, 1);
    line-height: 32rpx;
}

.coupon-main {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    flex: 1;
    .coupon-title {
        color: #292f33;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 28rpx;
    }
    .coupon-time {
        margin-top: 24rpx;
        color: #8a9399;
        font-size: 24rpx;
        line-height: 28rpx;
    }
    .coupon-checkbox {
        position: absolute;
        top: 50%;
        right: 40rpx;
        transform: translateY(-50%);
    }
    .coupon-max {
        margin-top: 18rpx;
        color: #292f33;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 18rpx;
    }
}

.top-tag {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 8rpx;
    border-radius: 0px 12px 0px 12px;
    color: #fff;
    font-size: 24rpx;
    background: rgba(255, 71, 52, 1);
    line-height: 32rpx;
}

.bottom-tip {
    position: absolute;
    right: 16rpx;
    bottom: 16rpx;
    color: $uni-text-color-grey;
    font-size: 20rpx;
    line-height: 20rpx;
}
.disable-title {
    position: absolute;
    top: 50%;
    right: 40rpx;
    width: 146rpx;
    height: 56rpx;
    color: #8a9399;
    font-size: 20rpx;
    line-height: 28rpx;
    transform: translateY(-50%);
}
</style>
