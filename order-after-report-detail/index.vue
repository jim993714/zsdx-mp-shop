<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { getDisputeDetail, repealDispute } from '../api/order-after';
import type { DisputeDetail } from '../api/order-after/types/dispute';
import LabelValue from '../order-after/components/label-value.vue';
import GoodsInfo from './components/goods-card.vue';

interface Options {
    disputeNo: string;
}
const options = ref<Options>({
    disputeNo: ''
});
onLoad(options_ => {
    options.value = options_ as Options;
    getDetail();
});

const detail = ref<DisputeDetail>({} as any);

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

async function getDetail() {
    const resp = await getDisputeDetail({
        disputeNo: options.value?.disputeNo
    });
    console.log('商品详情', resp);
    detail.value = resp;
}

function preview(index: number) {
    uni.previewImage({
        current: index,
        urls: detail.value.evidence ?? []
    });
}

async function backout() {
    try {
        await repealDispute({
            disputeNo: options.value.disputeNo
        });
        uni.showToast({
            title: '撤销成功'
        });
        setTimeout(() => {
            router.back();
        }, 1000);
    } catch (err) {
        uni.showToast({
            title: (err as any).msg ?? '未知错误',
            icon: 'none'
        });
    }
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
    <view class="header">
        <view class="row">
            <zd-icon
                type="zdmp-xinxidefuben"
                color="#fff"
                :size="36"
            ></zd-icon>
            <view class="status">发起投诉</view>
        </view>

        <view class="row">
            等待商家处理
            <uni-countdown
                v-if="detail.hireDealExpireTime"
                :font-size="12"
                splitor-color="#fff"
                color="#fff"
                v-bind="filterCountDown(detail.hireDealExpireTime ?? 0)"
            />
        </view>
    </view>
    <view class="container">
        <goods-info :goods-detail="detail.orderInfo" />
        <label-value
            label="投诉编号"
            :value="options.disputeNo"
            align="right"
        />
        <label-value
            label="订单编号"
            :value="detail.orderNo"
            align="right"
        />
        <label-value
            label="投诉原因"
            :value="detail.reason"
            align="right"
        />
        <label-value
            label="投诉类型"
            :value="detail.reasonDetail"
            align="right"
        />
        <label-value
            label="投诉说明"
            :value="detail.desc"
            :no-ellipsis="false"
            align="left"
        />
        <label-value
            label="投诉凭证"
            :value="detail.desc"
            align="right"
        >
            <template #value>
                <view class="image-row">
                    <image
                        v-for="(item, index) in detail.evidence"
                        :key="index"
                        :src="item"
                        mode="aspectFill"
                        class="image"
                        @tap="preview(index)"
                    />
                </view>
            </template>
        </label-value>
    </view>
    <view class="footer-warpper">
        <view class="footer">
            <zd-button
                type="outline"
                @tap.stop="backout()"
            >
                撤销投诉
            </zd-button>
        </view>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    height: 100%;
    height: 100%;
    flex-direction: column;
    flex: 1;
}

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
    }
    .row {
        display: flex;
        align-items: baseline;
        font-size: 28rpx;
    }
}

.container {
    display: flex;
    width: 750rpx;
    min-height: 100%;
    padding: 20rpx 40rpx;
    background-color: #f5f8fa;
    flex-direction: column;
    box-sizing: border-box;
}
.image-row {
    z-index: 1000;
    display: flex;
    flex-direction: row;
    gap: 20rpx;
    flex-wrap: wrap;
    .image {
        width: 120rpx;
        height: 120rpx;
    }
}
.footer-warpper {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    padding-bottom: 68rpx;
    background-color: #fff;
    box-sizing: border-box;
    .footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 96rpx;
        box-sizing: inherit;
        padding: 0 20rpx;
        :deep(button) {
            height: 56rpx;
            margin-left: 20rpx;
            border-color: #666;
            color: #666;
            font-size: 24rpx;
            line-height: 56rpx;
        }
        .primary {
            color: #fff;
            :deep(button) {
                height: 56rpx;
                margin-left: 20rpx;
                color: #fff;
                font-size: 24rpx;
                line-height: 56rpx;
            }
        }
    }
}
</style>
