<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';

import { CDN_BASE_URL } from '@/base/constants';

import { getPrizeLogisticsInfo } from '../api/common/index';
import { LogisticsFromType, LogisticsType } from '../api/order/types';
import LogisticsInfo from '../components/logistics-info/index.vue';

const orderNo = ref('');
const exchangeNo = ref('');
const type = ref<LogisticsType>(LogisticsType.Normal);
const fromType = ref<LogisticsFromType>(LogisticsFromType.Order);
const tab = ref(0);

// 获取奖品物流信息
async function getPrizeLogistics() {
    const data = await getPrizeLogisticsInfo(exchangeNo.value);

    return {
        ...data,
        goodsNo: '',
        extraTrackingInfo: [],
        goodsCover: data.image,
        trackingInfoList: data.trackingInfoList || []
    };
}

onLoad(options => {
    orderNo.value = options?.orderNo;
    if (options?.type) {
        type.value = +options?.type;
    }

    if (options?.tab) {
        tab.value = +options.tab;
    }

    // 从兑换记录进入
    if (options?.fromType) {
        fromType.value = +options?.fromType;
        exchangeNo.value = options?.exchangeNo;
    }
});
</script>

<template>
    <view class="logistics">
        <zd-navbar
            title="物流信息"
            color="#fff"
            background="transparent"
            fixed
        />
        <image :src="CDN_BASE_URL + '/mp-cs/images/ucenter/logistics-banner.png'" />
        <LogisticsInfo
            v-if="fromType === LogisticsFromType.Order"
            :order-no="orderNo"
            :type="type"
            :tab="tab"
        />

        <LogisticsInfo
            v-if="fromType === LogisticsFromType.Prize"
            order-no="orderNo"
            :request="getPrizeLogistics"
            :tab="tab"
        />
    </view>
</template>

<style scoped lang="scss">
.logistics {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: $uni-text-color-inverse;
    flex-direction: column;
    box-sizing: border-box;

    > image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 466rpx;
    }

    :deep(.logistics-info) {
        width: 710rpx;
        height: calc(100% - 240rpx);
        margin-top: 206rpx;
    }

    :deep(.logistics-info-list) {
        height: calc(100% - calc(env(safe-area-inset-bottom)) - 240rpx);
    }
}
</style>
