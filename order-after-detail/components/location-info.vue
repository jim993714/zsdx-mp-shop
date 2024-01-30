<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { OrderCancelApplyDetailResp } from '../../api/order-after/types/order-after-details';
import BaseCard from '../../order-after/components/base-card.vue';
import LabelValue from '../../order-after/components/label-value.vue';

const props = defineProps<{ detail: OrderCancelApplyDetailResp }>();
const { detail } = toRefs(props);

const addressInfo = computed(() => {
    return detail.value.rejectAddressInfo;
});

const address = computed(() => {
    return (
        (addressInfo.value?.provinceName || '') +
        (addressInfo.value?.cityName || '') +
        (addressInfo.value?.countyName || '') +
        (addressInfo.value?.detailInfo || '')
    );
});

function copy() {
    uni.setClipboardData({
        data: `${addressInfo.value?.userName}  ${addressInfo?.value?.phone}  ${address.value}`,
        success: () => {
            uni.showToast({
                title: '复制成功'
            });
        }
    });
}

function toMessage() {
    router.push('chatRoom', {
        shopNo: detail.value.shopNo,
        goodsNo: detail.value?.orderItemList?.[0]?.goodsInfo?.goodsNo
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
    <base-card header-text="商家地址信息">
        <template
            v-if="addressInfo?.userName"
            #right
        >
            <view
                class="header-right"
                @tap="copy"
            >
                复制地址
            </view>
        </template>
        <template v-if="addressInfo?.userName">
            <label-value
                label="收件人"
                :value="addressInfo?.userName ?? ''"
            />
            <label-value
                label="联系电话"
                :value="addressInfo?.phone ?? ''"
            />
            <label-value
                label="收件地址"
                :value="address"
            />
            <label-value
                label="商家备注"
                :value="addressInfo?.remark ?? ''"
            />
        </template>
        <template v-else>
            <view class="empty">
                <view> 该商家还未设置退货地址， </view>
                <view
                    class="primary"
                    @tap="toMessage"
                >
                    联系客服索要地址
                    <zd-icon
                        type="zdmp-qianwang"
                        :size="28"
                    />
                </view>
            </view>
        </template>
    </base-card>
</template>

<style scoped lang="scss">
.header-right {
    color: $zd-main-color;
    font-size: 24rpx;
}
.empty {
    display: flex;
    font-size: 24rpx;
    .primary {
        color: $zd-main-color;
    }
}
</style>
