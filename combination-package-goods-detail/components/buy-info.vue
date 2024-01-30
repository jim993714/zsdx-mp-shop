<script setup lang="ts">
import type { IGoodsList } from '../../api/combination-package-goods-detail/types';

const props = defineProps<{
    goodsFreight: string;
    selectedProduct: string;
    goodsDetail: IGoodsList;
}>();
const emit = defineEmits(['openSkuPop']);

const openSkuPop = () => {
    emit('openSkuPop');
};
</script>
<template>
    <view class="main-wrap">
        <view
            class="line-wrap"
            @tap="openSkuPop()"
        >
            <view class="line-title">规格</view>
            <view class="line-main">
                <view
                    v-if="props.selectedProduct"
                    class="line-main-text ellipsis"
                >
                    {{ props.selectedProduct }}
                </view>
                <view
                    v-else
                    class="line-main-text"
                >
                    请选择规格
                </view>
            </view>
            <view class="line-tail">
                <zd-icon
                    type="zdmp-qianwang"
                    color="$uni-text-color"
                    :size="32"
                ></zd-icon>
            </view>
        </view>
        <view class="line-wrap">
            <view class="line-title">运费</view>
            <view class="line-main">
                <view
                    v-if="+goodsFreight == 0"
                    class="line-main-text"
                    >免运费(请以提交订单时为准)</view
                >
                <view
                    v-else
                    class="line-main-text"
                >
                    {{ goodsFreight }}
                </view>
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.main-wrap {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 710rpx;
    margin: -20rpx 20rpx 0rpx;
    padding-bottom: 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    flex-direction: column;
}

.line-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    width: 100%;
    padding: 0 20rpx;
    flex-direction: row;
    box-sizing: border-box;
}
.line-title {
    margin-right: 20rpx;
    padding-top: 20rpx;
    color: #8a9399;
    font-size: 24rpx;
    line-height: 32rpx;
    flex-shrink: 0;
}
.line-main {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;
    .line-main-text {
        padding-top: 20rpx;
        color: $uni-text-color;
        font-size: 24rpx;
        line-height: 32rpx;
    }
}
.line-tail {
    margin-left: 20rpx;
    padding-top: 20rpx;
}

.package-tag {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: 16rpx;
    border: 1px solid $zd-color-red;
    border-radius: 4rpx;
    box-sizing: content-box;
    flex-direction: row;
    flex-shrink: 0;
    &-left {
        width: 80rpx;
        text-align: center;
        color: #fff;
        font-size: 24rpx;
        background-color: $zd-color-red;
        line-height: 32rpx;
        flex-shrink: 0;
    }
    &-right {
        padding: 0 4rpx;
        color: $zd-color-red;
        font-size: 24rpx;
        line-height: 32rpx;
        flex-shrink: 0;
    }
}
</style>
