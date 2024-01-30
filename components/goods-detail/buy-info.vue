<script setup lang="ts">
import type { Coupon, GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    selectedProduct: string;
    goodsDetail: GoodsDetail;
    couponList: Coupon[];
}>();
const emit = defineEmits(['openSkuPop', 'openCouponPop']);
const shopDiscount = computed(() => {
    if (props.goodsDetail.goodsReductionMoney > 0 && props.goodsDetail.reductionInfo) {
        const unit = props.goodsDetail.reductionInfo?.reductionType == 1 ? '件' : '元';
        return props.goodsDetail.reductionInfo.list.reduce((result: string, item: any) => {
            result += `满${item.requireNum}${unit}减${item.reductionPrice}元`;
            return result;
        }, '');
    }
    return '';
});
const agentDiscount = computed(() => {
    if (props.goodsDetail?.activityType == 2 || props.goodsDetail?.gradient == 2) {
        switch (props.goodsDetail?.activityType) {
            case 2:
                return `第${props.goodsDetail?.otherExtend.goodsTh}件打${props.goodsDetail?.otherExtend.discount}折`;
            case 3:
                return `每满${props.goodsDetail?.otherExtend.fullMoney}元减${props.goodsDetail?.otherExtend.cut}元`;
            case 4:
                return `每满${props.goodsDetail?.otherExtend.goodsNum}件减${props.goodsDetail?.otherExtend.cut}元`;
        }
    } else if (props.goodsDetail?.activityType > 0) {
        return props.goodsDetail?.otherExtend?.slice(0, 3).reduce((result: string, item: any) => {
            switch (props.goodsDetail?.activityType) {
                case 1:
                    result += `满${item.goodsNum}件打${item.discount}折;`;
                    break;
                case 3:
                    result += `满${item.fullMoney}元减${item.cut}元;`;
                    break;
                case 4:
                    result += `满${item.goodsNum}件减${item.cut}元;`;
                    break;
            }
        }, '');
    }
    return '';
});

const openCouponPop = () => {
    emit('openCouponPop');
};

const openSkuPop = () => {
    emit('openSkuPop');
};
</script>
<template>
    <view class="main-wrap">
        <view
            class="line-wrap"
            @tap="openSkuPop()"
        >
            <view class="line-title">规格</view>
            <view class="line-main">
                <view
                    v-if="props.selectedProduct"
                    class="line-main-text ellipsis"
                >
                    {{ props.selectedProduct }}
                </view>
                <view
                    v-else
                    class="line-main-text"
                >
                    请选择规格
                </view>
            </view>
            <view class="line-tail">
                <zd-icon
                    type="zdmp-qianwang"
                    color="$uni-text-color"
                    :size="32"
                ></zd-icon>
            </view>
        </view>
        <view class="line-wrap">
            <view class="line-title">运费</view>
            <view class="line-main">
                <view
                    v-if="+goodsDetail.goodsFreight == 0"
                    class="line-main-text"
                    >免运费(请以提交订单时为准)</view
                >
                <view
                    v-else
                    class="line-main-text"
                >
                    {{ goodsDetail.goodsFreight }}
                </view>
            </view>
        </view>
        <view
            v-if="shopDiscount || (couponList && couponList.length > 0) || agentDiscount"
            class="line-wrap"
        >
            <view class="line-title">优惠</view>
            <view class="line-main">
                <!-- 校园店折扣优惠 -->
                <template v-if="goodsDetail.activityType > 0 && agentDiscount">
                    <view class="discount-main ellipsis">{{ agentDiscount }}</view>
                    <view
                        v-if="agentDiscount"
                        class="discount-line"
                    >
                        <view
                            v-if="goodsDetail.activityType === 1 || goodsDetail.activityType === 2"
                            class="discount-title"
                            >折扣</view
                        >
                        <view
                            v-else-if="
                                goodsDetail.activityType === 3 || goodsDetail.activityType === 4
                            "
                            class="discount-title"
                            >满减</view
                        >
                        <view class="discount-main ellipsis">{{ agentDiscount }}</view>
                    </view>
                </template>
                <view
                    v-if="shopDiscount"
                    class="discount-line"
                >
                    <view class="discount-title">满减</view>
                    <view class="discount-main ellipsis">{{ shopDiscount }}</view>
                </view>
                <view
                    v-if="couponList.length > 0"
                    class="discount-line"
                    @tap="openCouponPop"
                >
                    <view class="discount-title">领券</view>
                    <view class="discount-main">
                        <template
                            v-for="(coupon, cIndex) in couponList"
                            :key="cIndex"
                        >
                            <view
                                v-if="coupon.type == 'coupon'"
                                class="coupon-item"
                            >
                                <view class="coupon-item-inner">{{ coupon.discountNum }}元券</view>
                            </view>
                            <view
                                v-else
                                class="package-tag"
                            >
                                <view class="package-tag-left"> 红包 </view>
                                <view class="package-tag-right">
                                    {{ coupon.discountInfo }}
                                </view>
                            </view>
                        </template>
                    </view>
                    <view class="discount-tail">
                        <zd-icon
                            type="zdmp-qianwang"
                            color="$uni-text-color"
                            :size="32"
                        ></zd-icon>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.main-wrap {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 710rpx;
    margin: 20rpx 20rpx 0;
    padding-bottom: 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    flex-direction: column;
}

.line-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    width: 100%;
    padding: 0 20rpx;
    flex-direction: row;
    box-sizing: border-box;
}
.line-title {
    margin-right: 20rpx;
    padding-top: 20rpx;
    color: #8a9399;
    font-size: 24rpx;
    line-height: 32rpx;
    flex-shrink: 0;
}
.line-main {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;
    .line-main-text {
        padding-top: 20rpx;
        color: $uni-text-color;
        font-size: 24rpx;
        line-height: 32rpx;
    }
}
.line-tail {
    margin-left: 20rpx;
    padding-top: 20rpx;
}

.discount-line {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
}
.discount-title {
    height: 32rpx;
    margin-top: 20rpx;
    margin-right: 20rpx;
    padding: 0 12rpx;
    border-radius: 4rpx;
    color: $zd-color-red;
    font-size: 20rpx;
    background: #ffe8e6;
    line-height: 32rpx;
    flex-shrink: 0;
}
.discount-main {
    display: inline-flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    max-width: 530rpx;
    padding-top: 20rpx;
    color: $uni-text-color;
    font-size: 24rpx;
    flex: 1;
    line-height: 32rpx;
    flex-direction: row;
    flex-wrap: nowrap;
}
.coupon-item {
    position: relative;
    margin-right: 16rpx;
    box-sizing: content-box;
    &-inner {
        width: max-content;
        height: 32rpx;
        padding: 0 12rpx;
        border: 2rpx solid $zd-color-red;
        border-radius: 4rpx;
        color: $zd-color-red;
        font-size: 22rpx;
        background: #ffffff;
        box-sizing: border-box;
        line-height: 28rpx;
    }
    &::before,
    &::after {
        position: absolute;
        width: 8rpx;
        height: 8rpx;
        border: 1px solid $zd-color-red;
        border-top-color: transparent;
        border-left-color: transparent;
        border-radius: 100%;
        background-color: #fff;
        content: '';
    }
    &::before {
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%) rotate(-45deg);
    }
    &::after {
        top: 50%;
        right: 0;
        transform: translate(50%, -50%) rotate(135deg);
    }
}

.package-tag {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: 16rpx;
    border: 1px solid $zd-color-red;
    border-radius: 4rpx;
    box-sizing: content-box;
    flex-direction: row;
    flex-shrink: 0;
    &-left {
        width: 80rpx;
        text-align: center;
        color: #fff;
        font-size: 24rpx;
        background-color: $zd-color-red;
        line-height: 32rpx;
        flex-shrink: 0;
    }
    &-right {
        padding: 0 4rpx;
        color: $zd-color-red;
        font-size: 24rpx;
        line-height: 32rpx;
        flex-shrink: 0;
    }
}
.discount-tail {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 160rpx;
    background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 1) 70%,
        rgba(255, 255, 255, 1) 100%
    );
    flex-direction: row;
}
</style>
