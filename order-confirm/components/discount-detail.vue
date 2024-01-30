<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    list?: any[];
    discountMoney?: string | number;
    freeDiscountMaxSubsidyMoney: number;
}>();
const drawerRef = ref();
const checked = ref<string[]>([]);
const getDiscount = (item: any) => {
    return Math.round((1 - parseFloat(item.discountMoney) / parseFloat(item.oriMoney)) * 10);
};
const open = () => {
    drawerRef?.value?.open();
};
defineExpose({
    open
});
</script>
<template>
    <zd-drawer-bottom
        ref="drawerRef"
        header-text="立减金额详情"
    >
        <view class="drawer-main savepadding">
            <view class="discount-title">
                <view class="discount-title-text">活动立减金额</view>
                <view
                    v-if="freeDiscountMaxSubsidyMoney > 0"
                    class="discount-title-tip"
                    >（单笔订单最高补贴¥{{ freeDiscountMaxSubsidyMoney }}）</view
                >
                <view class="discount-title-tail">
                    <view class="discount-title-prefix">减</view>
                    <zd-price
                        :value="discountMoney ? +discountMoney : 0"
                        color="#FF4734"
                        :font-size-large="40"
                        :font-size-small="24"
                        :font-size-unit="20"
                    />
                </view>
            </view>
            <view
                v-for="(item, index) in list"
                :key="index"
                class="discount-group"
            >
                <!-- <view class="discount-head">
                    <view class="discount-head-title">优惠金额</view>
                    <view class="discount-head-unit">共减</view>
                    <zd-price
                        :value="discountMoney ? +discountMoney : 0"
                        color="#FF4734"
                        :font-size-large="40"
                        :font-size-small="24"
                        :font-size-unit="20"
                    />
                </view> -->
                <scroll-view
                    scroll-x
                    class="discount-goods-list"
                >
                    <image
                        v-for="(goods, gIndex) in item.goodsList"
                        :key="gIndex"
                        class="discount-goods-item"
                        :src="goods.thumbPic"
                        mode="aspectFill"
                    />
                </scroll-view>
                <view class="discount-group-bottom">
                    <view class="discount-group-tag">折扣优惠</view>
                    <view class="discount-group-desc ellipsis">
                        共计{{ item?.num }}件商品，总价打{{ item.discount }}折，可减{{
                            item.discountMoney
                        }}元
                    </view>
                </view>
            </view>
        </view>
    </zd-drawer-bottom>
</template>
<style lang="scss" scoped>
.pop-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 120rpx;
    background: #ffffff;
    flex-direction: row;
}
.drawer-main {
    overflow-y: auto;
    width: 750rpx;
    flex: 1;
}
.discount-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    width: 750rpx;
    box-sizing: border-box;
    padding: 20rpx 40rpx 0;
    &-text {
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 40rpx;
    }
    &-tip {
        color: #576066;
        font-size: 24rpx;
        line-height: 24rpx;
    }
    &-tail {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        flex-direction: row;
    }
    &-prefix {
        color: #ff4734;
        font-size: 20rpx;
        font-weight: 500;
    }
}
.discount-group {
    width: 750rpx;
    padding: 20rpx 40rpx;
    box-sizing: border-box;
    .discount-head {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        width: 100%;
        flex-direction: row;
        &-title {
            color: #333333;
            font-size: 28rpx;
            font-weight: 500;
            flex: 1;
            line-height: 32rpx;
        }
        &-unit {
            color: #f95b56;
            font-size: 24rpx;
            font-weight: 500;
            line-height: 36rpx;
        }
    }
    .discount-goods-list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
    }
    .discount-goods-item {
        width: 140rpx;
        height: 140rpx;
        margin-right: 20rpx;
        border-radius: 12rpx;
        background-color: orange;
    }
    .discount-group-bottom {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        margin-top: 20rpx;
        .discount-group-tag {
            margin-right: 8rpx;
            padding: 0 8rpx;
            border: 2rpx solid #ff4734;
            border-radius: 4rpx;
            color: $zd-color-red;
            font-size: 20rpx;
            font-weight: 500;
            line-height: 32rpx;
            flex-shrink: 0;
        }
        .discount-group-desc {
            color: #576066;
            font-size: 24rpx;
            flex: 1;
            line-height: 32rpx;
        }
    }
}
</style>
