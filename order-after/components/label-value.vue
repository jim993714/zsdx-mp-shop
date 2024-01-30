<script setup lang="ts">
const props = defineProps<{
    /** key */
    label?: string;

    /** value */
    value?: string;

    /** 是否显示复制 */
    showCopy?: boolean;

    /** 是否显示底部 border */
    showBorder?: boolean;

    /** value algin */
    align?: 'left' | 'center' | 'right';

    /** 完整显示，不要省略 */
    noEllipsis?: boolean;
}>();

function copy(content: string) {
    uni.setClipboardData({
        data: content,
        success: () => {
            uni.showToast({
                title: '复制成功'
            });
        }
    });
}
</script>

<template>
    <view class="label-value">
        <view class="label">{{ props.label }}</view>
        <view
            class="value"
            :class="{
                ellipsis: props.noEllipsis ?? true
            }"
            :style="{
                textAlign: props.align ?? 'left'
            }"
        >
            <slot name="value">
                {{ props.value }}
            </slot>
            <text
                v-if="props.showCopy"
                class="copy"
                @tap="copy(props.value || '')"
            >
                复制
            </text>
        </view>
    </view>
    <view
        v-if="props.showBorder"
        class="divider"
    ></view>
</template>

<style scoped lang="scss">
.label-value {
    display: flex;
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 34rpx;
    .label {
        flex: 1;
        color: $uni-text-color-placeholder;
    }
    .value {
        flex: 2;
        color: $uni-text-color;
        .copy {
            color: $zd-main-color;
        }
    }
}
.divider {
    height: 2rpx;
    margin-top: 24rpx;
    background-color: $uni-text-color-disable;
}
</style>
