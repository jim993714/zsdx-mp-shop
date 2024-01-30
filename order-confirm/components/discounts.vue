<script setup lang="ts">
import type { OrderPreview, PreviewParam } from '../../api/order-confirm/types';
import type { Allowance, Coupon, Discount, RedPacket, StudentShopRedPack } from '../types';
import chooseAllowance from './choose-allowance.vue';
import chooseCoupon from './choose-coupon.vue';
import chooseGroupRedPack from './choose-group-red-packet.vue';
import chooseRedPack from './choose-red-packet.vue';
import discountDetail from './discount-detail.vue';

const props = defineProps<{
    previewParam: PreviewParam;
    list: Discount[];
    orderDetail?: OrderPreview;
}>();
const emit = defineEmits(['change']);
const allowancePop = ref();
const selectedAllowance = ref<{
    discountMoney: number;
    selected: Allowance[] | undefined;
}>();
const couponPop = ref();
const selectedCoupon = ref<{
    discountMoney: number;
    selected: Coupon[] | undefined;
}>();
const redPacketPop = ref();
const selectedRedPacket = ref<{
    discountMoney: number;
    selected: RedPacket[] | undefined;
}>();
const groupRedPacketPop = ref();
const selectedGroupRedPacket = ref<{
    discountMoney: number;
    selected: StudentShopRedPack[] | undefined;
}>();
const discountDetailPop = ref();

const fnDiscountDetail = (discount: Discount) => {
    switch (discount.type) {
        case 1:
            couponPop.value.open();
            break;
        case 2:
            redPacketPop.value.open();
            break;
        case 3:
            allowancePop.value?.open();
            break;
        case 4:
            groupRedPacketPop.value?.open();
            break;
        case 5:
            discountDetailPop?.value?.open();
            break;
        default:
            break;
    }
};
const fnChangeDiscount = (selected: string, type: string) => {
    emit('change', {
        type: type,
        value: selected
    });
};
const fnChangeSelected = (data: any, type: number) => {
    switch (type) {
        case 1:
            selectedCoupon.value = data;

            break;
        case 2:
            selectedRedPacket.value = data;
            break;
        case 3:
            selectedAllowance.value = data;
            break;
        case 4:
            selectedGroupRedPacket.value = data;
            break;
        default:
            break;
    }
};
</script>
<template>
    <view class="container">
        <view
            v-for="(discount, index) in list"
            :key="index"
            class="line"
        >
            <view class="line-title-wrap">
                <view class="line-title">{{ discount.title }}</view>
                <view
                    v-if="
                        discount.freeDiscountMaxSubsidyMoney &&
                        discount.freeDiscountMaxSubsidyMoney <= discount.discountMoney
                    "
                    class="line-subtitle"
                    >单笔订单最高补贴¥{{ discount.freeDiscountMaxSubsidyMoney }}</view
                >
            </view>
            <view
                class="line-value"
                @tap="fnDiscountDetail(discount)"
            >
                <template v-if="discount.discountMoney > 0">
                    <view class="line-value-minus">-</view>
                    <zd-price
                        :value="discount.discountMoney"
                        color="#FF4734"
                        :font-size-large="40"
                        :font-size-small="28"
                        :font-size-unit="20"
                    />
                </template>
                <template v-else>
                    <!-- 优惠券 -->
                    <template v-if="discount.type === 1">
                        <template
                            v-if="
                                selectedCoupon?.discountMoney && selectedCoupon?.discountMoney > 0
                            "
                        >
                            <view class="line-value-minus">-</view>
                            <zd-price
                                :value="selectedCoupon.discountMoney"
                                color="#FF4734"
                                :font-size-large="40"
                                :font-size-small="28"
                                :font-size-unit="20"
                            />
                        </template>
                        <view
                            v-if="!selectedCoupon?.selected"
                            class="line-value-disabled"
                            >暂无可用{{ discount.title }}</view
                        >
                        <view
                            v-else-if="
                                selectedCoupon?.selected && selectedCoupon?.selected.length === 0
                            "
                            class="line-value-disabled"
                            >未选择{{ discount.title }}</view
                        >
                    </template>
                    <!-- 掌大红包 -->
                    <template v-if="discount.type === 2">
                        <template
                            v-if="
                                selectedRedPacket?.discountMoney &&
                                selectedRedPacket?.discountMoney > 0
                            "
                        >
                            <view class="line-value-minus">-</view>
                            <zd-price
                                :value="selectedRedPacket.discountMoney"
                                color="#FF4734"
                                :font-size-large="40"
                                :font-size-small="28"
                                :font-size-unit="20"
                            />
                        </template>
                        <view
                            v-else-if="selectedRedPacket?.selected === undefined"
                            class="line-value-disabled"
                            >暂无可用{{ discount.title }}</view
                        >
                        <view
                            v-else-if="
                                selectedRedPacket?.selected &&
                                selectedRedPacket?.selected.length === 0
                            "
                            class="line-value-disabled"
                            >未选择{{ discount.title }}</view
                        >
                    </template>
                    <!-- 购物津贴 -->
                    <template v-if="discount.type === 3">
                        <view
                            v-if="selectedAllowance?.selected === undefined"
                            class="line-value-disabled"
                            >暂无可用{{ discount.title }}</view
                        >
                        <view
                            v-else-if="
                                selectedAllowance?.selected &&
                                selectedAllowance?.selected.length === 0
                            "
                            class="line-value-disabled"
                            >未选择{{ discount.title }}</view
                        >
                    </template>
                    <!-- 社群红包 -->
                    <template v-if="discount.type === 4">
                        <template
                            v-if="
                                selectedGroupRedPacket?.discountMoney &&
                                selectedGroupRedPacket?.discountMoney > 0
                            "
                        >
                            <view class="line-value-minus">-</view>
                            <zd-price
                                :value="selectedGroupRedPacket.discountMoney"
                                color="#FF4734"
                                :font-size-large="40"
                                :font-size-small="28"
                                :font-size-unit="20"
                            />
                        </template>
                        <view
                            v-else-if="selectedGroupRedPacket?.selected === undefined"
                            class="line-value-disabled"
                            >暂无可用{{ discount.title }}</view
                        >
                        <view
                            v-else-if="
                                selectedGroupRedPacket?.selected &&
                                selectedGroupRedPacket?.selected.length === 0
                            "
                            class="line-value-disabled"
                            >未选择{{ discount.title }}</view
                        >
                    </template>
                </template>
            </view>
            <zd-icon
                type="zdmp-qianwang"
                :size="24"
                color="rgba(138, 147, 153, 1)"
            />
        </view>
    </view>
    <!-- 津贴 -->
    <chooseAllowance
        ref="allowancePop"
        :preview-param="previewParam"
        :selected="previewParam.studentAllowanceId"
        @change="fnChangeDiscount($event, 'allowance')"
        @change-selected="fnChangeSelected($event, 3)"
    />
    <chooseRedPack
        ref="redPacketPop"
        :preview-param="previewParam"
        @change="fnChangeDiscount($event, 'redPack')"
        @change-selected="fnChangeSelected($event, 2)"
    />
    <chooseGroupRedPack
        ref="groupRedPacketPop"
        :preview-param="previewParam"
        @change="fnChangeDiscount($event, 'studentShopRedPack')"
        @change-selected="fnChangeSelected($event, 4)"
    />
    <chooseCoupon
        ref="couponPop"
        :preview-param="previewParam"
        @change="fnChangeDiscount($event, 'coupon')"
        @change-selected="fnChangeSelected($event, 1)"
    />
    <discountDetail
        ref="discountDetailPop"
        :free-discount-max-subsidy-money="orderDetail?.freeDiscountMaxSubsidyMoney || 0"
        :discount-money="orderDetail?.orderSummerVacationDiscountActivityMoney"
        :list="orderDetail?.orderSummerVacationDiscountActivity"
    />
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    width: 710rpx;
    margin-top: 20rpx;
    padding: 0 20rpx 20rpx;
    border-radius: 12rpx;
    background: #ffffff;
    box-sizing: border-box;
    flex-direction: column;
}
.line {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-top: 20rpx;
}

.line-title-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    .line-title {
        color: $uni-text-color;
        font-size: 24rpx;
        line-height: 40rpx;
    }
    .line-subtitle {
        color: $uni-text-color-grey;
        font-size: 20rpx;
        line-height: 28rpx;
    }
}
.line-value {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction: row;
}
.line-value-minus {
    color: $zd-color-red;
    font-size: 20rpx;
    font-weight: 500;
    line-height: 20rpx;
}
.line-value-disabled {
    color: $uni-text-color-grey;
    font-size: 24rpx;
    line-height: 24rpx;
}
</style>
