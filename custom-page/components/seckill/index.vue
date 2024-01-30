<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { SeckillData, SeckillStyle } from '../../types';
import GoodsList from './goods-list.vue';
import TimeBlock from './time-block.vue';

const props = withDefaults(
    defineProps<{
        data: SeckillData;
        styleConfig: SeckillStyle;
    }>(),
    {
        styleConfig: () => ({
            backgroundImage: ''
        })
    }
);

const activeIndex = ref(0);
const customPageNo = inject('customPageNo');
</script>

<template>
    <view
        class="seckill"
        @tap.prevent="router.push('seckillList', { customPageNo: customPageNo })"
    >
        <view class="seckill-content">
            <view class="seckill-top">
                <text class="more-text">更多</text>
                <zd-icon
                    class="icon"
                    type="zdmp-fanhui"
                    :size="24"
                />
            </view>
            <!-- 秒杀排期 -->
            <time-block
                v-model="activeIndex"
                :list="props.data.list"
            />

            <!-- 秒杀商品列表 -->
            <goods-list
                v-model="activeIndex"
                :list="props.data.list"
            />
        </view>
        <image
            class="background-image"
            :src="props.styleConfig.backgroundImage"
            mode="aspectFill"
        />
    </view>
</template>

<style lang="scss" scoped>
.seckill {
    position: relative;
    display: flex;
    align-items: center;
    width: 750rpx;
    height: 432rpx;
    flex-direction: column;
    padding: 30rpx 40rpx 34rpx;
    box-sizing: border-box;

    .background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 432rpx;
    }

    &-content {
        position: relative;
        z-index: 1;
        width: 100%;
    }

    &-top {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        gap: 8rpx;

        .more-text {
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }

        .icon {
            margin-top: 4rpx;
            color: #fff;
            transform: rotate(180deg);
        }
    }
}
</style>
