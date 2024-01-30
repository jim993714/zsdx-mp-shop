<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { ComposePackageData, ComposePackageStyle } from '../../types';
import GoodsList from './goods-list.vue';

const props = withDefaults(
    defineProps<{
        data: ComposePackageData;
        styleConfig: ComposePackageStyle;
    }>(),
    {
        styleConfig: () => ({
            backgroundImage: '',
            scrollBarColor: 'rgba(255, 77, 100, 1)'
        })
    }
);
const customPageNo = inject('customPageNo');
</script>

<template>
    <view
        class="compose-package"
        @tap.prevent="router.push('combinationPackage', { customPageNo: customPageNo })"
    >
        <view class="compose-package-container">
            <view class="compose-package-top">
                <text class="more-text">查看更多</text>
                <zd-icon
                    class="icon"
                    type="zdmp-fanhui"
                    :size="24"
                />
            </view>
            <view class="compose-package-content">
                <!-- 组合包列表 -->
                <goods-list
                    :list="props.data.list"
                    :style-config="props.styleConfig"
                />
            </view>
        </view>

        <image
            class="background-image"
            :src="props.styleConfig.backgroundImage"
            mode="aspectFill"
        />
    </view>
</template>

<style lang="scss" scoped>
.compose-package {
    position: relative;
    display: flex;
    align-items: center;
    width: 750rpx;
    height: 432rpx;
    flex-direction: column;
    padding: 30rpx 40rpx 24rpx;
    box-sizing: border-box;

    &-container {
        position: relative;
        z-index: 1;
    }

    .compose-package-content {
        width: 670rpx;
        height: 308rpx;
        margin-top: 26rpx;
        border-radius: 16rpx;
        background: #ffffff;
    }

    .compose-package-top {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        gap: 8rpx;

        .more-text {
            color: #ffffff;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }

        .icon {
            margin-top: 6rpx;
            color: #fff;
            transform: rotate(180deg);
        }
    }

    .background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 432rpx;
    }
}
</style>
