<script setup lang="ts">
import type { PacketItem, PacketStyle } from '../../types';
import { getCouponStatusIcon } from './utils';

const props = defineProps<{
    packetList: PacketItem[];
    styleConfig: PacketStyle;
}>();
const emit = defineEmits(['receive']);

const getImageWidth = computed(() => {
    const { coupon_array, marginH } = props.styleConfig;
    const columns = coupon_array + 1;

    return (750 - marginH * 2 * (columns + 1)) / columns;
});
</script>

<template>
    <view
        class="normal-style"
        :style="{
            padding: `${props.styleConfig.marginV * 2}rpx ${props.styleConfig.marginH * 2}rpx`,
            gap: `${props.styleConfig.marginV * 2}rpx ${props.styleConfig.marginH * 2}rpx`
        }"
    >
        <view
            v-for="(item, index) in props.packetList"
            :key="index"
            class="coupon-item"
            :style="{
                width: `${getImageWidth}rpx`,
                height: `${props.styleConfig.height}rpx`
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
                    width: `${getImageWidth}rpx`,
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
    </view>
</template>

<style lang="scss" scoped>
.normal-style {
    display: flex;
    flex-wrap: wrap;
    width: 750rpx;
    box-sizing: border-box;
    .coupon-item {
        position: relative;

        .status-icon {
            position: absolute;
            display: flex;
        }
    }
}
</style>
