<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { toPriceBreak } from '@/pages/shop/price-break/usePriceBreak';

import type { GoodsDetail, GoodsTag } from '../../api/goods-detail/types';
import serviceDialog from './service-pop.vue';

const props = withDefaults(
    defineProps<{
        goodsNo: string;
        goodsDetail: GoodsDetail;
        showSpecial: boolean;
    }>(),
    {
        showSpecial: false
    }
);
const servicePopRef = ref();
const serviceList = computed<GoodsTag[]>(() => {
    let list: GoodsTag[] = [
        // {
        //     title: '先用后买',
        //     desc: '校内员工承诺为粉丝提供先体验后下单的服务，校内员工的粉丝若购买前想要先体验了解样品，则可以让校内员工提前将产品带到寝室进行线下体验，体验后再决定是否购买。'
        // },
        {
            title: '送货到寝',
            desc: '校内员工承诺为粉丝提供送货到寝服务，所有用户从校内员工这边购物的订单均可以由校内员工进行代拿快递送货到寝。'
        }
    ];

    if (showFirst.value) {
        list.unshift({
            title: '全网最低价，买贵补差价',
            desc: '校内员工承诺为粉丝提供的所有商品价格不高于该商品在任何平台旗舰店的价格，若粉丝发现价格高于其它平台旗舰店价格，通过“爆料低价”，审核通过后可获得对应商品5折券。'
        });
    }
    if (props.goodsDetail.canQuickRefund === 1) {
        list.push({
            title: '先退款后退货',
            desc: '满足条件审核通过后，诚信用户在退货寄出后，可享受快速退款到账。'
        });
    }
    return list;
});
const showFirst = computed(() => {
    return props.goodsDetail.goodsShowPriceType === 2;
});
const serviceText = computed(() => {
    let list = ['送货到寝'];

    if (showFirst.value) {
        list.unshift('全网最低价');
    }
    if (props.goodsDetail.canQuickRefund === 1) {
        list.push('先退款后退货');
    }

    return list.join(' · ');
});
const fnShowPop = () => {
    servicePopRef.value.open();
};
const goExpose = async () => {
    await toPriceBreak(props.goodsNo, uni.getStorageSync('studentShopId'));
};
</script>
<template>
    <view
        v-if="serviceList.length > 0"
        class="service-wrap"
        @tap="fnShowPop"
    >
        <image
            class="service-decorate"
            src="https://cdn.zsdx.cn/mp-cs/images/shop/detail/service-decorate.png"
            mode="scaleToFill"
        />
        <view class="service-text ellipsis">{{ serviceText }}</view>
        <zd-icon
            type="zdmp-qianwang"
            color="#199FFF"
            :size="32"
        ></zd-icon>
    </view>
    <serviceDialog
        ref="servicePopRef"
        :service-list="serviceList"
        :goods-detail="goodsDetail"
        @go-expose="goExpose"
    />
</template>
<style lang="scss" scoped>
.service-wrap {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    width: 710rpx;
    height: 88rpx;
    margin: 20rpx 20rpx -36rpx;
    padding: 0 20rpx;
    padding-bottom: 16rpx;
    border-radius: 16rpx 16rpx 0 0;
    background: linear-gradient(
        90deg,
        #e6f4ff 0%,
        rgba(179, 242, 255, 0.66) 33%,
        #ebf9fd 65%,
        #e6f4ff 100%
    );
    box-sizing: border-box;
    flex-direction: row;
}
.service-decorate {
    position: absolute;
    top: 12rpx;
    left: 490rpx;
    width: 66rpx;
    height: 76rpx;
}
.service-text {
    padding-right: 20rpx;
    color: #199fff;
    font-size: 24rpx;
    flex: 1;
    line-height: 32rpx;
    box-sizing: border-box;
}
</style>
