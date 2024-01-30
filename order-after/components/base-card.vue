<script setup lang="ts">
import type { CSSProperties } from 'vue';

const props = withDefaults(
    defineProps<{
        /** 标题 */
        headerText: string;

        /** 是否显示 Icon */
        headerIcon?: string;

        /** header 样式 */
        headerStyle?: CSSProperties;

        hideHeader?: boolean;
    }>(),
    {
        headerIcon: '',
        headerStyle: () => ({})
    }
);
</script>

<template>
    <view class="base-card">
        <view
            v-if="!props.hideHeader"
            class="header"
            :style="props.headerStyle"
        >
            <view class="header-text">
                <zd-icon
                    v-if="props.headerIcon"
                    :type="props.headerIcon"
                    :size="40"
                    style="margin-right: 10rpx"
                />
                <view>
                    {{ props.headerText }}
                </view>
            </view>
            <slot name="right" />
        </view>
        <slot />
    </view>
</template>

<style scoped lang="scss">
.base-card {
    display: flex;
    margin-bottom: 20rpx;
    padding: 24rpx;
    border-radius: 12rpx;
    background-color: #fff;
    flex-direction: column;
    box-sizing: border-box;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-top: 6rpx;
    margin-bottom: 30rpx;
    font-size: 32rpx;
    font-weight: 500;
}
.header-text {
    display: flex;
    align-items: flex-start;
}
</style>
