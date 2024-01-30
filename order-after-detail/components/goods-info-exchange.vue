<script setup lang="ts">
import dayjs from 'dayjs';

import { STATUS_MAP } from '../../api/order-after/types/constants';
import type { OrderCancelApplyDetailResp } from '../../api/order-after/types/order-after-details';
import BaseCard from '../../order-after/components/base-card.vue';
import GoodsCard from '../../order-after/components/goods-card.vue';
import LabelValue from '../../order-after/components/label-value.vue';

const props = defineProps<{ detail: OrderCancelApplyDetailResp; applyNo: string }>();
const { detail } = toRefs(props);

const address = computed(() => {
    return (
        (props.detail.returnAddressInfo?.provinceName || '') +
        (props.detail.returnAddressInfo?.cityName || '') +
        (props.detail.returnAddressInfo?.countyName || '') +
        (props.detail.returnAddressInfo?.detailInfo || '')
    );
});
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <base-card header-text="换货信息">
        <template #right>
            <view class="header-right">
                <image
                    :src="STATUS_MAP[detail?.type as number]?.icon"
                    mode="aspectFill"
                />
                换货
            </view>
        </template>
        <goods-card :item="detail?.orderItemList ?? []" />
        <label-value
            label="换货原因"
            :value="detail.reason"
            style="margin-top: 16rpx"
        />
        <label-value
            label="申请时间"
            :value="dayjs(detail.createTime * 1).format('YYYY-MM-DD HH:mm:ss')"
        />

        <label-value
            label="换货编号"
            :value="props.applyNo"
            show-copy
        />
        <label-value
            label="换货地址"
            :value="address"
            show-border
        />
    </base-card>
</template>

<style scoped lang="scss">
.header-right {
    display: flex;
    align-items: center;
    color: $zd-main-color;
    font-size: 28rpx;
    line-height: 28rpx;
    image {
        width: 32rpx;
        height: 32rpx;
        margin-right: 10rpx;
    }
}
.footer {
    display: flex;
    align-items: flex-end;
    height: 68rpx;
    .label {
        flex: 1;
    }
    .value {
        flex: 2;
    }
}
</style>
