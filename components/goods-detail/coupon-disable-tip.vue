<script setup lang="ts">
const props = defineProps<{
    content: string;
}>();
const bottom = (uni.getSystemInfoSync().safeAreaInsets?.bottom || 0) + uni.upx2px(100);
</script>
<template>
    <view class="disable-wrap">
        <view
            class="disable-tip"
            :style="{ bottom: bottom + 'px' }"
            >{{ content }}</view
        >
    </view>
</template>
<style lang="scss" scoped>
.disable-wrap {
    height: 68px;
}
.disable-tip {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 68rpx;
    text-align: center;
    color: #f95b56;
    font-size: 28rpx;
    font-weight: 400;
    background: #ffeeee;
    line-height: 68rpx;
    flex-direction: row;
}
</style>
