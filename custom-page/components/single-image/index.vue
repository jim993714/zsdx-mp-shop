<script setup lang="ts">
import doAction from '@/utils/action';

import type { SingleImageData, SingleImageStyle } from '../../types';

const props = withDefaults(
    defineProps<{
        data: SingleImageData;
        styleConfig: SingleImageStyle;
    }>(),
    {
        styleConfig: () => ({
            marginV: 0,
            marginH: 0,
            backgroundColor: '#fff',
            borderRadius: '',
            height: 0
        })
    }
);

const imageWidth = ref(uni.upx2px(750));
const imageHeight = ref(uni.upx2px(380));

function imageLoad(e: any) {
    let fullWidth = uni.upx2px(750);
    let width = e.detail.width,
        height = e.detail.height;
    if (width > fullWidth) {
        height = (fullWidth / width) * height;
        width = fullWidth;
    }
    imageWidth.value = fullWidth - props.styleConfig.marginH * 2;
    imageHeight.value = (imageWidth.value / width) * height;
    uni.$emit('activePageResize');
}

function handleAction() {
    if (props.data.action.type === 1) {
        doAction(props.data.action.app_action);
    }
}
</script>

<template>
    <view
        class="single-image"
        :style="{
            background: props.styleConfig.backgroundColor,
            padding: `${props.styleConfig.marginV}rpx 0`
        }"
    >
        <image
            class="image"
            :src="props.data.image_url"
            mode="aspectFill"
            :style="{
                width: 750 - props.styleConfig.marginH * 2 + 'rpx',
                height: props.styleConfig.height
                    ? props.styleConfig.height + 'rpx'
                    : imageHeight + 'px',
                borderRadius: props.styleConfig.borderRadius
            }"
            @tap="handleAction()"
            @load="imageLoad"
        ></image>
    </view>
</template>

<style lang="scss" scoped>
.single-image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    font-size: 0;
    box-sizing: border-box;

    .image {
        width: 100%;
        font-size: 0;
    }
}
</style>
