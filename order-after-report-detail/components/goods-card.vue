<script setup lang="ts">
import { ref } from 'vue';

import { fetchOrderDetail } from '../../api/order/index';
import type { OrderDetailResp, OrderItem } from '../../api/order/types';
import type { OrderInfo } from '../../api/order-after/types/dispute';

const props = defineProps<{
    goodsDetail: OrderInfo;
}>();
</script>

<template>
    <view class="content">
        <image
            class="goods-image"
            :src="goodsDetail?.goodsCover"
            mode="aspectFill"
        />
        <view class="goods-info">
            <view class="title ellipsis2"> {{ goodsDetail?.goodsTitle }} </view>
            <view class="property">
                <template
                    v-for="(item, index) in goodsDetail?.goodsSpec"
                    :key="index"
                >
                    {{ item.specName + ',' + item.specValue }}
                </template>
            </view>
            <view class="price-wrapper">
                <view class="price">
                    <zd-price
                        :font-size-large="32"
                        :font-size-small="24"
                        color="#292F33"
                        :value="goodsDetail?.money"
                    />
                    <text class="amount"><text>x</text>{{ goodsDetail?.num }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .goods-image {
        width: 180rpx;
        height: 180rpx;
        margin-right: 20rpx;
        border-radius: 8rpx;
    }
    .goods-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
        .title {
            line-height: 40rpx;
            color: $uni-color-title;
        }
        .property {
            color: $uni-color-paragraph;
            font-size: 24rpx;
        }
        .price-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .price {
                display: flex;
                align-items: flex-end;
                font-size: 32rpx;
                .amount {
                    margin-left: 10rpx;
                    color: $uni-color-paragraph;
                    font-size: 24rpx;
                    line-height: 24rpx;
                }
            }
            .status {
                color: $zd-main-color;
                font-size: 24rpx;
            }
        }
    }
}
.footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 36rpx;
}
</style>
