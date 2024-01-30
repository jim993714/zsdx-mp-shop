<script setup lang="ts">
import type { PageBaseConfig } from '../types';

const props = defineProps<{
    baseConfig: PageBaseConfig;
}>();
const navbarHeight = (uni.getSystemInfoSync().statusBarHeight || 0) + 44;
</script>

<template>
    <zd-navbar
        fixed
        :background="props.baseConfig.title_background"
        :color="props.baseConfig.icon_type === 2 ? '#ffffff' : ''"
        :icon-color="props.baseConfig.icon_type === 2 ? '#ffffff' : ''"
    >
        <template>
            <view
                class="page-title"
                :style="{ color: props.baseConfig.icon_type === 2 ? '#ffffff' : '' }"
            >
                <text>{{ props.baseConfig.title_text }}</text>
                <!-- 暂时不支持图片标题 -->
                <!-- <text v-if="props.baseConfig.title_type === 1">{{
                    props.baseConfig.title_text
                }}</text> -->
                <!-- <image
                    v-else-if="props.baseConfig.title_type === 2"
                    :src="props.baseConfig.title_image"
                    mode="aspectFit"
                /> -->
            </view>
        </template>
    </zd-navbar>
    <view
        :style="{
            height: `${navbarHeight}px`
        }"
    ></view>
</template>

<style lang="scss" scoped>
.page-title {
    text-align: center;
    color: $uni-text-color;
    font-size: 36rpx;
    font-weight: 600;
    flex: 1;
    line-height: 40rpx;
}
</style>
