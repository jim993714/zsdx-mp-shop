<script setup lang="ts">
const props = defineProps<{
    trueName: string;
    idCard: string;
}>();
const emit = defineEmits(['update:trueName', 'update:idCard']);

const trueName = computed({
    set: (value: string) => {
        emit('update:trueName', value);
    },
    get: () => {
        return props.trueName;
    }
});
const idCard = computed({
    set: (value: string) => {
        emit('update:idCard', value);
    },
    get: () => {
        return props.idCard;
    }
});
</script>
<template>
    <view class="container">
        <view class="cross-tip">温馨提示：订单包含跨境商品，为不影响海关</view>
        <view class="input-line">
            <view class="input-line-label">真实姓名</view>
            <input
                v-model="trueName"
                class="input-line-input"
                placeholder-class="input-line-input-placeholder"
                type="text"
                placeholder="请输入邮箱"
            />
        </view>
        <view class="input-line">
            <view class="input-line-label">身份证号</view>
            <input
                v-model="idCard"
                class="input-line-input"
                type="text"
                placeholder="请输入身份证号"
            />
        </view>
    </view>
</template>
<style lang="scss" scoped>
.container {
    width: 710rpx;
    margin-top: 20rpx;
    padding: 30rpx 20rpx 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
}
.cross-tip {
    color: $uni-color-primary;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 32rpx;
}
.input-line {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10rpx;
    flex-direction: row;
}
.input-line-label {
    margin-right: 20rpx;
    color: $uni-text-color;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 40rpx;
}
.input-line-input {
    height: 60rpx;
    color: $uni-text-color;
    font-size: 24rpx;
    flex: 1;
    line-height: 60rpx;
    box-sizing: border-box;
}
.input-line-input-placeholder {
    height: 60rpx;
    color: $uni-text-color-grey;
    font-size: 24rpx;
    flex: 1;
    line-height: 60rpx;
    box-sizing: border-box;
}
</style>
