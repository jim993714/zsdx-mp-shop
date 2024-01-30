<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { isLogin } = toRefs(userStore);

const props = defineProps<{
    maxSubsidy?: number;
    commission: number;
}>();
const fnGoLogin = () => {
    router.push('login');
};
const track = () => {
    emits('track');
};
const emits = defineEmits(['track']);
</script>
<template>
    <view class="share-wrap">
        <image
            class="share-logo"
            src="https://cdn.zsdx.cn/mp-cs/images/shop/detail/share-logo.png"
            mode="aspectFit"
        />
        <view class="share-title"
            >分享给同学{{ maxSubsidy && maxSubsidy > 0 ? `，最多可返${maxSubsidy}元` : '' }}</view
        >
        <view class="share-tail">
            <view class="share-tail-text">立即分享</view>
            <zd-icon
                type="zdmp-qianwang"
                :size="24"
                color="#FF4734"
            ></zd-icon>
        </view>
        <view
            v-if="isLogin"
            @tap="track"
        >
            <button
                open-type="share"
                class="share-wrap-wrap"
            ></button>
        </view>
        <button
            v-else
            class="share-wrap-wrap"
            @tap="fnGoLogin"
        ></button>
    </view>
</template>
<style lang="scss" scoped>
.share-wrap {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 670rpx;
    height: 72rpx;
    margin-top: 20rpx;
    padding: 0 20rpx;
    border-radius: 16rpx;
    color: #ff4734;
    font-size: 24rpx;
    font-weight: bold;
    background: linear-gradient(135deg, #fff6f5 0%, #ffe8e6 100%);
    flex-direction: row;
    box-sizing: border-box;
}
.share-wrap-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}
.share-logo {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
}
.share-title {
    font-weight: 600;
    flex: 1;
    line-height: 40rpx;
}
.share-tail {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
}
</style>
