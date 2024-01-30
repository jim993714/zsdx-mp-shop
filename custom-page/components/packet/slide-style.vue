<script setup lang="ts">
import type { PacketItem, PacketStyle } from '../../types';
import { getCouponStatusIcon } from './utils';

const props = defineProps<{
    packetList: PacketItem[];
    styleConfig: PacketStyle;
}>();
const emit = defineEmits(['receive']);
</script>

<template>
    <scroll-view
        scroll-x
        :show-scrollbar="false"
        class="slide-style"
    >
        <view
            v-for="(item, index) in props.packetList"
            :key="index"
            class="coupon-item"
            :style="{
                width: `${props.styleConfig.coupon_width * 2}rpx`,
                height: `${props.styleConfig.height}rpx`,
                margin: `${props.styleConfig.marginV * 2}rpx 0`,
                marginRight: `${props.styleConfig.marginH * 2}rpx`,
                marginLeft: `${index === 0 ? props.styleConfig.marginH * 2 : 0}rpx`
            }"
            @tap="
                emit('receive', {
                    coupon: item,
                    index
                })
            "
        >
            <image
                class="cover"
                :src="item.cover_image"
                mode="aspectFill"
                :style="{
                    width: `${props.styleConfig.coupon_width * 2}rpx`,
                    height: `${props.styleConfig.height}rpx`
                }"
            />

            <zd-icon
                v-if="getCouponStatusIcon(item) !== ''"
                class="status-icon"
                :type="getCouponStatusIcon(item)"
                :size="props.styleConfig.iconFontSize * 2"
                :style="{
                    color: props.styleConfig.iconColor,
                    fontSize: `${props.styleConfig.iconFontSize * 2}rpx`,
                    top: `${props.styleConfig.iconTop * 2}rpx`,
                    left: `${props.styleConfig.iconLeft * 2}rpx`
                }"
            />
        </view>
    </scroll-view>
</template>

<style lang="scss" scoped>
.slide-style {
    width: 750rpx;
    white-space: nowrap;
    .coupon-item {
        position: relative;
        display: inline-block;
        vertical-align: middle;

        .cover {
            display: block;
        }

        .status-icon {
            position: absolute;
            display: flex;
        }
    }
}
</style>
