<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

const props = defineProps<{
    from: string;
}>();
const popRef = ref();
const close = () => {
    router.switchTab('home');
};
const open = () => {
    popRef.value.open('center');
};
const goIndex = () => {
    router.switchTab('home');
};
const fnQuit = () => {
    uni.exitMiniProgram();
};
defineExpose({
    open
});
</script>
<template>
    <zd-popup
        ref="popRef"
        class="zd-popup"
        :is-mask-click="false"
        :safe-area="false"
        style="z-index: 999"
    >
        <view class="modal-body">
            <view class="modal-content">支付完成</view>
            <view class="modal-btns">
                <view class="modal-btn">
                    <view
                        class="modal-btn-inner"
                        @tap="goIndex"
                        >留在微信</view
                    >
                </view>
                <view
                    v-if="from === 'app'"
                    class="modal-btn"
                >
                    <view class="modal-btn-inner primary">返回App</view>
                    <button
                        class="modal-btn-real"
                        open-type="launchApp"
                        @tap="goIndex"
                    ></button>
                </view>
                <view
                    v-else
                    class="modal-btn"
                >
                    <view
                        class="modal-btn-inner primary"
                        @tap="fnQuit()"
                        >退出</view
                    >
                </view>
            </view>
        </view>
    </zd-popup>
</template>
<style lang="scss" scoped>
.modal-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 600rpx;
    border-radius: 26rpx;
    background-color: #fff;
    flex-direction: column;
}
.modal-content {
    padding: 80rpx 0 60rpx;
    color: $uni-text-color-grey;
    font-size: 28rpx;
    line-height: 32rpx;
}
.modal-btns {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 600rpx;
    flex-direction: row;
    border-top: 1px solid $uni-bg-color-grey;
}
.modal-btn {
    position: relative;
    position: relative;
    height: 110rpx;
    border: 0;
    border-right: 1px solid $uni-bg-color-grey;
    flex: 1;
    &:nth-last-child(1) {
        border-right: 0px solid $uni-bg-color-grey;
    }
    &-inner {
        width: 100%;
        text-align: center;
        color: $uni-text-color;
        font-size: 28rpx;
        line-height: 110rpx;
        font-weight: bold;
        &.primary {
            color: #20a0ff;
        }
    }
    &-real {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}
</style>
