<script setup lang="ts">
import type ZdDrewerBottom from '@zsdx/mp-material/dist/lib/components/zd-drawer-bottom/index.vue';

import { getReasonList } from '../../api/order-after';
import type { ReasonItem } from '../../api/order-after/types/order-after-list';
import { formKey, RECEIVE_STATUS_LIST } from '../constants';
import BaseCard from './base-card.vue';

const zdDrawerRef1 = ref<InstanceType<typeof ZdDrewerBottom> | null>(null);
const zdDrawerRef2 = ref<InstanceType<typeof ZdDrewerBottom> | null>(null);
const isReceiveStatusList = ref(RECEIVE_STATUS_LIST);
const isReceive = ref<string>('');

const form = inject(formKey)!;
const reasonList = ref<ReasonItem[]>([]);
const reason = ref<ReasonItem>();

onMounted(() => {
    selectIsReceive(1);
});

function selectReason(item: ReasonItem) {
    reason.value = item;
    form.reason = item.content;
    form.reasonId = item.id + '';
    zdDrawerRef2.value?.close();
}

function selectIsReceive(item: number) {
    isReceive.value = isReceiveStatusList.value[item].label;
    form.receiveGoods = item;
    zdDrawerRef1.value?.close();
    getReasonList_(item === 0 ? 2 : 1);
}

async function getReasonList_(status: number) {
    const resp = await getReasonList({
        orderStatus: status ?? 0
    });
    reasonList.value = resp;
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
    <base-card
        header-text="换货信息"
        class="goods-refund-info"
    >
        <uni-list :border="false">
            <uni-list-item
                class="list-item"
                :show-arrow="false"
                :right-text="isReceive || '请选择'"
                @tap="zdDrawerRef1?.open()"
            >
                <template #header>
                    <text class="label"> <text style="color: red">*</text>是否收到货 </text>
                </template>
            </uni-list-item>
            <uni-list-item
                show-arrow
                :right-text="reason?.content || '请选择'"
                class="list-item"
                @tap="zdDrawerRef2?.open()"
            >
                <template #header>
                    <text class="label"> <text style="color: red">*</text>换货原因 </text>
                </template>
            </uni-list-item>
        </uni-list>
    </base-card>

    <zd-drawer-bottom
        ref="zdDrawerRef1"
        header-text="是否收到货"
    >
        <view
            v-for="(item, index) in isReceiveStatusList"
            :key="index"
            class="reason-item"
            @tap="selectIsReceive(item.value)"
        >
            <view> {{ item.label }} </view>
            <view class="radio">
                <zd-icon
                    v-if="isReceive === item.label"
                    type="zdmp-yigouxuan1"
                    :size="32"
                    color="#20A0FF"
                />
            </view>
        </view>
    </zd-drawer-bottom>
    <zd-drawer-bottom
        ref="zdDrawerRef2"
        header-text="换货原因"
    >
        <view
            v-for="(item, index) in reasonList"
            :key="index"
            class="reason-item"
            @tap="selectReason(item)"
        >
            <view> {{ item.content }} </view>
            <view class="radio">
                <zd-icon
                    v-if="reason?.content === (item.content || item)"
                    type="zdmp-yigouxuan1"
                    :size="32"
                    color="#20A0FF"
                />
            </view>
        </view>
    </zd-drawer-bottom>
</template>

<style scoped lang="scss">
.goods-refund-info {
    :deep(.uni-list-item) {
        border: none;
    }
    :deep(.uni-list-item__container) {
        padding-left: 0;
    }

    .list-item {
        min-height: 100rpx;
        :deep(input) {
            font-size: 28rpx;
        }
        .label {
            color: $uni-color-title;
            font-size: 28rpx;
        }

        :deep(.uni-list-item__extra-text) {
            display: block;
            overflow: hidden;
            max-width: 400rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
        }
    }
    .extra {
        display: flex;
        align-items: center;
        color: $uni-color-paragraph;
        font-size: 24rpx;
    }
}

.reason-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 96rpx;
    padding: 0 40rpx;
    color: #333;
    line-height: 96rpx;
    .radio {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28rpx;
        height: 28rpx;
        border: 1px solid #d8d8d8;
        border-radius: 14rpx;
    }
}
</style>
