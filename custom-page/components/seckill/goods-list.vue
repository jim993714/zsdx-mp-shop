<script setup lang="ts">
import { useVModel } from '@vueuse/core';

import type { SeckillItem } from '../../types';

const props = defineProps<{
    list: SeckillItem[];
    modelValue: number;
}>();
const emit = defineEmits(['update:modelValue']);
const activeIndex = useVModel(props, 'modelValue', emit);

function onSwiperChange(e: any) {
    activeIndex.value = e.detail.current;
}
</script>

<template>
    <swiper
        :current="activeIndex"
        class="swiper-list"
        :duration="300"
        :autoplay="false"
        :style="{ height: '200rpx' }"
        @change="onSwiperChange"
    >
        <swiper-item
            v-for="(item, index) in props.list.slice(0, 4)"
            :key="index"
            class="swiper-item"
            :style="{ height: '200rpx' }"
        >
            <view class="goods-list">
                <view
                    v-for="goods in item.flash_list.slice(0, 3)"
                    :key="goods.goods_no"
                    class="goods-item"
                >
                    <image
                        class="goods-cover"
                        :src="goods.goods_cover"
                    />
                    <view class="goods-item-price">
                        <text class="goods-item-price-label">秒杀价: ¥</text>
                        <text class="goods-item-price-value">{{ goods.goods_price_pay }}</text>
                    </view>
                </view>
            </view>
        </swiper-item>
    </swiper>
</template>

<style lang="scss" scoped>
.swiper-list {
    position: relative;
    width: 100%;
    height: 200rpx;

    .swiper-item {
        width: 100%;
        height: 200rpx;
    }

    .goods-list {
        display: flex;
        align-items: center;
        gap: 24rpx;
        padding: 0 12rpx;

        .goods-item {
            position: relative;
            overflow: hidden;
            width: 200rpx;
            height: 200rpx;
            border-radius: 8rpx;
            .goods-cover {
                width: 200rpx;
                height: 200rpx;
                border-radius: 8rpx;
            }

            &-price {
                position: absolute;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 200rpx;
                height: 48rpx;
                border-radius: 0rpx 0rpx 8rpx 8rpx;
                color: #fff;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(1px);

                &-label {
                    font-size: 20rpx;
                    font-weight: 500;
                    line-height: 24rpx;
                }
                &-value {
                    font-size: 28rpx;
                    font-weight: 400;
                    line-height: 28rpx;
                }
            }
        }
    }
}
</style>
