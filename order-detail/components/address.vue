<script setup lang="ts">
import type { AddressInfo } from '@/api/order-detail/types';

import type { ResponseOrder8 } from '../../api/order/types';
import agentAddress from '../../components/order/agent-address.vue';

const props = defineProps<{
    // 实际收货地址
    address?: ResponseOrder8;
    // 代收时用户宿舍地址
    dorAddress?: ResponseOrder8;
}>();
</script>
<template>
    <view
        v-if="!dorAddress"
        class="container"
    >
        <view class="address-user">{{ address?.userName }} {{ address?.phone }}</view>

        <view class="address-detail"
            >{{ address?.provinceName }}{{ address?.cityName }}{{ address?.countyName
            }}{{ address?.detailInfo }}</view
        >
    </view>
    <agentAddress
        v-else
        :address="dorAddress"
        :agent-address="address"
        :type="2"
    />
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    width: 710rpx;
    margin: 20rpx 20rpx 0;
    padding: 30rpx 24rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
}
.address-user {
    color: $uni-text-color;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 44rpx;
}
.address-detail {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 40rpx;
}
</style>
