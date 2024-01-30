<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import type { CSSProperties } from 'vue';

import { pay } from '@/utils/pay';

import type { OrderDetailResp, OrderItem, ResponseOrder1 } from '../../api/order/types';
import { cancelOrder, completeOrder, deleteOrder, remindDeliver } from '../../api/order-detail';
import multiPayPop from '../../components/order/multi-pay-pop.vue';
import type { MultiPayResult } from '../../components/order/types';
import { OrderType } from '../../order-confirm/types';

const props = defineProps<{
    orderNo: string;
    orderDetail: OrderDetailResp | undefined;
}>();
const emit = defineEmits(['operate']);
const buttonStyle: CSSProperties = {
    width: 'max-content',
    lineHeight: '56rpx',
    padding: '0 22rpx',
    height: '56rpx',
    marginRight: '20rpx',
    fontSize: '28rpx',
    boxSizing: 'border-box',
    fontWeight: 600
};
const defaultButtonStyle: CSSProperties = {
    width: 'max-content',
    lineHeight: '56rpx',
    padding: '0 22rpx',
    height: '56rpx',
    marginRight: '20rpx',
    fontSize: '28rpx',
    boxSizing: 'border-box',
    color: '#66666',
    fontWeight: 600
};
const multiPayPopRef = ref();
const batchApplyList = computed(() => {
    // TODO 计算可退货申请数量
    console.log('orderDetail', props.orderDetail);
    let list: OrderItem[] = [];
    props.orderDetail?.buyStudentList?.forEach((item: ResponseOrder1) => {
        if (item.isOwner) {
            item.orderItemList?.forEach((orderItem: OrderItem) => {
                if (orderItem.canCancelApply === 1) {
                    list.push(orderItem);
                }
            });
        }
    });
    return list;
});
const fnBatchAfterSale = () => {
    router.push('orderAfterSelectGoods', {
        orderNo: props.orderNo,
        index: '',
        multi: 'true'
    });
};
const multiPay = () => {
    multiPayPopRef.value.open({ orderNo: props.orderNo });
};
const doMultiPay = async ({ payOrderNo, money }: MultiPayResult) => {
    callPay(payOrderNo, money);
};
const callPay = async (payOrderNo?: string, payMoney?: number | string) => {
    if (payOrderNo) {
        try {
            await pay([payOrderNo], OrderType.GoodsOrder);
            router.redirect('payResult', {
                money: payMoney,
                orderNo: props.orderNo
            });
        } catch (e: any) {
            uni.showToast({
                title: e.msg || '支付异常',
                icon: 'none'
            });
        }
    } else {
        uni.showToast({
            title: '订单号缺失',
            icon: 'none'
        });
    }
};
const fnCancelApply = () => {
    console.log('确认收货');
    // delOrderCancelApply({ applyNo: props.order.applyNo });
};
const goKf = () => {
    router.push('chatRoom', {});
};
const fnCancelOrder = async () => {
    uni.showModal({
        title: '', //提示标题
        content: '是否确认取消订单?', //提示内容
        cancelText: '再想想', // 取消按钮的文字
        confirmText: '确认', // 确认按钮文字
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        success: async res => {
            if (res.confirm) {
                try {
                    await cancelOrder({ orderNo: props.orderNo });

                    emit('operate', 'cancel');
                } catch (e: any) {
                    uni.showToast({
                        title: e.msg || '删除异常',
                        icon: 'none'
                    });
                }
            }
        }
    });
};
const fnDeleteOrder = async () => {
    uni.showModal({
        title: '', //提示标题
        content: '是否确认删除订单?', //提示内容
        cancelText: '取消', // 取消按钮的文字
        confirmText: '确认', // 确认按钮文字
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        success: async res => {
            if (res.confirm) {
                try {
                    await deleteOrder({ orderNo: props.orderNo });

                    emit('operate', 'delete');
                } catch (e: any) {
                    uni.showToast({
                        title: e.msg || '删除异常',
                        icon: 'none'
                    });
                }
            }
        }
    });
};
const fnCompleteOrder = async () => {
    uni.showModal({
        title: '', //提示标题
        content: '是否确认收货?', //提示内容
        cancelText: '取消', // 取消按钮的文字
        confirmText: '确认', // 确认按钮文字
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        success: async res => {
            if (res.confirm) {
                try {
                    await completeOrder({ orderNo: props.orderNo });

                    emit('operate', 'complete');
                } catch (e: any) {
                    uni.showToast({
                        title: e.msg || '删除异常',
                        icon: 'none'
                    });
                }
            }
        }
    });
};
const fnRemindDeliver = async () => {
    await remindDeliver({ orderNo: props.orderNo });

    emit('operate', 'remind');
    uni.showModal({
        title: '提醒发送成功', //提示标题
        content:
            '提醒发货消息已经发送给商家了，请留意发货状态，如果24小时未能发货，请联系商家询问原因', //提示内容
        confirmText: '确认', // 确认按钮文字
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        showCancel: false
    });
};
const fnGoLog = () => {
    router.push('logistics', {
        orderNo: props.orderNo
    });
};
const goShare = () => {
    router.push('campusGroupDetail', {
        schoolDumplingId: props.orderDetail?.schoolDumplingInfo?.schoolDumplingId,
        activityNo: props.orderDetail?.schoolDumplingInfo?.activityNo
    });
};
</script>
<template>
    <view
        class="page-footer-seat savepadding"
        :class="{
            'page-footer-seat-tip': orderDetail?.selfPayRequireMulti === 1
        }"
    ></view>

    <view
        class="page-footer savepadding"
        :class="{
            'page-footer-tip': orderDetail?.selfPayRequireMulti === 1
        }"
    >
        <view
            v-if="orderDetail?.status === 0 && orderDetail?.selfPayRequireMulti === 1"
            class="multi-pay-tip"
            >点击付款时，共享优惠的订单将一起支付</view
        >
        <template v-if="orderDetail?.status === 0">
            <zd-button
                :button-style="defaultButtonStyle"
                @tap="goKf"
                >联系客服</zd-button
            >
            <zd-button
                :button-style="defaultButtonStyle"
                @tap="fnCancelOrder"
                >取消订单</zd-button
            >
            <zd-button
                v-if="orderDetail?.selfPayRequireMulti === 1"
                type="primary"
                :button-style="buttonStyle"
                @tap="multiPay"
            >
                立即付款
            </zd-button>
            <zd-button
                v-else
                type="primary"
                :button-style="buttonStyle"
                @tap="callPay(orderDetail.selfPayOrderNo, orderDetail?.money)"
            >
                立即付款
            </zd-button>
        </template>
        <template v-if="orderDetail?.status === 1">
            <zd-button
                :button-style="defaultButtonStyle"
                @tap="goKf"
                >联系客服</zd-button
            >
            <zd-button
                v-if="orderDetail.schoolDumplingInfo"
                type="primary"
                :button-style="buttonStyle"
                @tap="goShare"
            >
                邀请
            </zd-button>
        </template>
        <template v-if="orderDetail?.status === 2">
            <zd-button
                :button-style="defaultButtonStyle"
                @tap="goKf"
                >联系客服</zd-button
            >
            <zd-button
                v-if="
                    batchApplyList.length > 1 &&
                    orderDetail.orderCategory !== 10 &&
                    orderDetail.orderCategory !== 12
                "
                :button-style="defaultButtonStyle"
                @tap.stop="fnBatchAfterSale()"
                >批量退款</zd-button
            >
            <zd-button
                v-if="orderDetail.alertHireToDeliver == 0"
                :button-style="defaultButtonStyle"
                @tap.stop="fnRemindDeliver()"
                >提醒发货</zd-button
            >
            <zd-button
                v-if="orderDetail.alertHireToDeliver == 1"
                :button-style="defaultButtonStyle"
                >已提醒</zd-button
            >
        </template>
        <template
            v-if="
                orderDetail?.status === 3 ||
                orderDetail?.status === 301 ||
                orderDetail?.status === 302
            "
        >
            <zd-button
                :button-style="defaultButtonStyle"
                @tap="goKf"
                >联系客服</zd-button
            >
            <zd-button
                v-if="
                    batchApplyList.length > 1 &&
                    orderDetail.orderCategory !== 10 &&
                    orderDetail.orderCategory !== 12
                "
                :button-style="defaultButtonStyle"
                @tap.stop="fnBatchAfterSale()"
                >批量退款</zd-button
            >
            <zd-button
                v-if="orderDetail.shipType === 0"
                :button-style="defaultButtonStyle"
                @tap="fnGoLog"
                >查看物流</zd-button
            >
            <zd-button
                type="primary"
                :button-style="buttonStyle"
                @tap="fnCompleteOrder"
            >
                确认收货
            </zd-button>
        </template>
        <template v-if="orderDetail?.status === 4">
            <zd-button
                :button-style="defaultButtonStyle"
                @tap="goKf"
                >联系客服</zd-button
            >
            <zd-button
                v-if="
                    batchApplyList.length > 1 &&
                    orderDetail.orderCategory !== 10 &&
                    orderDetail.orderCategory !== 12
                "
                :button-style="defaultButtonStyle"
                @tap.stop="fnBatchAfterSale()"
                >批量退款</zd-button
            >
        </template>
        <template v-if="orderDetail?.status === -2">
            <zd-button :button-style="defaultButtonStyle">联系客服</zd-button>
        </template>
        <template v-if="orderDetail?.status === -4">
            <zd-button
                :button-style="defaultButtonStyle"
                @tap="goKf"
                >联系客服</zd-button
            >
            <zd-button
                v-if="orderDetail.orderCategory !== 10 && orderDetail?.orderCategory !== 12"
                :button-style="defaultButtonStyle"
                >退货快递单号</zd-button
            >
        </template>
    </view>
    <multiPayPop
        ref="multiPayPopRef"
        @pay="doMultiPay"
    ></multiPayPop>
</template>
<style lang="scss" scoped>
.page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 750rpx;
    height: 96rpx;
    background-color: #fff;
    flex-direction: row;
    box-shadow: 0px -2rpx 8rpx 0px rgba(0, 0, 0, 0.03);
    &-tip {
        padding-top: 60rpx;
    }
    &-seat {
        height: 96rpx;
        &-tip {
            height: 156rpx;
        }
    }
}
.multi-pay-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
    height: 60rpx;
    text-align: center;
    color: rgba(25, 159, 255, 1);
    font-size: 24rpx;
    font-weight: 400;
    background: rgba(25, 159, 255, 0.1);
    line-height: 60rpx;
}
</style>
