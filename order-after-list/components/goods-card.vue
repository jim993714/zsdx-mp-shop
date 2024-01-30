<script setup lang="ts">
import { ref } from 'vue';

import type { OrderDetailResp, OrderItem } from '../../api/order/types';
import { EnumOrderAfterType, STATUS_MAP } from '../../api/order-after/types/constants';
import type { OrderCancelApplyBase } from '../../api/order-after/types/order-after-list';

const props = defineProps<{
    item: OrderItem;
    detail: OrderCancelApplyBase;
}>();
</script>

<template>
    <view class="content">
        <image
            class="goods-image"
            :src="item?.goodsInfo?.thumbPic"
            mode="aspectFill"
        />
        <view class="goods-info">
            <view class="title ellipsis2"> {{ props.item?.goodsInfo?.title }} </view>
            <view class="property">
                <template
                    v-for="(item, index) in props.item?.goodsProductInfo?.goodsSpecs"
                    :key="index"
                >
                    {{ item.name + ',' + item.value }}
                </template>
            </view>
            <view class="price-wrapper">
                <view class="price">
                    <text class="label"> {{ STATUS_MAP[detail?.type ?? 0]?.status2 }}: </text>
                    <zd-price
                        v-if="detail.type !== EnumOrderAfterType.EXCHANGE"
                        :font-size-large="32"
                        :font-size-small="24"
                        color="#292F33"
                        :value="props.detail?.refundMoney"
                    />
                    <text
                        v-else
                        class="label"
                    >
                        {{ props.detail?.cancelApplyNum }}
                    </text>
                </view>
            </view>
        </view>
    </view>

    <template v-if="$slots.footer">
        <slot name="footer" />
    </template>
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
                position: relative;
                display: flex;
                align-items: flex-end;
                font-size: 32rpx;
                .label {
                    font-size: 28rpx;
                    line-height: 28rpx;
                }
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
