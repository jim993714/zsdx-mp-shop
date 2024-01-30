<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        /** 是否现实 foote */
        showFooter?: boolean;

        showStatus?: boolean;

        goodsDetail?: Record<string, any>;
    }>(),
    {
        showFooter: false,
        showStatus: false
    }
);
</script>

<template>
    <view class="content">
        <image
            class="goods-image"
            :src="props.goodsDetail?.goodsUrl"
            mode="aspectFill"
        />
        <view class="goods-info">
            <view class="title ellipsis">{{ props.goodsDetail?.goodsTitle }}</view>
            <view class="property">{{
                props.goodsDetail?.spec
                    ?.map((item: any) => [item.name, item.specValue].join(':'))
                    .join(',')
            }}</view>
            <view class="price-wrapper">
                <view class="price">
                    <view
                        v-if="props.goodsDetail?.reportPrice"
                        class="label"
                        >您爆料的同款价格</view
                    >
                    <zd-price
                        :font-size-large="32"
                        :font-size-small="32"
                        color="#292F33"
                        :value="props.goodsDetail?.reportPrice || props.goodsDetail?.price"
                    />
                    <text
                        v-if="!props.goodsDetail?.reportPrice"
                        class="amount"
                        ><text>x</text>1</text
                    >
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .goods-image {
        width: 128rpx;
        height: 128rpx;
        margin-right: 20rpx;
        border-radius: 8rpx;
    }
    .goods-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
        .title {
            max-width: 450rpx;
            color: $uni-color-title;
            line-height: 40rpx;
            flex: 1;
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
</style>
