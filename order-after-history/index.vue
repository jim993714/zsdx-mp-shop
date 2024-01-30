<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { fetchOrderCancelApplyHistory } from '../api/order-after';

const stepList = ref<any[]>();
interface Options {
    applyNo: string;
}
const options = ref<Options>();

onLoad(options_ => {
    options.value = options_ as Options;
    getHistoryList();
});

async function getHistoryList() {
    const resp = await fetchOrderCancelApplyHistory({
        applyNo: options.value?.applyNo
    });

    console.log('resp', resp);

    stepList.value = resp.map(item => ({
        ...item,
        label: item.title,
        time: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
    }));

    console.log(stepList.value);
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
    <view class="container">
        <zd-step
            direction="column"
            :step="0"
            :options="stepList"
            :show-number="false"
            :icon-style="{
                width: '10rpx',
                height: '10rpx',
                background: '#EDF0F2',
                borderColor: '#EDF0F2'
            }"
            :title-style="{
                color: '#292F33',
                marginTop: '-14rpx'
            }"
            :desc-style="{
                marginTop: '10rpx'
            }"
            :line-style="{
                background: '#EDF0F2'
            }"
        >
        </zd-step>
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
    background-color: #fff;
}
.container {
    display: flex;
    width: 750rpx;
    min-height: 100%;
    padding: 20rpx;
    background-color: #fff;
    flex-direction: column;
    box-sizing: border-box;
}
</style>
