<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { cancelOrder, completeOrder, deleteOrder, remindDeliver } from '../../api/order-detail';
import multiPayPop from '../../components/order/multi-pay-pop.vue';
import type { Order } from '../types';
import goodsItem from './goods-item.vue';

const props = defineProps<{
    order: Order;
}>();
const multiPayPopRef = ref();
const emit = defineEmits(['operate', 'update:order', 'refresh', 'multiPay', 'pay']);
const orderItem = computed({
    get: () => {
        return props.order;
    },
    set: (value: Order) => {
        emit('update:order', value);
    }
});
const filterOrderStatus = (status: number) => {
    switch (status) {
        case 0:
            return '待付款';
        case 1:
            return '拼团中';
        case 2:
            return '待发货';
        case 301:
            return '待收货';
        case 302:
            return '送件中';
        case 3:
            return '待收货';
        case 4:
            return '已完成';
        case -1:
            return '交易失败';
        default:
            return '';
    }
};
const goDetail = (order: Order) => {
    // TODO 跳转订单详情
    router.push('orderDetail', {
        orderNo: order.orderNo
    });
};
const fnStop = (e: any) => {
    e && e.stopPropagation();
    return;
};
const multiPay = () => {
    emit('multiPay', props.order);
};
const callPay = async (payOrderNo: string) => {
    emit('pay', {
        payOrderNo: payOrderNo,
        order: props.order,
        money: props.order.money
    });
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
                await cancelOrder({ orderNo: props.order.orderNo });
                orderItem.value.status = -1;
                emit('operate', 'cancel');
            }
        }
    });
};
const fnDeleteOrder = async () => {
    uni.showModal({
        title: '', //提示标题
        content: '是否确认删除订单?', //提示内容
        cancelText: '再想想', // 取消按钮的文字
        confirmText: '确认', // 确认按钮文字
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        success: async res => {
            if (res.confirm) {
                await deleteOrder({ orderNo: props.order.orderNo });

                emit('operate', 'delete');
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
                    await completeOrder({ orderNo: props.order.orderNo });

                    emit('operate', 'complete');
                    router.push('orderDetail', {
                        orderNo: props.order.orderNo
                    });
                } catch (e: any) {
                    uni.showToast({
                        title: e.msg,
                        icon: 'none'
                    });
                }
            }
        }
    });
};
/**
 * 查看券码
 * @param code
 */
const fnPreviewCode = async (code: string) => {
    uni.showModal({
        title: '查看兑换码', //提示标题
        content: code, //提示内容
        showCancel: false, // 取消按钮的文字
        confirmText: '复制', // 确认按钮文字
        confirmColor: '#199FFF',
        cancelColor: '#8A9399',
        success: async res => {
            if (res.confirm) {
                uni.setClipboardData({
                    data: code,
                    success: () => {
                        uni.showToast({
                            title: '复制成功',
                            icon: 'none'
                        });
                    }
                });
            }
        }
    });
};
const fnRemindDeliver = async () => {
    await remindDeliver({ orderNo: props.order.orderNo });

    orderItem.value.alertHireToDeliver = 1;
    uni.showModal({
        title: '提醒发送成功', //提示标题
        content:
            '提醒发货消息已经发送给商家了，请留意发货状态，如果24小时未能发货，请联系商家询问原因', //提示内容
        showCancel: false,
        confirmText: '好的', // 确认按钮文字
        confirmColor: '#199FFF',
        cancelColor: '#8A9399'
    });
    emit('operate', 'remind');
};
const fnGoLog = () => {
    router.push('logistics', {
        orderNo: props.order.orderNo
    });
};
</script>
<template>
    <view
        class="order-item"
        @tap="goDetail(props.order)"
    >
        <view class="order-header">
            <zd-icon
                type="zdmp-dianpu"
                :size="32"
            />
            <view class="order-header-title">{{ order.studentShopName || order.shopTitle }}</view>
            <view
                v-if="order.trackingBySchoolAgent"
                class="order-header-agent-tag"
                >校内员工代收</view
            >
            <view class="order-header-seat"></view>
            <view class="order-header-status">{{ filterOrderStatus(order.status) }}</view>
        </view>
        <goodsItem
            v-for="(goods, gIndex) in order.orderItemList"
            :key="gIndex"
            :from-type="order.fromType"
            :goods="goods"
            :style="{ width: '100%' }"
        />
        <view class="order-bottom">
            <view class="order-bottom-summary">
                <view class="order-bottom-summary-count"
                    >共{{ order.orderItemList.length }}件商品</view
                >
                <view class="order-bottom-summary-title">{{
                    order.status === 0 ? '应付款:' : '实付款:'
                }}</view>
                <zd-price
                    :value="order.money"
                    color="rgba(41, 47, 51, 1)"
                    :font-size-large="32"
                    :font-size-small="32"
                    :font-size-unit="24"
                />
            </view>
            <!-- 联合支付提示 -->
            <view
                v-if="order.status === 0 && order.payRequireMulti === 1"
                class="order-bottom-tip"
                >点击付款时，共享优惠的订单将一起支付</view
            >
            <!-- TODO 根据订单状态显示不同按钮 -->
            <view
                class="order-bottom-buttons"
                @tap.prevent.stop="fnStop"
            >
                <!-- 等待付款 -->
                <template v-if="order.status === 0">
                    <view
                        class="order-bottom-button"
                        @tap="fnCancelOrder"
                        >取消订单</view
                    >
                    <view
                        v-if="order.payRequireMulti === 1"
                        class="order-bottom-button primary"
                        @tap="multiPay()"
                        >立即付款</view
                    >
                    <view
                        v-else
                        class="order-bottom-button primary"
                        @tap="callPay(props.order.payOrderNo)"
                        >立即付款</view
                    >
                </template>
                <template v-else-if="order.status === 1">
                    <view
                        class="order-bottom-button"
                        @tap="goKf"
                        >联系客服</view
                    >
                </template>
                <template v-else-if="order.status === 2">
                    <view
                        v-if="order.alertHireToDeliver == 0"
                        class="order-bottom-button plain"
                        @tap="fnRemindDeliver"
                        >提醒发货</view
                    >
                    <view
                        v-else
                        class="order-bottom-button disabled"
                        >已提醒</view
                    >
                </template>
                <template
                    v-else-if="order.status === 3 || order.status === 301 || order.status === 302"
                >
                    <view
                        v-if="order.shipType === 0"
                        class="order-bottom-button"
                        @tap="fnGoLog"
                    >
                        查看物流
                    </view>
                    <view
                        class="order-bottom-button primary"
                        @tap="fnCompleteOrder"
                        >确认收货</view
                    >
                </template>
                <template v-else-if="order.status === 4">
                    <view
                        class="order-bottom-button"
                        @tap="fnDeleteOrder"
                        >删除订单</view
                    >
                    <view
                        v-if="
                            order.virtualTrackingInfo &&
                            order.virtualTrackingInfo.exchangeCode &&
                            order.orderCategory !== 14
                        "
                        class="order-bottom-button primary"
                        @tap="fnPreviewCode(order.virtualTrackingInfo.exchangeCode)"
                        >查看券码</view
                    >
                    <view
                        v-if="order.shipType === 0"
                        class="order-bottom-button"
                        @tap="fnGoLog"
                        >查看物流</view
                    >
                </template>
                <template v-else-if="order.status === -1">
                    <view
                        class="order-bottom-button"
                        @tap="fnDeleteOrder"
                        >删除订单</view
                    >
                </template>
                <template v-else>
                    <view
                        class="order-bottom-button"
                        @tap="goKf"
                        >联系客服</view
                    >
                </template>
            </view>
        </view>
    </view>
    <multiPayPop ref="multiPayPopRef"></multiPayPop>
</template>
<style lang="scss" scoped>
.order-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 710rpx;
    margin: 20rpx 20rpx 0;
    padding: 24rpx;
    border-radius: 12rpx;
    background: #ffffff;
    box-sizing: border-box;
    flex-direction: column;
}
.order-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    flex-direction: row;
    padding-bottom: 20rpx;
    &-title {
        margin-left: 10rpx;
        color: #292f33;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 28rpx;
    }
    &-agent-tag {
        margin-left: 12rpx;
        padding: 0 8rpx;
        border: 2rpx solid $zd-main-color;
        border-radius: 16rpx;
        color: $zd-main-color;
        font-size: 20rpx;
        font-weight: 500;
        line-height: 32rpx;
    }
    &-seat {
        flex: 1;
    }
    &-status {
        color: $zd-main-color;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 28rpx;
    }
}
.order-bottom {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    height: 152rpx;
    flex-direction: column;
    &-summary {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        width: 100%;
        flex-direction: row;
        padding-bottom: 16rpx;
        &-count {
            margin-right: 28rpx;
            color: $uni-text-color-grey;
            font-size: 24rpx;
            line-height: 24rpx;
        }
        &-title {
            margin-right: 4rpx;
            color: $uni-text-color-grey;
            font-size: 24rpx;
            line-height: 24rpx;
        }
    }
    &-tip {
        margin-top: 16rpx;
        text-align: right;
        color: $uni-color-primary;
        font-size: 24rpx;
        line-height: 24rpx;
    }
    &-buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: row;
        flex-wrap: nowrap;
        margin-top: 16rpx;
    }
    &-button {
        height: 56rpx;
        margin-left: 20rpx;
        padding: 0 22rpx;
        border: 2rpx solid rgba(138, 147, 153, 0.3);
        border-radius: 28rpx;
        color: #576066;
        font-size: 24rpx;
        font-weight: 500;
        box-sizing: border-box;
        line-height: 52rpx;
        &.primary {
            border: 2rpx solid $zd-main-color;
            color: #fff;
            background-color: $zd-main-color;
        }
        &.plain {
            border: 2rpx solid $zd-main-color;
            color: $zd-main-color;
            background-color: #fff;
        }
    }
}
</style>
