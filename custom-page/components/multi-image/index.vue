<script setup lang="ts">
import doAction from '@/utils/action';

import type { MultiImageData, MultiImageItem, MultiImageStyle } from '../../types';

const props = withDefaults(
    defineProps<{
        data: MultiImageData;
        styleConfig: MultiImageStyle;
    }>(),
    {
        styleConfig: () => ({
            columns: 2,
            marginV: 0,
            marginH: 0,
            backgroundColor: '#fff',
            borderRadius: '',
            height: 0
        })
    }
);

const getImageWidth = computed(() => {
    const { columns, marginH } = props.styleConfig;

    return (750 - marginH * (columns + 1)) / columns;
});

function handleAction(imageItem: MultiImageItem) {
    if (imageItem.action.type === 1) {
        doAction(imageItem.action.app_action);
    }
}
</script>

<template>
    <view
        class="multi-image"
        :style="{
            background: props.styleConfig.backgroundColor,
            padding: `${props.styleConfig.marginV}rpx 0`
        }"
    >
        <view
            v-for="(item, index) in props.data.images"
            :key="index"
            class="image-item"
            :style="{
                width: `${getImageWidth}rpx`,
                height: `${props.styleConfig.height}rpx`,
                marginLeft: `${props.styleConfig.marginH}rpx`
            }"
        >
            <image
                class="image"
                :src="item.image_url"
                mode="aspectFill"
                :style="{
                    borderRadius: props.styleConfig.borderRadius,
                    width: `${getImageWidth}rpx`,
                    height: `${props.styleConfig.height}rpx`
                }"
                @tap="handleAction(item)"
            />
        </view>
    </view>
</template>

<style lang="scss" scoped>
.multi-image {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 750rpx;
    box-sizing: border-box;
}
</style>
