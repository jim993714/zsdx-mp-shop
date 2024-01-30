<script setup lang="ts">
import dayjs from 'dayjs';

import type { OrderDetailResp } from '../../api/order/types';
import { filterStatus } from '../utils';

const props = defineProps<{
    orderDetail: OrderDetailResp | undefined;
}>();
const emit = defineEmits(['timeUp']);
const remainTime = computed(() => {
    const currTime = dayjs().valueOf();

    // 支付倒计时
    if (props.orderDetail?.status === 0) {
        return props.orderDetail?.payExpireTime
            ? dayjs(+props.orderDetail?.payExpireTime - currTime).unix()
            : 0;
    }
    // 退款申请倒计时
    // if (props.orderDetail?.status === -2) {
    //     return props.orderDetail?.cancelApplyDealExpireTime
    //         ? props.orderDetail?.cancelApplyDealExpireTime - currTime
    //         : 0;
    // }
    return 0;
});
const timeUp = () => {
    setTimeout(() => {
        emit('timeUp');
    }, 1000);
};
</script>
<template>
    <view class="page-head">
        <view class="page-head-status">
            <zd-icon
                type="zdmp-xinxi"
                :size="36"
                color="#fff"
            />
            <view class="page-head-status-text">{{ filterStatus(orderDetail) }}</view>
        </view>
        <!-- 纸巾团待成团 -->
        <view
            v-if="orderDetail?.status == 1 && orderDetail?.tissueDumplingInfo?.missStudentNum"
            class="tissue-info"
        >
            差{{ orderDetail.tissueDumplingInfo.missStudentNum }}人成团
        </view>
        <view
            v-if="orderDetail?.status == 0 && remainTime > 0"
            class="page-head-time"
        >
            <uni-countdown
                color="#ffffff"
                splitor-color="#ffffff"
                show-day
                :second="remainTime"
                @timeup="timeUp"
            />
            后自动关闭
        </view>
        <view v-if="orderDetail?.status == -2 && remainTime > 0">
            卖家处理时间剩{{ remainTime }}{{ 60 * 60 * 24 }}
            <uni-countdown
                color="#ffffff"
                splitor-color="#ffffff"
                :show-day="remainTime > 60 * 60 * 24"
                :second="remainTime"
                @timeup="timeUp"
            />
        </view>
        <image
            v-if="orderDetail?.trackingBySchoolAgent === 1"
            class="agent-tag"
            src="https://cdn.zsdx.cn/mp-cs/images/shop/order/agent-img.png"
            mode="aspectFit"
        />
    </view>
</template>
<style lang="scss" scoped>
.page-head {
    position: relative;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: stretch;
    width: 750rpx;
    height: 248rpx;
    margin-bottom: -86rpx;
    padding: 20rpx 40rpx 66rpx;
    color: #fff;
    background: linear-gradient(317deg, #3161ff 0%, #20a0ff 100%);
    flex-direction: column;
    box-sizing: border-box;
}
.agent-tag {
    position: absolute;
    top: 16rpx;
    right: 0;
    width: 356rpx;
    height: 146rpx;
}
.page-head-status {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    &-text {
        margin-left: 8rpx;
        font-size: 36rpx;
        font-weight: 500;
        line-height: 50rpx;
    }
}
.tissue-info {
    margin-top: 16rpx;
    padding: 0 32rpx;
    border-radius: 26px;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 500;
    background: rgba(120, 174, 249, 0.3);
    line-height: 48rpx;
    align-self: flex-start;
}
.page-head-time {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 26rpx;
    color: #fff;
    font-size: 28rpx;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 40rpx;
    flex-direction: row;
    line-height: 26rpx;
}
.page-head-tuan {
    margin-top: 16rpx;
    padding: 0 32rpx;
    border-radius: 26px;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.3);
    line-height: 48rpx;
    align-self: flex-start;
}
</style>
