<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { ResponseOrder13 } from '../../api/order/types';

const props = defineProps<{
    no: number;
    exchangeUrl?: string;
    info?: ResponseOrder13[];
}>();
const infoShow = computed(() => {
    if (showAll.value) {
        return props.info;
    } else {
        return props.info?.slice(0, 3);
    }
});
const showAll = ref(false);
const fnShowAll = () => {
    showAll.value = !showAll.value;
};
const fnCopy = () => {
    let content = props.info
        ? props.info.reduce((result, item) => {
              return result + item.name + ':' + item.value + ';';
          }, '')
        : '';
    uni.setClipboardData({
        data: content,
        success: () => {
            uni.showToast({
                title: '复制成功',
                icon: 'none'
            });
        }
    });
};
const fnExchange = () => {
    router.push('webview', {
        url: props.exchangeUrl
    });
};
</script>
<template>
    <view class="container">
        <view class="info-head">
            <view class="info-title">发货信息{{ no }}</view>
            <view
                class="info-btn"
                @tap="fnCopy"
                >复制</view
            >
        </view>
        <view
            v-for="(item, index) in infoShow"
            :key="index"
            class="info-line"
        >
            <view class="info-line-title">{{ item.name }}</view>
            <view class="info-line-value">{{ item.value }}</view>
        </view>
        <view
            v-if="info && info.length > 3"
            class="bottom-btn"
            @tap="fnShowAll"
        >
            <view class="btn-text">{{ showAll ? '收起' : '展开' }}</view>
            <zd-icon
                class="btn-arrow"
                :class="{ 'btn-arrow-reverse': showAll }"
                type="zdmp-jiangxu"
                :size="28"
                color="rgba(41, 47, 51, 1)"
            ></zd-icon>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    width: 710rpx;
    margin: 20rpx 20rpx 0;
    padding: 30rpx 24rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
}
.info-head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20rpx;
    .info-title {
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 32rpx;
        flex: 1;
    }
    .info-btn {
        height: 40rpx;
        margin-left: 20rpx;
        padding: 0 20rpx;
        border: 2rpx solid $uni-color-primary;
        border-radius: 26rpx;
        color: $uni-color-primary;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 36rpx;
    }
}
.info-line {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 36rpx;
    &-title {
        width: 230rpx;
        color: $uni-text-color-grey;
    }
    &-value {
        color: $uni-text-color;
    }
}
.bottom-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 20rpx;
    margin-bottom: -30rpx;
    border-top: 1px solid $uni-text-color-disable;
    text-align: center;
    flex-direction: row;
}
.btn-text {
    margin-right: 8rpx;
    color: #292f33;
    font-size: 28rpx;
    line-height: 80rpx;
}
.btn-arrow {
    transform: rotate(0);
    &-reverse {
        transform: rotate(180deg);
    }
}
</style>
