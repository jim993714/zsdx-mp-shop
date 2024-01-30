<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import definePageProps from '@/utils/definePageProps';

import { fetchOrderDetail } from '../api/order/index';
import type { OrderDetailResp, OrderItem, ResponseOrder1 } from '../api/order/types';
import { EnumOrderAfterType } from '../api/order-after/types/constants';
import GoodsCardSingle from '../order-after/components/goods-card-single.vue';

definePageProps<{
    from: string;
}>();

const goodsList = ref<OrderItem[]>([]);

/** 订单详情 */
const orderDetail = ref<OrderDetailResp>();
interface Options {
    type: EnumOrderAfterType;
    orderNo: '';
    index: string[];
    from: string;
    multi: string;
}
const options = ref<Options>({
    type: 1,
    orderNo: '',
    index: [],
    from: '',
    multi: ''
});

onLoad(options_ => {
    options.value = options_ as Options;
    options.value.index = options_?.index?.split(',').filter((i: string) => i);

    console.log('====', options.value.index);

    getGoodsList();
});

function confirm() {
    if (options.value.index.length < 1)
        return uni.showToast({
            title: '请选择要退款的商品',
            icon: 'none'
        });
    const params = {
        ...options.value,
        index: options.value.index.join(','),
        form: 'orderAfterSelectGoods'
    };

    if (orderDetail.value?.status === 2) {
        return router.redirect('orderAfter', {
            ...params,
            type: EnumOrderAfterType.REFUND,
            multi: 'true'
        });
    }

    if (options.value.from === 'orderAfterSelectType') {
        router.redirect('orderAfterSelectType', params);
    } else if (options.value.from === 'orderAfter') {
        router.redirect('orderAfter', params);
    } else {
        router.redirect('orderAfterSelectType', params);
    }
}

async function getGoodsList() {
    const resp = await fetchOrderDetail({
        orderNo: options.value.orderNo
    });
    orderDetail.value = resp!;
    if (resp.buyStudentList && Array.isArray(resp.buyStudentList)) {
        for (let item of resp.buyStudentList) {
            goodsList.value = [...goodsList.value!, ...(item.orderItemList ?? [])];
        }
    }
}

/**
 * 切换订单选择状态
 */
function toggleSelect(item: OrderItem) {
    const idx = options.value.index?.findIndex((value: string) => parseInt(value) === item.index);
    if (idx < 0) {
        options.value.index?.push(item.index + '');
    } else {
        options.value.index?.splice(idx, 1);
    }
}

function selectAll() {
    if (options.value.index.length === goodsList.value.length) {
        options.value.index = [];
    } else {
        options.value.index = goodsList.value.map(item => item.index + '');
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
        <view
            v-for="(item, gIdx) in goodsList"
            :key="gIdx"
            class="goods-card"
            @click="toggleSelect(item)"
        >
            <view class="radio">
                <zd-icon
                    v-if="options.index?.includes(item.index!+'')"
                    type="zdmp-yigouxuan1"
                    :size="36"
                    color="#20A0FF"
                />
            </view>
            <goods-card-single
                show-status
                style="flex: 1"
                forbid-req
                :item="item"
                :status="orderDetail?.status"
            >
            </goods-card-single>
        </view>
        <view class="footer">
            <view
                class="radio-wrapper"
                @tap="selectAll"
            >
                <view class="radio">
                    <zd-icon
                        v-if="options.index.length === goodsList.length"
                        type="zdmp-yigouxuan1"
                        :size="36"
                        color="#20A0FF"
                    />
                </view>
                全选<template v-if="options.index.length > 0">
                    ({{ options.index.length }})
                </template>
            </view>
            <zd-button
                type="primary"
                @tap="confirm"
            >
                确定
            </zd-button>
        </view>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    height: 100%;
    height: 100%;
    padding-bottom: 50rpx;
    flex-direction: column;
    flex: 1;
}
.container {
    display: flex;
    width: 750rpx;
    min-height: 100%;
    padding: 20rpx;
    padding-bottom: 148rpx;
    background-color: #f5f8fa;
    flex-direction: column;
    box-sizing: border-box;
}

.goods-card {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 12rpx;
    background-color: #fff;
    box-sizing: border-box;
}
.radio {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28rpx;
    height: 28rpx;
    margin-right: 20rpx;
    border: 1px solid #d8d8d8;
    border-radius: 14rpx;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 24rpx 20rpx;
    padding-bottom: 44rpx;
    background-color: #fff;
    box-sizing: border-box;
    .radio-wrapper {
        display: flex;
        align-items: center;
        color: $uni-color-paragraph;
        font-size: 28rpx;
    }
}
</style>
