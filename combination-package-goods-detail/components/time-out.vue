<script setup lang="ts">
const props = defineProps<{
    time: number;
    activityStatus: number;
}>();
const timeArray = ref<Array<string | number>>([]);
const timer = ref();
const newTime = ref(0);
newTime.value = props.time || 0;

const getTime = (time: number) => {
    --newTime.value;
    clearInterval(timer.value);

    let second = time % 60;
    let tmp = (time - second) / 60;
    let min = tmp % 60;
    tmp = tmp - min;
    let hour = tmp / 60;

    let day = Math.floor(hour / 24);
    hour = hour % 24;

    timeArray.value = [
        friendlyNumber(hour),
        friendlyNumber(min),
        friendlyNumber(second),
        friendlyNumber(day)
    ];
};

watch(
    () => newTime.value,
    value => {
        if (!value || value < 0) {
            timeArray.value = ['00', '00', '00'];
            return emit('timeEnd');
        }

        timer.value = setInterval(() => {
            getTime(value);
        }, 1000);
    },
    {
        immediate: true
    }
);

const friendlyNumber = (num: number) => {
    return num > 9 ? num : '0' + num;
};

const emit = defineEmits(['timeEnd']);
</script>

<template>
    <view class="timeout-wrap">
        <template v-if="Number(timeArray[3]) > 0">
            <view class="timeout-unit">{{ timeArray[3] }}</view>
            <view class="timeout-splider">天</view>
        </template>
        <view class="timeout-unit">{{ timeArray[0] }}</view>
        <view class="timeout-splider">:</view>
        <view class="timeout-unit">{{ timeArray[1] }}</view>
        <view class="timeout-splider">:</view>
        <view class="timeout-unit">{{ timeArray[2] }} </view>
        <view class="timeout-splider">{{
            [1, 3].includes(props.activityStatus) ? '后开始' : '后结束'
        }}</view>
    </view>
</template>

<style lang="scss" scoped>
.timeout-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.timeout-unit {
    padding: 8rpx;
    border-radius: 4rpx;
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.13);
    line-height: 24rpx;
}
.timeout-splider {
    margin: 0 8rpx;
    color: #ffffff;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 24rpx;
}
</style>
