<script setup lang="ts">
import { pay } from '@/utils/pay';

import BackModal from './components/back-modal.vue';

const backModalRef = ref();
const orderNos = ref<string[]>([]);
const money = ref<number>(0);
const from = ref('app');
const status = ref(0);
onLoad(options => {
    console.log(options);
    orderNos.value = options?.orderNos ? options?.orderNos.split(',') : [];
    money.value = options?.money ? +options?.money : 0;
    from.value = options?.from ? 'web' : 'app';
    fnDoPay();
});
const fnDoPay = async () => {
    if (status.value === 1) {
        return;
    } else if (status.value === 2) {
        uni.showToast({
            icon: 'none',
            title: '订单已经支付'
        });
    }
    if (orderNos.value.length > 0) {
        try {
            await pay(orderNos.value);
            status.value = 2;
            backModalRef.value.open();
        } catch (e: any) {
            // backModalRef.value.open();
            console.log(e);
            status.value = -1;
            if (e.msg) {
                uni.showToast({
                    title: e.msg,
                    icon: 'none'
                });
            }
        }
    } else {
        uni.showToast({
            title: '订单号缺失',
            icon: 'none'
        });
    }
};
</script>

<template>
    <view class="page">
        <zd-navbar
            title=""
            :background="`rgba(255,255,255, 1)`"
            color="rgba(41, 47, 51, 1)"
            class="header"
        >
        </zd-navbar>
        <view class="pay-main">
            <view class="pay-main-title">掌上大学支付</view>
            <zd-price
                :value="money"
                :font-size-large="48"
                :font-size-small="48"
                :font-size-unit="32"
                color="rgba(41, 47, 51, 1)"
            ></zd-price>
            <view class="pay-main-list">
                <view
                    v-for="orderNo in orderNos"
                    :key="orderNo"
                    class="pay-main-line"
                >
                    <view class="pay-main-line-title">订单编号</view>
                    <view class="pay-main-line-value">{{ orderNo }}</view>
                </view>
            </view>
        </view>
        <view class="bottom-wrap savebottom">
            <zd-button
                type="primary"
                @tap="fnDoPay()"
            >
                立即支付
            </zd-button>
        </view>
    </view>
    <BackModal
        ref="backModalRef"
        :from="from"
    />
</template>

<style scoped lang="scss">
.page {
    display: flex;
    min-height: 100vh;
    background-color: #fff;
    flex-direction: column;
}
.pay-main {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 750rpx;
    flex-direction: column;
    padding-top: 40rpx;
    &-title {
        padding-bottom: 34rpx;
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 40rpx;
    }
    &-list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        margin-top: 40rpx;
    }
    &-line {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 670rpx;
        flex-direction: row;
        border-top: 1px solid rgba(237, 240, 242, 1);
        &-title {
            color: #292f33;
            font-size: 28rpx;
            line-height: 80rpx;
        }
        &-value {
            flex: 1;
            text-align: right;
            color: #292f33;
            font-size: 28rpx;
            line-height: 80rpx;
        }
    }
}
.bottom-wrap {
    position: fixed;
    left: 0;
    width: 750rpx;
    box-sizing: border-box;
    padding: 20rpx 40rpx;
}
</style>
