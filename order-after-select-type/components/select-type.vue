<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { EnumOrderAfterType } from '../../api/order-after/types/constants';
import BaseCard from '../../order-after/components/base-card.vue';

const props = defineProps<{
    options: any;
}>();

const emits = defineEmits<{
    (e: 'change', type: EnumOrderAfterType): void;
}>();

function toOrderAfter(type: EnumOrderAfterType) {
    emits('change', type);
}
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <base-card header-text="选择售后类型">
        <uni-list :border="false">
            <uni-list-item
                show-arrow
                class="list-item"
                @tap="toOrderAfter(EnumOrderAfterType.REFUND)"
            >
                <template #header>
                    <view class="item-content">
                        <view class="icon">
                            <image
                                src="http://cdn.zsdx.cn/mp-cs/images/shop/order/order-after-type-1.png"
                                mode="aspectFill"
                            />
                        </view>
                        <view>
                            <view class="title">我要退款(无需退货)</view>
                            <view class="extra">没有收到货，或与卖家协商同意不用退货只退款</view>
                        </view>
                    </view>
                </template>
            </uni-list-item>
            <uni-list-item
                show-arrow
                class="list-item"
                @tap="toOrderAfter(EnumOrderAfterType.REFUND_RETURN)"
            >
                <template #header>
                    <view class="item-content">
                        <view class="icon">
                            <image
                                src="http://cdn.zsdx.cn/mp-cs/images/shop/order/order-after-type-2.png"
                                mode="aspectFill"
                            />
                        </view>
                        <view>
                            <view class="title">我要退货退款</view>
                            <view class="extra">已收到货，需要退还收到的货物</view>
                        </view>
                    </view>
                </template>
            </uni-list-item>
            <uni-list-item
                v-if="(props.options?.index?.length ?? 0) <= 1"
                show-arrow
                class="list-item"
                @tap="toOrderAfter(EnumOrderAfterType.EXCHANGE)"
            >
                <template #header>
                    <view class="item-content">
                        <view class="icon">
                            <image
                                src="http://cdn.zsdx.cn/mp-cs/images/shop/order/order-after-type-3.png"
                                mode="aspectFill"
                            />
                        </view>
                        <view>
                            <view class="title">我要换货</view>
                            <view class="extra">已收到货，需要退还收到的货物</view>
                        </view>
                    </view>
                </template>
            </uni-list-item>
        </uni-list>
    </base-card>
</template>

<style scoped lang="scss">
.list-item {
    :deep(.uni-list-item__container) {
        padding-left: 0;
    }
}

.item-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .icon {
        padding-right: 20rpx;
        image {
            width: 36rpx;
            height: 36rpx;
        }
    }
    .title {
        font-size: 28rpx;
    }
    .extra {
        margin-top: 16rpx;
        color: $uni-color-paragraph;
        font-size: 24rpx;
    }
}
</style>
