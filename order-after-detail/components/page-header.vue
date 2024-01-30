<script setup lang="ts">
import dayjs from 'dayjs';

import type { OrderCancelApplyDetailResp } from '../../api/order-after/types/order-after-details';

const props = defineProps<{
    detail: OrderCancelApplyDetailResp;
    applyNo: string;
}>();

const { detail } = toRefs(props);

const backRemainTime = computed(() => {
    return detail.value.dealExpireTime ?? 0;
});

/**
 * 倒计时
 * @param endTime
 */
function filterCountDown(endTime: number) {
    let delta = (endTime - new Date().getTime()) / 1000;
    const day = Math.floor(delta / 86400);
    delta = delta - day * 86400;
    const hour = Math.floor(delta / 3600);
    delta = delta - hour * 3600;
    const minute = Math.floor(delta / 60);
    const second = delta - minute * 60;
    return {
        showDay: day > 0,
        day,
        hour,
        minute,
        second
    };
}

const title = computed(() => {
    if (!detail.value || !detail.value.status) return '';
    if (detail.value.type == 3) {
        if (detail.value.status == 0) {
            return '未申请';
        } else if (detail.value.status == 1) {
            return '等待商家处理';
        } else if (detail.value.status == 11) {
            return '待买家退货';
        } else if (detail.value.status == 12) {
            return '待商家确认收货';
        } else if (detail.value.status == 13) {
            return '待商家换货';
        } else if (detail.value.status == 14 || detail.value.status == 15) {
            return '待买家确认收货';
        } else if (detail.value.status == 2) {
            return '已完成';
        } else if (detail.value.status == -1) {
            return '商家拒绝换货申请';
        } else if (detail.value.status == -2) {
            return '换货关闭';
        } else if (detail.value.status == 3) {
            return '换货关闭';
        }
    } else {
        if (detail.value.status == 0) {
            return '未申请';
        } else if (detail.value.status == 1) {
            return '等待商家确认';
        } else if (detail.value.status == 11) {
            return '待退货';
        } else if (detail.value.status == 12) {
            return '等待商家确认收货';
        } else if (detail.value.status == 2) {
            return '已完成';
        } else if (detail.value.status == -1) {
            return '商家拒绝退款';
        } else if (detail.value.status == -2) {
            return '退款关闭';
        } else if (detail.value.status == 101) {
            return '等待校内员工审核';
        } else if (detail.value.status == 102) {
            // 校内员工审核通过
            return '待退货';
        } else if (detail.value.status == 103) {
            return '校内员工拒绝';
        } else if (detail.value.status == 104) {
            return '已完成';
        } else if (detail.value.status == 105) {
            return '已完成';
        }
    }
});
</script>

<template>
    <view class="header">
        <view class="row">
            <zd-icon
                type="zdmp-xinxi"
                color="#fff"
                :size="36"
            ></zd-icon>
            <view class="status">{{ title }}</view>
        </view>
        <view
            v-if="detail!.status == 11 && detail!.type == 2"
            class="row"
        >
            (商家已同意退款请及时把货寄出)
        </view>
        <view
            v-if="detail.status == 1 && backRemainTime > 0"
            class="row"
        >
            <uni-countdown
                :font-size="12"
                splitor-color="#fff"
                color="#fff"
                v-bind="filterCountDown(backRemainTime)"
            />
            后自动同意售后申请
        </view>
        <view
            v-if="(detail.status == 13 || detail.status == 14) && backRemainTime > 0"
            class="row"
        >
            剩余
            <uni-countdown
                :font-size="12"
                splitor-color="#fff"
                color="#fff"
                v-bind="filterCountDown(backRemainTime)"
            />
        </view>
        <view
            v-else-if="
                (detail.status == 2 || detail.status === 104 || detail.status === 105) &&
                (parseFloat(detail.dealSuccessTime) || 0) > 0
            "
            class="row"
        >
            {{ dayjs(parseFloat(detail.dealSuccessTime ?? '')).format('YYYY-MM-DD HH:mm:ss') }}
        </view>
        <view
            v-else-if="detail.status == -2 && (parseFloat(detail.dealCancelTime ?? '') || 0) > 0"
            class="row"
        >
            {{ dayjs(parseFloat(detail.dealCancelTime ?? '')).format('YYYY-MM-DD HH:mm:ss') }}
        </view>
        <view
            v-else-if="detail.status == -1 && (detail.dealRefuseTime || 0) > 0"
            class="row"
        >
            {{ dayjs((detail.dealRefuseTime ?? 0) * 1).format('YYYY-MM-DD HH:mm:ss') }}
        </view>
        <view
            v-else-if="
                detail.disputeInfo &&
                detail.disputeInfo.status == -2 &&
                detail.disputeInfo.disputeNo
            "
            class="row"
        >
            <view class="dispute-status"> 投诉被驳回，</view>
            <view class="btn-dispute-detail"> 查看详情> </view>
        </view>
        <view
            v-else-if="detail.status === 101"
            class="row"
        >
            代理将在12小时内完成审核，请耐心等待
        </view>
    </view>
</template>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-around;
    width: 750rpx;
    height: 248rpx;
    padding: 0rpx 40rpx;
    padding-top: 44rpx;
    padding-bottom: 84rpx;
    color: #fff;
    background: linear-gradient(317deg, #3161ff 0%, #20a0ff 100%);
    flex-direction: column;
    box-sizing: border-box;
    .status {
        margin-left: 6rpx;
        font-size: 36rpx;
        font-weight: bold;
    }
    .row {
        display: flex;
        align-items: baseline;
        font-size: 28rpx;
    }
}
</style>
