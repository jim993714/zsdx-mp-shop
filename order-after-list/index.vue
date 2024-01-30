<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import {
    delOrderCancelApply,
    fetchOrderCancelApplyList,
    repealOrderCancelApply
} from '../api/order-after/index';
import { EnumOrderAfterType, ORDER_STATUS_MAP } from '../api/order-after/types/constants';
import type { OrderCancelApplyBase, OrderItem } from '../api/order-after/types/order-after-list';
import BaseCard from '../order-after/components/base-card.vue';
import GoodsCard from './components/goods-card.vue';

const scrollId = ref('');
const afterList = ref<OrderCancelApplyBase[]>([]);
const loading = ref(0);

onReachBottom(async () => {
    if (scrollId.value === 'null') return;
    const resp = await fetchOrderCancelApplyList({
        scrollId: scrollId.value
    });
    scrollId.value = resp.scrollId || 'null';
    afterList.value = [...afterList.value, ...(resp.list ?? [])];
});

onPullDownRefresh(() => {
    scrollId.value = '';
    afterList.value = [];
    getData();
});

onMounted(() => {
    getData(true);
});

async function getData(init?: boolean) {
    if (init) {
        scrollId.value = '';
        afterList.value = [];
    }
    loading.value = 1;
    const resp = await fetchOrderCancelApplyList({
        scrollId: scrollId.value
    });
    loading.value = -1;

    scrollId.value = resp.scrollId || 'null';
    afterList.value = [...afterList.value, ...(resp.list || [])];
    uni.stopPullDownRefresh();
}

function toDetail(item: OrderCancelApplyBase) {
    router.push('orderAfterDetail', {
        applyNo: item.applyNo
    });
}

async function repeal(item: OrderCancelApplyBase) {
    console.log('???', item);

    let content = '本次申请撤销后，您仅能再发起一次售后，请您确认是否要撤销申请售后？';
    // TODO 是否要判断数量
    // if (item.cancelApplyNum === 1)
    //     content = '本次申请撤销后，您仅能再发起一次售后，请您确认是否要撤销申请售后？';
    // if (item.cancelApplyNum === 0)
    //     content = '本次申请撤销后将不能再申请该商品的售后，可通过客服介入来维权，确认撤销吗？';
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
        await repealOrderCancelApply({
            applyNo: item.applyNo
        });
        setTimeout(() => {
            getData(true);
        }, 600);
    }
}

async function del(item: OrderCancelApplyBase, index: number) {
    let resp = await new Promise(resolve => {
        uni.showModal({
            content: '确定删除记录?',
            confirmColor: '#199fff',
            cancelColor: '#8A9399',
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
        resp = await delOrderCancelApply({
            applyNo: item.applyNo
        });
        afterList.value?.splice?.(index, 1);
        setTimeout(() => {
            getData(true);
        }, 600);
    }
}

function statusFilter(status: number) {
    switch (status) {
        case 0:
            return '未申请';
        case 1:
        case 11:
        case 101:
        case 102:
        case 103:
            return '申请中';
        case 2:
        case 104:
        case 105:
            return '申请通过';
        case -1:
            return '申请不通过';
        case -2:
            return '撤销申请';
    }
}
function statusFilter2(status: number, money: number | string) {
    switch (status) {
        case 0:
            return '未申请';
        case 1:
            return '换货中（待商家处理）';
        case 11:
            return '换货中（待买家发货）';
        case 12:
            return '换货中（待商家收货）';
        case 13:
            return '换货中（待商家换货）';
        case 14:
            return '换货中（待买家签收）';
        case 15:
            return '换货中（待买家签收）';
        case 2:
            return '换货成功（换货已完成）';
        case -1:
            return '换货失败（换货被拒绝）';
        case -2:
            return '换货失败（买家取消）';
        case 3:
            return '换货失败（退款成功￥' + money + '）';
    }
}
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view class="container">
        <zd-empty
            v-if="afterList.length < 1 && scrollId === 'null'"
            image="https://nss1.zsdx.cn/mp-cs/images/shop/price-break/empty.png"
        >
            <template #description>
                <view class="empty"> 暂无记录哦～</view>
            </template>
        </zd-empty>
        <template v-else>
            <base-card
                v-for="(item, index) in afterList"
                :key="item.applyNo"
                :header-text="item.shopTitle ?? ''"
                header-icon="zdmp-dianpu"
            >
                <template #right>
                    <view
                        v-if="item.type === EnumOrderAfterType.REFUND"
                        class="base-card-right"
                    >
                        仅退款
                    </view>
                    <view
                        v-if="item.type === EnumOrderAfterType.REFUND_RETURN"
                        class="base-card-right"
                    >
                        <template v-if="[101, 102, 103, 104, 105, 111].includes(item.status ?? 0)">
                            极速退款
                        </template>
                        <template v-else>退货退款</template>
                    </view>
                    <view
                        v-if="item.type === EnumOrderAfterType.EXCHANGE"
                        class="base-card-right"
                    >
                        换货
                    </view>
                </template>
                <goods-card
                    forbid-req
                    :item="item.orderItemList?.[0]"
                    :detail="item"
                    :index="item.orderItemList?.map?.(order => order.index)"
                    @tap="toDetail(item)"
                />
                <view class="card-footer">
                    <view class="status">
                        <!-- <text class="text-1">退款状态</text>
                    <text class="text-2">
                        {{ ORDER_STATUS_MAP[item.status] }}
                    </text>
                    <text class="text-3">待卖家发货</text> -->

                        <template v-if="item.type === 3">
                            <text class="text-1">换货状态</text>
                            <text class="text-2">{{
                                statusFilter2(item.status ?? 0, item.refundMoney ?? '')
                            }}</text>
                        </template>
                        <template v-else>
                            <text class="text-1">退款状态</text>
                            <text class="text-2">{{ statusFilter(item.status ?? 0) }}</text>
                            <text
                                v-if="item.status == 0"
                                class="text-3"
                            >
                                未申请
                            </text>
                            <text
                                v-if="item.status == 1"
                                class="text-3"
                            >
                                申请退款中
                            </text>
                            <text
                                v-else-if="item.status == 2"
                                class="text-3"
                            >
                                退款成功¥{{ item.refundMoney }}
                            </text>
                            <text
                                v-else-if="(item.status ?? 0) < 0"
                                class="text-3 ellipsis"
                            >
                                退款关闭
                            </text>
                            <text
                                v-else-if="item.status === 1"
                                class="text-3"
                            >
                                退款处理中
                            </text>
                            <text
                                v-else-if="item.status === 11"
                                class="text-3"
                            >
                                待买家发货
                            </text>
                            <text
                                v-else-if="item.status === 12"
                                class="text-3"
                            >
                                待商家收货
                            </text>
                            <text
                                v-else-if="item.status === 101"
                                class="text-3"
                            >
                                申请退款中
                            </text>
                            <text
                                v-else-if="item.status === 102"
                                class="text-3"
                            >
                                待买家发货
                            </text>
                            <text
                                v-else-if="item.status === 103"
                                class="text-3"
                            >
                                申请退款中
                            </text>
                            <text
                                v-else-if="item.status === 104 || item.status === 105"
                                class="text-3"
                            >
                                退款成功¥{{ item.refundMoney }}
                            </text>
                        </template>
                    </view>

                    <view class="btn-group">
                        <zd-button
                            v-if="[1, 11, 101, 102, 103].includes(item.status ?? 0)"
                            style="margin-right: 20rpx"
                            @tap="repeal(item)"
                        >
                            撤销申请
                        </zd-button>
                        <zd-button
                            v-else-if="
                                item.status !== 12 &&
                                item.status !== 13 &&
                                item.status !== 14 &&
                                item.status !== 15 &&
                                item.status !== 101 &&
                                item.status !== 102 &&
                                item.status !== 103
                            "
                            style="margin-right: 20rpx"
                            @tap="del(item, index)"
                        >
                            删除记录
                        </zd-button>
                        <zd-button
                            type="outline"
                            @tap="toDetail(item)"
                        >
                            查看详情
                        </zd-button>
                    </view>
                </view>
            </base-card>
            <view class="list-bottom"> -到底了- </view>
        </template>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    height: 100%;
    height: 100%;
    padding-bottom: calc(env(safe-area-inset-bottom));
    flex-direction: column;
    flex: 1;
}
.container {
    display: flex;
    width: 750rpx;
    min-height: 100%;
    padding: 20rpx;
    background-color: #f5f8fa;
    flex-direction: column;
    box-sizing: border-box;
}
.base-card-right {
    color: $zd-main-color;
    font-size: 28rpx;
}
.card-footer {
    .status {
        display: flex;
        align-items: center;
        height: 64rpx;
        margin-top: 24rpx;
        padding: 0 24rpx;
        font-size: 24rpx;
        background-color: $uni-text-color-inverse;
        line-height: 64rpx;
        box-sizing: border-box;
        .text-1 {
            font-weight: bold;
        }
        .text-2 {
            display: inline-block;
            padding: 0 10rpx;
            color: $zd-main-color;
        }
    }
    .btn-group {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 20rpx;
        :deep(button) {
            height: 56rpx;
            padding: 0 24rpx;
            border-color: #d8d8d8;
            color: #666;
            font-size: 24rpx;
            line-height: 52rpx;
            font-weight: bold;
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

.list-bottom {
    margin-bottom: calc(env(safe-area-inset-bottom));
    text-align: center;
    color: $uni-text-color-placeholder;
    font-size: 24rpx;
}
</style>
