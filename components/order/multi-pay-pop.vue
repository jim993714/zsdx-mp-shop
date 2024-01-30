<script setup lang="ts">
import { getMultiPayInfo } from '../../api/order/index';
import type { MultiPayInfo } from '../../api/order/types';
import type { Order } from '../../order-list/types';

const emit = defineEmits(['pay']);
const popup = ref();
const payOrder = ref();
const multiPayInfo = ref<MultiPayInfo>();
const multiPay = async () => {
    multiPayInfo.value = await getMultiPayInfo({ orderNo: payOrder.value.orderNo });
};
const fnPay = () => {
    console.log('pay', multiPayInfo.value?.payOrderNo);
    emit('pay', {
        payOrderNo: multiPayInfo.value?.payOrderNo,
        money: multiPayInfo.value?.money,
        order: payOrder.value
    });
};
const open = (order: Order) => {
    console.log('open', order);
    payOrder.value = order;
    multiPay();
    popup.value.open();
};
const close = () => {
    popup.value.close();
};
defineExpose({
    open,
    close
});
</script>
<template>
    <view style="position: fixed; z-index: 400">
        <zd-popup
            ref="popup"
            type="bottom"
            :is-mask-click="false"
        >
            <view class="modal-content">
                <view class="modal-title">以下订单需要一起支付</view>
                <view class="modal-sub-title">由于以下订单共享优惠，需要一起付款</view>
                <scroll-view
                    scroll-y
                    class="order-list"
                >
                    <view
                        v-for="order in multiPayInfo?.otherOrderList"
                        :key="order.orderNo"
                        class="order-item"
                    >
                        <view class="order-head">
                            <view class="order-head-title ellipsis">{{ order.shopTitle }}</view>
                            <zd-price
                                :value="order.money || 0"
                                :font-size-large="32"
                                :font-size-small="32"
                                :font-size-unit="24"
                                color="rgba(255, 71, 52, 1)"
                            ></zd-price>
                        </view>
                        <view
                            v-for="(goods, gIndex) in order.buyGoodsList"
                            :key="gIndex"
                            class="order-line"
                        >
                            <view class="order-line-main ellipsis">{{ goods.title }}</view>
                            <view class="order-line-num">x{{ goods.num }}</view>
                        </view>
                    </view>
                </scroll-view>
                <view
                    class="pay-btn"
                    @tap="fnPay"
                    >立即付款</view
                >
                <zd-icon
                    type="zdmp-guanbidefuben"
                    class="close-btn"
                    :size="40"
                    @tap="close"
                />
            </view>
        </zd-popup>
    </view>
</template>
<style lang="scss" scoped>
.modal-content {
    position: relative;
    width: 100%;
    padding: 40rpx;
    border-radius: 32rpx 32rpx 0 0;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
}
.modal-title {
    text-align: center;
    color: #292f33;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 40rpx;
}
.modal-sub-title {
    margin-top: 30rpx;
    text-align: center;
    color: #199fff;
    font-size: 24rpx;
    line-height: 24rpx;
}
.order-list {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    height: 760rpx;
    margin-top: 26rpx;
    flex: 1;
    flex-direction: column;
    .order-item {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        margin-top: 20rpx;
        padding: 30rpx;
        border-radius: 20rpx;
        background: #f5f8fa;
        flex-direction: column;
        box-sizing: border-box;
    }
    .order-head {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        padding-bottom: 4rpx;
        &-title {
            width: 252px;
            color: #333333;
            font-size: 28rpx;
            font-weight: 500;
            flex: 1;
            line-height: 28rpx;
        }
    }
    .order-line {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        margin-top: 20rpx;
        &-main {
            margin-right: 40rpx;
            color: #8a9399;
            font-size: 24rpx;
            flex: 1;
            line-height: 24rpx;
        }
        &-num {
            color: #8a9399;
            font-size: 24rpx;
            line-height: 24rpx;
        }
    }
}
.pay-btn {
    width: 670rpx;
    height: 80rpx;
    margin: 20rpx 0;
    border-radius: 46px;
    text-align: center;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 500;
    background: #199fff;
    line-height: 80rpx;
}
.close-btn {
    position: absolute;
    top: 40rpx;
    right: 30rpx;
}
</style>
