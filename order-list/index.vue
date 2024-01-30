<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { useUserStore } from '@/stores/user';
import { pay } from '@/utils/pay';

import type { OrderSearchParam } from '../api/order-list/types';
import multiPayPop from '../components/order/multi-pay-pop.vue';
import type { MultiPayResult } from '../components/order/types';
import { OrderType } from '../order-confirm/types';
import orderItem from './components/order-item.vue';
import searchBar from './components/search-bar.vue';
import type { Order, TabItem } from './types';

const tabs = ref<TabItem[]>([
    {
        label: '全部',
        key: 'all',
        value: 0,
        list: [],
        url: '/student-school-shop/order/list'
    },
    {
        label: '待付款',
        value: 1,
        key: 'buy',
        list: [],
        url: '/student-school-shop/order/list'
    },
    {
        label: '待发货',
        value: 5,
        key: 'send',
        list: [],
        url: '/student-school-shop/order/list'
    },
    {
        label: '待收货',
        value: 3,
        key: 'receive',
        list: [],
        url: '/student-school-shop/order/list'
    }
]);
const currTabValue = ref(0);
const multiPayPopRef = ref();
const currTab = computed(() => {
    return tabs.value.find((item: TabItem) => {
        return currTabValue.value === item.value;
    });
});
const userStore = useUserStore();
const { studentShopId } = toRefs(userStore);
const filter = ref<OrderSearchParam>({
    keyword: '',
    studentShopId: '',
    status: 0
});
const refreshTime = ref(0);
const paramsList = computed<any>(() => {
    return {
        0: {
            ...filter.value,
            status: 0,
            refreshTime: refreshTime.value
        },
        1: {
            ...filter.value,
            status: 1,
            refreshTime: refreshTime.value
        },
        5: {
            ...filter.value,
            status: 5,
            refreshTime: refreshTime.value
        },
        3: {
            ...filter.value,
            status: 3,
            refreshTime: refreshTime.value
        }
    };
});
const fnRefresh = () => {
    const time = dayjs().valueOf();

    refreshTime.value = time;
};

const fnSearch = (param: any) => {
    filter.value = param;
    fnRefresh();
};

const fnOperate = (index: number, tabIndex: number, type: string) => {
    console.log('operate');
    fnRefresh();
};

const multiPay = (order: Order) => {
    multiPayPopRef.value.open(order);
};
const fnPay = async ({ payOrderNo, order, money }: MultiPayResult) => {
    if (payOrderNo) {
        try {
            await pay([payOrderNo], OrderType.GoodsOrder);
            order.status = 2;
            router.redirect('payResult', {
                money: money,
                orderNo: order.orderNo
            });
        } catch (e: any) {
            console.log('出现异常', e);
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
onLoad((options: any) => {
    currTabValue.value = options.status ? +options.status : 0;
});
</script>
<template>
    <view class="page-wrap">
        <zd-navbar
            relative
            title="订单列表"
        />
        <searchBar @search="fnSearch" />
        <view class="page-body">
            <zd-tabbar
                v-model="currTabValue"
                :items="tabs"
                :scroll="false"
            >
                <template #default="{ item }">
                    <zd-list
                        v-model="item.list"
                        open-refresh
                        :enhanced="false"
                        :params="paramsList[item.value]"
                        height="100%"
                        :url="item.url"
                    >
                        <template #default="orderObj">
                            <order-item
                                :order="orderObj.item"
                                @operate="fnOperate(orderObj.index, item.index, $event)"
                                @multi-pay="multiPay"
                                @pay="fnPay"
                            />
                        </template>
                        <template #empty>
                            <zd-empty
                                image="https://cdn.zsdx.cn/mp-cs/images/empty/empty_order.png"
                                :image-width="450"
                                :image-height="250"
                                description="暂无订单记录哦~"
                            ></zd-empty>
                        </template>
                    </zd-list>
                </template>
            </zd-tabbar>
        </view>
    </view>
    <multiPayPop
        ref="multiPayPopRef"
        @pay="fnPay"
    ></multiPayPop>
</template>

<style>
page {
    background-color: #f5f8fa;
}
</style>
<style lang="scss" scoped>
.page-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    width: 750rpx;
    height: 100%;
    flex-direction: column;
    box-sizing: border-box;
}
.page-body {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 750rpx;
    flex-direction: column;
    box-sizing: border-box;
}
.scroll-list {
    height: 100%;
}
</style>
