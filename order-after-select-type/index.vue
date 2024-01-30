<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { EnumOrderAfterType } from '../api/order-after/types/constants';
import BaseCard from '../order-after/components/base-card.vue';
import GoodsCard from '../order-after/components/goods-card.vue';
import SelectType from './components/select-type.vue';

const options = ref<{
    type?: EnumOrderAfterType;
    orderNo: '';
    index: string[];
    mode?: 'add' | 'edit';
    applyNo?: string;
    multi?: string;
}>({
    type: 1,
    orderNo: '',
    index: [],
    mode: 'add',
    multi: ''
});

onLoad(options_ => {
    options.value.type = (options_?.type ?? 1) * 1;
    options.value.orderNo = options_?.orderNo;
    options.value.index = options_?.index.split(',')?.filter?.((item: string) => item);
    options.value.mode = options_?.mode;
    options.value.applyNo = options_?.applyNo;
    options.value.multi = options_?.multi;
});

function reselect() {
    router.redirect('orderAfterSelectGoods', {
        ...options.value,
        from: 'orderAfterSelectType',
        index: options.value.index.join(',')
    });
}

function toOrderAfter(type: number) {
    router.redirect('orderAfter', {
        ...options.value,
        from: 'orderAfterSelectType',
        type: type,
        index: options.value.index.join(',')
    });
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
    <view class="container">
        <base-card header-text="售后商品">
            <template #right>
                <view
                    v-if="options.index.length > 1 || options.multi"
                    class="reselect"
                    @tap="reselect"
                >
                    重新选择 >
                </view>
            </template>

            <goods-card v-bind="options">
                <template #right>
                    <view
                        v-if="options.index.length > 1 || options.multi"
                        class="reselect"
                        @tap="reselect"
                    >
                        重新选择 >
                    </view>
                </template>
            </goods-card>
        </base-card>
        <select-type
            :options="options"
            @change="toOrderAfter"
        ></select-type>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    height: 100%;
    height: 100%;
    padding-bottom: 50rpx;
    flex-direction: column;
    flex: 1;
}
.container {
    display: flex;
    width: 750rpx;
    min-height: 100%;
    padding: 20rpx;
    background-color: #f5f8fa;
    flex-direction: column;
    box-sizing: border-box;
}
.reselect {
    color: $zd-main-color;
    font-size: 28rpx;
    font-weight: 400;
}
</style>
