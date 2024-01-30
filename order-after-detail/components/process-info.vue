<script setup lang="ts">
import type { Step } from '@zsdx/mp-material/dist/lib/components/zd-step/index.vue';

import { EnumOrderAfterType } from '../../api/order-after/types/constants';
import type { OrderCancelApplyDetailResp } from '../../api/order-after/types/order-after-details';
import BaseCard from '../../order-after/components/base-card.vue';
import LabelValue from '../../order-after/components/label-value.vue';
import { STEP_OPTIONS_MAP } from '../constants';

const props = defineProps<{ detail: OrderCancelApplyDetailResp }>();
const { detail }: { detail: Ref<OrderCancelApplyDetailResp> } = toRefs(props);

/** 进度条配置 */
let stepOptions = computed(() => {
    if (detail.value.type) {
        if (
            [13, 14, 2].includes(detail.value.status) &&
            !detail.value.rejectAddressInfo?.userName
        ) {
            return STEP_OPTIONS_MAP[detail.value.type].filter?.(item => item.label !== '寄回商品');
        }

        if (detail.value.fastRefund) {
            // 如果是极速退款，启用单独的进度条
            return STEP_OPTIONS_MAP[100];
        }
        return STEP_OPTIONS_MAP[detail.value.type];
    } else {
        return [];
    }
});

/** 当前进度 */
const step = computed(() => {
    if (!detail.value?.status) return 1;

    if (detail.value.type === EnumOrderAfterType.REFUND_RETURN && detail.value.fastRefund) {
        if ([2, 105, 104, 103].includes(detail.value.status)) return 4;
        if ([11, 12, 102].includes(detail.value.status)) return 3;
        if ([1, 101].includes(detail.value.status)) return 2;
    }

    if (detail.value.type !== EnumOrderAfterType.EXCHANGE) {
        if ([2].includes(detail.value.status)) return 4;
        if ([11, 12].includes(detail.value.status)) return 3;
        if ([1].includes(detail.value.status)) return 2;
    }
    if (detail.value.type === EnumOrderAfterType.EXCHANGE) {
        if ([2, 3].includes(detail.value.status)) return 5;
        if ([13, 14, 15, 2].includes(detail.value.status)) return 4;
        if ([12].includes(detail.value.status)) return 3.5;
        if (
            [11].includes(detail.value.status) ||
            (detail.value.status === -1 && detail.value.dealRejectPassType == 0)
        )
            return 3;
        if ([1].includes(detail.value.status)) return 2;
    }
    return 1;
});

const trackingInfo = computed(() => {
    if (detail.value.type === EnumOrderAfterType.REFUND_RETURN)
        return detail.value?.returnTrackingInfo ?? {};
    return detail.value?.rejectAddressInfo ?? {};
});
</script>

<template>
    <base-card
        class="process-info"
        header-text="售后流程"
        :hide-header="[-2, -1, 3].includes(detail.status)"
    >
        <view class="content">
            <zd-step
                v-if="![-2, -1, 3].includes(detail.status)"
                :options="stepOptions"
                direction="row"
                :step="
                    [13, 14, 2].includes(detail.status) && !detail.rejectAddressInfo.userName
                        ? step - 1
                        : step
                "
                :icon-style="{
                    margin: '0 34rpx'
                }"
                class="step-list"
            ></zd-step>
            <view class="step-detail">
                <template v-if="detail.type == 3 && detail.status == 1">
                    <view class="title"> 您已经成功发起换货申请，等待商家处理 </view>
                    <view
                        v-if="detail.type == 1"
                        class="extra"
                    >
                        若商家同意：换货申请达成，请及时将货物退回
                    </view>
                    <view
                        v-else
                        class="extra"
                    >
                        若商家拒绝：您可以重新发起申请，商家会重新处理
                    </view>
                    <view class="extra">
                        若商家超时未处理：若商家超时不做处理，则系统会默认商家同意，并进入后续流程
                    </view>
                </template>
                <template v-else-if="detail.status == 1">
                    <view class="title"> 您已经成功发起退款申请，等待商家处理 </view>
                    <view
                        v-if="detail.type == 1"
                        class="extra"
                    >
                        如果商家同意或者超时未处理，系统将退款给你
                    </view>
                    <view
                        v-else
                        class="extra"
                    >
                        如果商家同意或者超时未处理，系统将同意您的退款申请
                    </view>
                    <view class="extra"> 如果商家拒绝，您可以重新发起申请，商家会重新处理 </view>
                </template>
                <template v-if="detail.type == 3">
                    <view v-if="detail.status == 11">
                        <view class="title"> 商家已同意换货申请，请尽早发货 </view>
                        <view class="extra">
                            与商家协商未达成一致，请勿使用到付或者平邮，以免商家拒签。请填写真实的换货的物流信息，逾期未填写，换货申请将会关闭
                        </view>
                    </view>
                    <view v-else-if="detail.status == 3">
                        <view class="title"> 因商家超时未处理，交易支持退款 </view>
                        <view class="extra"> 商家收到货物逾期未处理，因此作退款处理 </view>
                    </view>
                    <view v-else-if="detail.status == -1">
                        <view class="title"> 商家拒绝换货申请 </view>
                        <view class="extra">{{ detail.refuseReason }}</view>
                        <view class="order-result-pics">
                            <image
                                v-for="(pic, pindex) in detail.hireEvidenceList"
                                :key="pindex"
                                class="order-result-pic"
                                :src="pic"
                                mode="aspectFill"
                            ></image>
                        </view>
                    </view>

                    <view v-else-if="detail.status == -2 && detail.dealCancelType == 4">
                        <view class="title"> 商家同意换货，您预期未填写物流信息，换货关闭 </view>
                        <view class="extra">因您未按时填写物流信息，订单交易将正常进行</view>
                    </view>
                    <view v-else-if="detail.status == -2 && detail.dealCancelType == 10">
                        <view class="title"> 因您申请了客服介入，换货申请关闭 </view>
                        <view class="extra"
                            >客服介入会根据您的举证和商家的举证进行公平的判断来维护权益</view
                        >
                    </view>
                    <view v-else-if="detail.status == -2">
                        <view class="title"> 因您主动撤销，换货申请关闭 </view>
                        <view class="extra">因您撤销售后申请，订单交易将正常进行</view>
                    </view>
                    <view v-else-if="detail.status == 2">
                        <view class="title"> 您已经确认收到换货商品，已完成换货 </view>
                    </view>

                    <view v-else-if="detail.status == 12">
                        <view class="title"> 买家已发货等待商家确认收货 </view>
                        <view class="extra"
                            >如果商家逾期未处理，系统会默认视为商家收到退货商品，系统会按需要换货的商品金额原路退款</view
                        >
                    </view>
                    <view v-else-if="detail.status == 13">
                        <view class="title"> 商家同意换货，等待商家换货 </view>
                        <view
                            v-if="detail.dealRejectPassType == 0"
                            class="extra"
                            >商家已同意换货申请，您无需寄回商品，请耐心等待商家换货</view
                        >
                        <view
                            v-else
                            class="extra"
                            >商家已同意换货申请，请耐心等待商家换货</view
                        >
                    </view>
                    <view v-else-if="detail.status == 14 || detail.status == 15">
                        <view class="title"> 商家已发货等买家完成换货 </view>
                        <view class="extra"
                            >商家已经发货若您逾期未处理，系统会默认视为确认收货；若换货商品有质量问题，您可直使用“客服介入”功能进行维权</view
                        >
                    </view>
                </template>
                <template v-else>
                    <view v-if="detail.status == 11 && detail.dealRejectPassType == 4">
                        <view class="title"> 因商家超时间未处理，同意售后申请 </view>
                        <view class="extra"
                            >请及时把货寄出，并填写您退货快递单号，这将有利于加速退款审核时间；超时未填写，退货申请将自动关闭，订单交易将正常进行</view
                        >
                    </view>

                    <view v-if="detail.status == 11 && detail.dealRejectPassType == 2">
                        <view class="title"> 商家已同意售后申请 </view>
                        <view class="extra"
                            >商家已同意退款请及时把货寄出，并填写您退货快递单号，这将有利于加速退款审核时间；超时未填写，退货申请将自动关闭，订单交易将正常进行</view
                        >
                    </view>
                    <view v-if="detail.status == 2 && detail.dealSuccessType == 4">
                        <view class="title"> 因商家超时间未处理，支持退款 </view>
                        <view class="extra"
                            >退款金额将退还到下单时支付的渠道中，请关注支付渠道信息</view
                        >
                    </view>
                    <view v-if="detail.status == 2 && detail.dealSuccessType == 2">
                        <view class="title"> 商家已同意退款 </view>
                        <view class="extra">
                            退款金额将退还到下单时支付的渠道中，请关注支付渠道信息
                        </view>
                    </view>
                    <view v-if="detail.status == -2 && detail.dealCancelType == 1">
                        <view class="title"> 因您撤销退款申请，退款已经关闭 </view>
                        <view class="extra"> 因您撤销售后申请，订单交易将正常进行 </view>
                    </view>
                    <view v-if="detail.status == -2 && detail.dealCancelType == 4">
                        <view class="title"> 未按时退货，退款关闭，订单交易正常进行 </view>
                        <view class="extra">
                            商家已经同意您的售后申请，但是由于您未按时处理货物和退货物流信息，因此退款关闭
                        </view>
                    </view>
                    <view v-if="detail.status == -1">
                        <view class="title"> 商家已拒绝原因 </view>
                        <view class="extra">{{ detail.refuseReason }}</view>
                    </view>
                </template>
            </view>
            <!-- 其他,退货申请未处理 -->
            <view
                v-if="trackingInfo?.logisticsNo"
                class="step-detail"
            >
                <view class="title"> 发货物流信息 </view>
                <view class="extra">
                    <label-value
                        label="物流公司"
                        :value="trackingInfo?.logisticsNo"
                    />
                    <label-value
                        label="物流编号"
                        :value="trackingInfo?.trackingNo"
                    />
                </view>
            </view>
            <view
                v-if="detail.status === 12 && detail.rejectTrackingInfo?.logisticsNo"
                class="step-detail"
            >
                <view class="title"> 退货寄回物流信息 </view>
                <view class="extra">
                    <label-value
                        label="物流公司"
                        :value="detail.rejectTrackingInfo?.logisticsName"
                    />
                    <label-value
                        label="物流编号"
                        :value="detail.rejectTrackingInfo?.trackingNo"
                    />
                </view>
            </view>
            <view
                v-if="[14, 15, 2].includes(detail.status) && detail.returnTrackingInfo?.logisticsNo"
                class="step-detail"
            >
                <view class="title"> 换货物流信息 </view>
                <view class="extra">
                    <label-value
                        label="物流公司"
                        :value="detail.returnTrackingInfo?.logisticsName"
                    />
                    <label-value
                        label="物流编号"
                        :value="detail.returnTrackingInfo?.trackingNo"
                    />
                </view>
            </view>

            <view
                v-if="detail.status === 102"
                class="step-detail"
            >
                <view class="title"> 先退款后退货 </view>
                <view class="extra">
                    请在48小时内把退货商品寄出，并填写对应寄出的快递单号，
                    完成寄出后您将享受退款快速到账，退款金额将打入您的支付宝账户。若超时未寄出则系统将自动关闭该售后
                </view>
            </view>
            <view
                v-if="
                    detail.status === 104 ||
                    detail.status === 105 ||
                    (detail.status === 2 && detail.fastRefund === 1)
                "
                class="step-detail"
            >
                <view class="title"> 先退款后退货 </view>
                <view class="extra">
                    <template v-if="detail.status === 105">
                        您的支付宝收款账户异常，打款失败，请更新您的收款账户
                    </template>
                    <template v-else>
                        退款金额将在3个工作日内打入您的支付宝账户，请关注支付宝账户信息。
                    </template>
                </view>
            </view>
        </view>
    </base-card>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
    gap: 40rpx;
}
.step-detail {
    .title {
        font-size: 28rpx;
        font-weight: bold;
    }
    .extra {
        margin-top: 20rpx;
        color: $uni-text-color-placeholder;
        font-size: 24rpx;
        line-height: 34rpx;
    }
}
</style>
