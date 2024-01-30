<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { ComposePackageItem, ComposePackageStyle } from '../../types';

const props = defineProps<{
    list: ComposePackageItem[];
    styleConfig: ComposePackageStyle;
}>();
const pointerLeft = ref(0);

const scrollWidth = computed(() => {
    const width = props.list.length * 214 + 20 + 8;
    return width > 670 ? width : 670;
});

const pointerWidth = computed(() => {
    return (670 / scrollWidth.value) * 36;
});

function onScroll(e: any) {
    const { scrollLeft, scrollWidth } = e.detail;

    pointerLeft.value = (scrollLeft / scrollWidth) * 36;
}
const customPageNo = inject('customPageNo');
</script>

<template>
    <div>
        <scroll-view
            scroll-x
            :show-scrollbar="false"
            scroll-with-animation
            class="goods-list"
            @scroll="onScroll"
        >
            <view
                v-for="goods in props.list"
                :key="goods.school_season_combination_package_activity_id"
                class="goods-item"
                @tap="
                    router.push('combinationPackageGoodsDetail', {
                        schoolSeasonCombinationPackageActivityId:
                            goods.school_season_combination_package_activity_id,
                        customPageNo: customPageNo
                    })
                "
            >
                <view class="goods-cover-wrap">
                    <image
                        class="goods-cover"
                        :src="goods.package_cover"
                    />
                    <view class="goods-item-price">
                        <text class="goods-item-price-label">一口价: ¥</text>
                        <text class="goods-item-price-value">{{ goods.fixed_money }}</text>
                    </view>
                </view>
                <view class="goods-title ellipsis">{{ goods.package_title }}</view>
            </view>
        </scroll-view>
        <div class="scrollbar">
            <view
                class="scrollbar-bg"
                :style="{ backgroundColor: props.styleConfig.scrollBarColor }"
            ></view>
            <view
                class="scrollbar-inner"
                :style="{
                    width: `${pointerWidth}px`,
                    transform: `translateX(${pointerLeft}px)`,
                    backgroundColor: props.styleConfig.scrollBarColor
                }"
            ></view>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.goods-list {
    display: flex;
    align-items: center;
    padding: 20rpx 20rpx 0;
    white-space: nowrap;
    box-sizing: border-box;

    .goods-item {
        position: relative;
        display: inline-block;
        width: 200rpx;
        vertical-align: middle;
        margin-right: 14rpx;

        &:last-child {
            margin-right: 0;
        }

        .goods-cover-wrap {
            position: relative;
            .goods-cover {
                display: block;
                width: 200rpx;
                height: 200rpx;
                border-radius: 8rpx;
            }

            .goods-item-price {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 200rpx;
                height: 48rpx;
                padding: 0 12rpx;
                border-radius: 0rpx 0rpx 8rpx 8rpx;
                color: #ffffff;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(1px);
                box-sizing: border-box;

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

        .goods-title {
            margin-top: 16rpx;
            color: #685d5d;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 28rpx;
        }
    }
}

.scrollbar {
    position: absolute;
    bottom: 20rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 12rpx;
    border-radius: 6rpx;

    &-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 36px;
        height: 12rpx;
        border-radius: 6rpx;
        opacity: 0.1;
    }

    &-inner {
        position: absolute;
        top: 0;
        left: 0;
        width: 36px;
        height: 12rpx;
        border-radius: 6rpx;
    }
}
</style>
