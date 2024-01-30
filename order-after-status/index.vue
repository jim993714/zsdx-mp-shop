<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import { ref } from 'vue';

import definePageProps from '@/utils/definePageProps/index';

definePageProps<{
    type: 1 | 2 | 3;
}>();

const status = ref(1); // 1: 进行中 2，未通过

const options = ref<any>();

function reDo() {
    router.push('studentAuth');
}

function goBack() {
    uni.$emit('updateOrderAfterDetail');
    router.back();
}

onLoad(options_ => {
    options.value = options_;
    options.value.info = options_?.info ?? '一旦审核通过后将会短信通知你';
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
    <view class="container">
        <template v-if="status === 1">
            <image
                class="status-icon"
                src="http://cdn.zsdx.cn/mp-cs/images/shop/order/status-sussess.png"
                mode="heightFix"
            ></image>
            <view class="status-text status-1">提交成功</view>
            <view class="info-text"> {{ options.info }} </view>
            <zd-button
                class="btn submit-btn"
                type="primary"
                @tap="goBack"
            >
                知道了~
            </zd-button>
        </template>

        <template v-if="status === 2">
            <image
                class="status-icon"
                src="http://cdn.zsdx.cn/mp-cs/images/ucenter/student-auth/failed.png"
                mode="heightFix"
            ></image>
            <view class="status-text status-2">审核未通过</view>
            <view class="info-text">
                {{ options.reason }}
            </view>
            <zd-button
                class="btn submit-btn"
                type="primary"
                @tap="reDo"
            >
                重新提交
            </zd-button>
        </template>
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 200rpx;
}
.status-icon {
    width: 230rpx;
    height: 194rpx;
}
.status-text {
    margin-top: 40rpx;
    font-size: 40rpx;
    font-weight: 500;

    &.status-2 {
        color: $zd-color-red;
    }
}
.info-text {
    width: 522rpx;
    height: 132rpx;
    margin-top: 20rpx;
    // margin-bottom: 80rpx;
    text-align: center;
    color: #999999;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 44rpx;
}
.btn {
    margin-top: 40rpx;
    :deep(button) {
        width: 360rpx;
        height: 80rpx;
        border: none;
    }
}
</style>
