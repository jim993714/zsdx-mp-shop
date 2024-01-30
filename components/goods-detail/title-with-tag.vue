<script setup lang="ts">
import type { TagInfo } from '../../api/goods-detail/types';
import type { GoodsInfo } from '../../order-list/types';

const props = defineProps<{
    fromType?: number;
    title: string;
    goods?: GoodsInfo;
}>();
const tagInfo = computed<TagInfo>(() => {
    if (props.goods?.specialTagTitle) {
        return {
            url: props.goods?.specialTagTitle,
            width: 72
        };
    }
    switch (props.fromType) {
        case 18:
            return {
                url: 'https://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/group-tag.png',
                width: 72
            };
        case 19:
            return {
                url: 'https://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/package-tag.png',
                width: 72
            };
        default:
            return {
                url: '',
                width: -8
            };
    }
});
</script>
<template>
    <view class="common-title">
        <image
            v-if="tagInfo.width > 0"
            :style="{ width: tagInfo.width + 'rpx' }"
            class="common-title-tag"
            :src="tagInfo.url"
            mode="heightFix"
        />
        <view
            :style="{ textIndent: tagInfo.width + 8 + 'rpx' }"
            class="common-title-text ellipsis2"
        >
            {{ title }}
        </view>
    </view>
</template>
<style lang="scss" scoped>
.common-title {
    position: relative;
    &-tag {
        position: absolute;
        top: 4rpx;
        left: 0;
        height: 28rpx;
    }
    &-text {
        color: $uni-text-color;
        font-size: 28rpx;
        line-height: 40rpx;
    }
}
</style>
