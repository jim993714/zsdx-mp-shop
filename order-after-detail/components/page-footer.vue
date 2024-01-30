<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { completeOrderCancelApply, repealOrderCancelApply, setTrack } from '../../api/order-after';
import type { OrderCancelApplyDetailResp } from '../../api/order-after/types/order-after-details';
import AgencyWechatPop from './agency-wechat-pop.vue';
import LogisticsPopup from './logistics-popup.vue';

const logisticsPopupRef = ref<InstanceType<typeof LogisticsPopup>>();
const agencyWechatPopRef = ref<InstanceType<typeof AgencyWechatPop>>();

const props = defineProps<{
    detail: OrderCancelApplyDetailResp;
    applyNo: string;
}>();

const emits = defineEmits<{
    (e: 'complate'): void;
}>();

const { detail } = toRefs(props);

function toMessage() {
    router.push('chatRoom', {
        shopNo: detail.value.shopNo,
        goodsNo: detail.value?.orderItemList?.[0]?.goodsInfo?.goodsNo
    });
}

async function toDispute() {
    router.push('orderAfterReport', {
        applyNo: props.applyNo
    });
}

async function reApply() {
    router.redirect('orderAfterSelectType', {
        orderNo: detail.value.orderNo,
        index: detail.value.orderItemList?.map(item => item.index).join(',')
    });
}

async function edit() {
    router.push('orderAfter', {
        type: detail.value.type,
        orderNo: detail.value.orderNo,
        applyNo: props.applyNo,
        index: detail.value.orderItemList?.map(item => item.index).join(','),
        mode: 'edit'
    });
}

async function complate() {
    const resp = await completeOrderCancelApply({
        applyNo: props.applyNo
    });
    if (resp) {
        uni.showToast({
            title: '完成'
        });
    }

    emits('complate');
}

async function repeal() {
    let content = '';
    if (detail.value.lastCancelApplyCount === 1)
        content = '本次申请撤销后，您仅能再发起一次售后，请您确认是否要撤销申请售后？';
    if (detail.value.lastCancelApplyCount === 0)
        content = '本次申请撤销后将不能再申请该商品的售后，可通过客服介入来维权，确认撤销吗？';
    let resp = await new Promise(resolve => {
        uni.showModal({
            content: content,
            confirmColor: '#199fff',
            confirmText: '继续撤销',
            cancelColor: '#8A9399',
            cancelText: '再想想',
            success: function (res) {
                if (res.confirm) {
                    resolve(1);
                } else if (res.cancel) {
                    resolve(0);
                }
            }
        });
    });
    if (resp) {
        resp = await repealOrderCancelApply({
            applyNo: props.applyNo
        });
        if (resp) {
            emits('complate');
        }
    }
}

async function complateTrackNumber(payload: { logisticsNo: string; trackingNo: string }) {
    try {
        const resp = await setTrack({
            ...payload,
            applyNo: props.applyNo
        });
        if (resp) {
            router.push('orderAfterStatus', {
                info: '卖家已收到您的退货物流信息，这将加快退款的审核速度，促进您的退款尽快通过'
            });
        }
    } catch (err) {
        uni.showToast({
            title: (err as any).msg,
            icon: 'none'
        });
    }
}
</script>

<template>
    <view class="footer-warpper">
        <view class="footer">
            <zd-button
                v-if="detail.status === 101"
                type="outline"
                @tap.stop="agencyWechatPopRef?.open()"
            >
                联系代理
            </zd-button>
            <block v-if="detail.status === 1">
                <!-- 待付款 -->
                <zd-button
                    type="outline"
                    @tap.stop="toMessage()"
                >
                    联系客服
                </zd-button>
                <zd-button
                    type="primary"
                    class="primary"
                    @tap.stop="repeal()"
                >
                    撤销申请
                </zd-button>
                <!-- <zd-button
                    type="primary"
                    class="primary"
                    @tap.stop="edit()"
                >
                    修改申请
                </zd-button> -->
            </block>
            <block v-else-if="detail.status === 11 || detail.status === 102">
                <!-- 待付款 -->
                <zd-button
                    type="outline"
                    @tap.stop="toMessage()"
                >
                    联系客服
                </zd-button>
                <zd-button
                    type="outline"
                    @tap.stop="logisticsPopupRef?.open()"
                >
                    退货快递单号
                </zd-button>
                <zd-button
                    type="primary"
                    class="primary"
                    @tap.stop="repeal()"
                >
                    撤销申请
                </zd-button>
            </block>
            <block v-else-if="detail.status === 12">
                <!-- 待付款 -->
                <zd-button
                    type="outline"
                    @tap.stop="toMessage()"
                >
                    联系客服
                </zd-button>
                <zd-button
                    type="outline"
                    @tap.stop="logisticsPopupRef?.open()"
                >
                    退货快递单号
                </zd-button>
            </block>
            <block v-else-if="detail.status === 14 || detail.status === 15">
                <!-- 待付款 -->
                <zd-button
                    type="outline"
                    @tap.stop="toMessage()"
                >
                    联系客服
                </zd-button>
                <zd-button
                    v-if="detail.canDispute == 1"
                    type="outline"
                    @tap.stop="toDispute()"
                >
                    平台介入
                </zd-button>
                <zd-button
                    type="primary"
                    class="primary"
                    @tap.stop="complate()"
                >
                    确认完成
                </zd-button>
            </block>
            <block v-else-if="detail.status === 2">
                <!-- 待付款 -->
                <zd-button
                    type="outline"
                    @tap.stop="toMessage()"
                >
                    联系客服
                </zd-button>
                <!-- <zd-button type="outline" @tap.stop="showDelete=true">删除记录</zd-button> -->
            </block>
            <block v-else>
                <!-- 待付款 -->
                <zd-button
                    v-if="detail.canDispute == 1"
                    type="outline"
                    @tap.stop="toDispute()"
                >
                    平台介入
                </zd-button>
                <zd-button
                    v-if="(detail.canCancelApply ?? 0) > 0"
                    type="outline"
                    @tap.stop="reApply()"
                >
                    重新申请
                </zd-button>
                <zd-button
                    type="outline"
                    @tap.stop="toMessage()"
                >
                    联系客服
                </zd-button>
                <zd-button
                    v-if="detail.status === 101"
                    type="primary"
                    class="primary"
                    @tap.stop="repeal()"
                >
                    撤销申请
                </zd-button>
            </block>
        </view>
    </view>
    <logistics-popup
        ref="logisticsPopupRef"
        :logistics-name="detail.rejectTrackingInfo?.logisticsName"
        :logistics-no="detail.rejectTrackingInfo?.logisticsNo"
        :tracking-no="detail.rejectTrackingInfo?.trackingNo"
        @confirm="complateTrackNumber"
    />
    <agency-wechat-pop
        ref="agencyWechatPopRef"
        :img="detail.fastRefundAuditContactInfo?.wechatQrcode ?? ''"
        :phone="detail.fastRefundAuditContactInfo?.phone ?? ''"
    />
</template>

<style scoped lang="scss">
.footer-warpper {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    padding-bottom: calc(env(safe-area-inset-bottom));
    background-color: #fff;
    box-sizing: border-box;
    .footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 96rpx;
        box-sizing: inherit;
        padding: 0 20rpx;
        :deep(button) {
            height: 56rpx;
            margin-left: 20rpx;
            border-color: #d8d8d8;
            color: #666;
            font-size: 24rpx;
            font-weight: bold;
            line-height: 52rpx;
        }
        .primary {
            color: #fff;
            :deep(button) {
                height: 56rpx;
                margin-left: 20rpx;
                color: #fff;
                font-size: 24rpx;
                font-weight: bold;
                line-height: 56rpx;
            }
        }
    }
}
</style>
