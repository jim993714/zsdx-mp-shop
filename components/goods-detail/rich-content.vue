<script setup lang="ts">
import type { IGoodsList } from '@/api/activity/combination-package-detail/types';
import MerchantQuaPop from '@/components/merchant-qua-pop/index.vue';
import parseHtml from '@/utils/parseHtml';

import type { GoodsDetail } from '../../api/goods-detail/types';

const props = defineProps<{
    content?: string;
    goodsDetail: GoodsDetail;
}>();

const merchantQuaPopRef = ref<InstanceType<typeof MerchantQuaPop>>();

const contentShow = computed(() => {
    console.log('====', props.goodsDetail);
    if (props.content) {
        return parseHtml(props.content);
    }
    return [];
});
</script>
<template>
    <view class="content-head">
        <view class="content-head-line"></view>
        <zd-icon
            type="zdmp-xiangce"
            :size="28"
            color="$uni-color-paragraph"
        ></zd-icon>
        <view class="content-head-text">详情</view>
        <view class="content-head-line"></view>
    </view>
    <view
        class="cert"
        @tap="merchantQuaPopRef?.open()"
    >
        <view class="left">
            <zd-icon
                type="zdmp-zhengjian"
                :size="28"
                color="#199fff"
            />
            <view class="label ellipsis"> 商家资质：{{ props.goodsDetail?.companyName }} </view>
        </view>
        <zd-icon
            type="zdmp-qianwang"
            :size="28"
        />
    </view>
    <rich-text
        :nodes="contentShow"
        class="rich-container"
    ></rich-text>
    <MerchantQuaPop
        ref="merchantQuaPopRef"
        :hire-no="props.goodsDetail?.hireNo"
    />
</template>
<style lang="scss" scoped>
.content-head {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    flex-direction: row;
    padding: 30rpx 0;
    .content-head-line {
        width: 80rpx;
        height: 2rpx;
        margin: 0 14rpx;
        background-color: rgba(235, 235, 235, 1);
    }
    .content-head-text {
        margin-left: 8rpx;
        color: #88909c;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 34rpx;
    }
}
.rich-container {
    width: 750rpx;
    flex-shrink: 0;
}

.cert {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 750rpx;
    height: 72rpx;
    padding: 0 20rpx;
    background-color: #fff;
    box-sizing: border-box;
    .left {
        display: flex;
        align-items: center;
    }
    .label {
        max-width: 640rpx;
        margin-left: 8rpx;
        font-size: 24rpx;
    }
}
</style>
@/utils/parseHtml
