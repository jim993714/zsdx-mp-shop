<script setup lang="ts">
import type { OrderDetailResp } from '../api/order/types';
import { LogisticsType } from '../api/order/types';
import { getOrderDetail } from '../api/order-detail/index';
import logisticsInfo from '../components/logistics-info/index.vue';
import addressModal from './components/address.vue';
import cashbackInfo from './components/cashback-info.vue';
import orderFooter from './components/footer.vue';
import goodsInfo from './components/goods-info.vue';
import orderInfo from './components/order-info.vue';
import pageHead from './components/page-head.vue';
import verticalInfo from './components/vertical-info.vue';
import verticalInfoExchange from './components/vertical-info-exchange.vue';
import verticalInfoReceive from './components/vertical-info-receive.vue';

const orderNo = ref('');
const orderDetail = ref<OrderDetailResp>();
const type = ref<LogisticsType>(LogisticsType.Normal);

const fnInit = async () => {
    orderDetail.value = await getOrderDetail({
        orderNo: orderNo.value
    });
};

const fnOperate = (type: string) => {
    fnInit();
};

onLoad((options: any) => {
    orderNo.value = options.orderNo;
});
onShow(() => {
    fnInit();
});
</script>
<template>
    <zd-navbar
        relative
        title="订单详情"
    />
    <pageHead :order-detail="orderDetail" />
    <view class="logistics-wrap">
        <logisticsInfo
            v-if="orderDetail?.orderCategory !== 12 && orderDetail?.orderCategory !== 14"
            :order-no="orderNo"
            :type="type"
            :collection-sign-image-list="orderDetail?.collectionSignImageList"
            mode="simple"
        />
    </view>
    <addressModal
        v-if="orderDetail?.shipType === 0 && orderDetail?.shipByQrcode !== 1"
        :address="orderDetail?.addressInfo"
        :dor-address="orderDetail.dormitoryAddressInfo"
    />
    <verticalInfoExchange
        v-if="orderDetail?.virtualTrackingInfo && orderDetail?.virtualTrackingInfo?.type == 1"
        :info="orderDetail?.virtualTrackingInfo"
    />
    <template
        v-if="orderDetail?.virtualTrackingInfo && orderDetail?.virtualTrackingInfo?.type == 2"
    >
        <verticalInfo
            v-for="(vertical, vIndex) in orderDetail?.virtualTrackingInfo?.virtualKeys"
            :key="vIndex"
            :no="vIndex + 1"
            :info="vertical.data"
            :exchange-url="vertical.exchangeUrl"
        />
    </template>
    <verticalInfoReceive
        v-if="orderDetail?.virtualBuyInfo && orderDetail?.virtualBuyInfo.length > 0"
        :list="orderDetail?.virtualBuyInfo"
    ></verticalInfoReceive>
    <goodsInfo
        :order-detail="orderDetail"
        :order-no="orderNo"
    />
    <cashbackInfo
        v-if="orderDetail && orderDetail?.refundMoney && orderDetail?.refundMoney > 0"
        :order-detail="orderDetail"
    />
    <orderInfo
        :order-detail="orderDetail"
        :order-no="orderNo"
    />
    <orderFooter
        v-if="orderDetail?.status !== -1"
        :order-no="orderNo"
        :order-detail="orderDetail"
        @operate="fnOperate"
    />
</template>

<style>
page {
    background-color: #f5f8fa;
}
</style>
<style lang="scss" scoped>
.logistics-wrap {
    width: 710rpx;
    margin: 20rpx 20rpx 0;
}
</style>
