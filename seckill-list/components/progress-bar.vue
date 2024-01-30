<script setup lang="ts">
import type { CSSProperties } from 'vue';

const props = withDefaults(
    defineProps<{
        percent: number;
        width: number;
        strokeWidth: number;
        borderRadius: number;
        fontSizeSmall: number;
        backgroundColor: string;
        activeColor: string;
        style?: CSSProperties;
    }>(),
    {
        percent: 0,
        strokeWidth: 10,
        borderRadius: 0,
        fontSizeSmall: 10,
        backgroundColor: '#333',
        activeColor: '#999'
    }
);
</script>

<template>
    <view
        class="progress"
        :style="{
            ...props.style,
            width: props.width + 'rpx',
            background: props.backgroundColor,
            height: props.strokeWidth + 'rpx',
            borderRadius: props.strokeWidth + 'rpx'
        }"
    >
        <view
            class="content"
            :style="{
                background: props.activeColor,
                width: (props.width * props.percent) / 100 + 'rpx',
                height: props.strokeWidth + 'rpx',
                borderRadius: props.strokeWidth + 'rpx'
            }"
        ></view>
    </view>
</template>

<style scoped lang="scss">
.progress {
    width: 100%;
    .content {
        height: 100%;
    }
}
</style>
