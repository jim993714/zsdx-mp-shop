<script setup lang="ts">
import LabelValue from '@/pages/shop/order-after/components/label-value.vue';

import type { OrderCancelApplyDetailResp } from '../../api/order-after/types/order-after-details';
import BaseCard from '../../order-after/components/base-card.vue';
import UpdateAlipayPopup from './update-alipay-popup.vue';

const props = defineProps<{
    detail: OrderCancelApplyDetailResp;
    applyNo: string;
}>();
const { detail } = toRefs(props);
const updateAlipayPopupRef = ref<InstanceType<typeof UpdateAlipayPopup>>();

function openUpdatePopup() {
    updateAlipayPopupRef.value?.open();
}

const emits = defineEmits<{
    (e: 'confirm'): void;
}>();
</script>

<template>
    <base-card
        v-if="
            [102, 103, 104, 105].includes(detail.status) ||
            (detail.status === 2 && detail.fastRefund === 1)
        "
        :header-style="{
            marginBottom: '6rpx'
        }"
        header-text="退款支付宝账号"
    >
        <view class="card-content">
            <view class="label-value">
                <text class="label">{{ detail.fastRefundAccountName }}</text>
                <text class="value">{{ detail.fastRefundAccount }}</text>
            </view>

            <view
                v-if="detail.status === 105"
                class="update-btn"
                @tap="openUpdatePopup"
            >
                更新
            </view>
        </view>
    </base-card>
    <update-alipay-popup
        ref="updateAlipayPopupRef"
        :apply-no="props.applyNo"
        @confirm="emits('confirm')"
    />
</template>

<style scoped lang="scss">
.card-content {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
}

.label-value {
    display: flex;
    flex: 1;
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 34rpx;
    .label {
        color: $uni-text-color-placeholder;
    }
    .value {
        margin-left: 20rpx;
        color: $uni-text-color;
        .copy {
            color: $zd-main-color;
        }
    }
}
.update-btn {
    right: 44rpx;
    width: 140rpx;
    height: 56rpx;
    margin-top: -50rpx;
    border-radius: 28rpx;
    text-align: center;
    color: #fff;
    font-size: 24rpx;
    background-color: $zd-main-color;
    line-height: 56rpx;
}
</style>
