<script setup lang="ts">
import type { IGoodsList } from '../../api/combination-package-goods-detail/types';

const props = defineProps<{
    list: Array<IGoodsList>;
    goodsIndex: number;
    goodsNum: number;
}>();

const checkGoods = (item: IGoodsList, index: number) => {
    emit('checkGoods', item, index);
};

const emit = defineEmits(['checkGoods']);
</script>

<template>
    <view class="package-warp">
        <view class="package-head">组合包内商品（1共{{ props.goodsNum }}款）</view>
        <scroll-view
            scroll-x
            class="scroll-view"
            :show-scrollbar="false"
            :scroll-with-animation="true"
            :enable-flex="true"
        >
            <template
                v-for="(item, index) in props.list"
                :key="index"
            >
                <view
                    class="goods-item"
                    :style="{
                        borderColor: goodsIndex === index ? ' #ffeebc' : 'transparent',
                        backgroundColor: goodsIndex === index ? '#fff9e6' : '#edf0f2'
                    }"
                    @tap.prevent="checkGoods(item, index)"
                >
                    <view class="goods-cover-warp">
                        <image
                            class="goods-cover-img"
                            :src="item.goodsCover"
                            mode="scaleToFill"
                        />
                        <view class="goods-cover-mask">
                            <view
                                v-if="goodsIndex === index"
                                class="goods-cover-mask-text"
                                >当前商品</view
                            >

                            <view
                                v-else
                                class="zdfont zdmp-qiehuan goods-cover-unit"
                            ></view>
                        </view>
                    </view>
                    <view class="goods-price">￥{{ item.goodsPrice }}</view>
                </view>
            </template>
        </scroll-view>
    </view>
</template>

<style lang="scss" scoped>
.package-warp {
    width: 710rpx;
    height: 358rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
    .package-head {
        padding: 24rpx 0 20rpx 30rpx;
        color: #333333;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
    }
    .scroll-view {
        display: flex;
        width: 710rpx;
        height: 250rpx;
        padding-left: 30rpx;
        box-sizing: border-box;
        .goods-item {
            display: flex;
            align-items: center;
            width: 200rpx;
            height: 250rpx;
            margin-right: 20rpx;
            padding: 18rpx 18rpx 20rpx 20rpx;
            border: 2rpx solid transparent;
            border-radius: 16rpx;
            box-sizing: border-box;
            flex-direction: column;
            .goods-cover-warp {
                position: relative;
                overflow: hidden;
                width: 162rpx;
                height: 162rpx;
                border-radius: 8rpx;
                .goods-cover-img {
                    width: 162rpx;
                    height: 162rpx;
                }
                .goods-cover-mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 162rpx;
                    height: 54rpx;
                    background: rgba(0, 0, 0, 0.2);
                    .goods-cover-unit {
                        color: #ffffff;
                    }
                    .goods-cover-mask-text {
                        color: #ffffff;
                        font-size: 24rpx;
                        font-weight: 500;
                        line-height: 24rpx;
                    }
                }
            }
            .goods-price {
                margin-top: 18rpx;
                text-decoration: line-through;
                color: #8a9399;
                font-size: 28rpx;
                font-weight: 400;
                line-height: 32rpx;
            }
        }
    }
}
</style>
