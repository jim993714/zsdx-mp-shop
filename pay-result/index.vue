<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import definePageProps from '@/utils/definePageProps';

import { checkLottery } from '../api/order-confirm';
import type { PennyBuyDiscountActivity } from '../api/order-confirm/types';
import lotteryPop from './components/lottery-popup.vue';
import OneCentPurchasePopup from './components/one-cent-purchase-popup.vue';

const money = ref<string>('0');
const orderNo = ref<string>('');
const lotteryRef = ref();
const lotteryNo = ref('');
const pennyBuyInfo = ref<PennyBuyDiscountActivity>();

const oneCentPurchasePopup = ref();

const goOrder = () => {
    router.push('orderDetail', {
        orderNo: orderNo.value
    });
};
const goHome = () => {
    router.switchTab('home');
};
const initLottery = async () => {
    let res = await checkLottery({
        orderNo: orderNo.value
    });
    if (res.toolLottery?.lotteryNo) {
        lotteryNo.value = res.toolLottery?.lotteryNo;
        lotteryRef.value.open();
    }
    if (res.pennyBuyDiscountActivity?.status > 0) {
        pennyBuyInfo.value = res.pennyBuyDiscountActivity;
    }
};

const options = definePageProps<{
    money: string;
    orderNo: string;
    activityNo?: string;
}>(async (options: any) => {
    money.value = options.money;
    orderNo.value = options.orderNo;
    console.log(options, 'options');
    initLottery();
});
</script>
<template>
    <zd-navbar
        relative
        title="购买完成"
    />
    <view class="page-body">
        <image
            class="result-head"
            src="https://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/pay-success.png"
            mode="aspect-fit"
        />
        <view class="title">支付成功</view>
        <view class="subtitle">实付金额：¥{{ money }}</view>
        <view class="btn-group">
            <zd-button
                :button-style="{
                    width: '320rpx',
                    textAlign: 'center',
                    borderColor: 'rgba(25, 159, 255, 1)',
                    color: 'rgba(25, 159, 255, 1)'
                }"
                @tap="goHome()"
            >
                返回首页
            </zd-button>
            <zd-button
                type="primary"
                :button-style="{
                    width: '320rpx',
                    textAlign: 'center'
                }"
                @tap="goOrder()"
            >
                查看订单
            </zd-button>
        </view>
    </view>
    <lotteryPop
        ref="lotteryRef"
        :lottery-no="lotteryNo"
    />
    <one-cent-purchase-popup
        ref="oneCentPurchasePopup"
        :activity-no="options?.activityNo"
        :alert-image="pennyBuyInfo?.alertImage"
    />
</template>

<style>
page {
    background-color: #f5f8fa;
}
</style>
<style lang="scss" scoped>
.page-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding-top: 120rpx;
}
.result-head {
    width: 230rpx;
    height: 194rpx;
}
.title {
    margin-top: 20rpx;
    color: $uni-text-color;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 40rpx;
}

.subtitle {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: 24rpx;
    line-height: 24rpx;
}
.btn-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 670rpx;
    margin-top: 80rpx;
    flex-direction: row;
}
</style>
