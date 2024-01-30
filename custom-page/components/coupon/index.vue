<script setup lang="ts">
import dayjs from 'dayjs';

import { checkReceiveSuccess, receiveCoupon } from '../../../api/coupon/index';
import { CheckReceiveResult, ReceiveResult } from '../../../api/coupon/types';
import { type CouponData, type CouponItem, CouponShowType, type CouponStyle } from '../../types';
import NormalStyle from './normal-style.vue';
import SlideStyle from './slide-style.vue';
import { getAcceptStatus } from './utils';

const props = withDefaults(
    defineProps<{
        data: CouponData;
        styleConfig: CouponStyle;
    }>(),
    {
        styleConfig: () => ({
            marginV: 10,
            marginH: 10,
            coupon_array: 0,
            iconColor: 'rgba(255,255,255,1)',
            iconFontSize: 20,
            iconTop: 20,
            iconLeft: 20,
            coupon_width: 200,
            receive_type: 1,
            backgroundColor: '',
            height: 0
        })
    }
);
const couponList = computed(() => {
    return props.data.coupon_list;
});

async function handleReceiveCoupon({ coupon, index }: { coupon: CouponItem; index: number }) {
    const status = getAcceptStatus(coupon);

    if (status === -3) return;

    if (props.styleConfig.receive_type === 2) {
        const now = dayjs().unix();
        const receiveStartTime = dayjs(props.styleConfig.receive_time).unix();

        if (now < receiveStartTime) {
            uni.showToast({
                title: `${dayjs(props.styleConfig.receive_time).format(
                    'YYYY/MM/DD HH:mm:ss'
                )}才可以领取`,
                icon: 'none'
            });
            return;
        }
    }

    uni.showLoading({
        title: '领取中',
        mask: true
    });

    try {
        // 领取接口
        const res = await receiveCoupon({ couponNo: coupon.coupon_no });

        if (res.result === ReceiveResult.SUCCESS) {
            receiveSuccess(index);
        } else if (res.result === ReceiveResult.WAITING) {
            // 轮询
            const timer = setInterval(async () => {
                const checkRes = await checkReceiveSuccess(res.receiveTicket);

                if (checkRes.result === CheckReceiveResult.SUCCESS) {
                    clearInterval(timer);
                    receiveSuccess(index);
                } else if (checkRes.result === CheckReceiveResult.FAIL) {
                    clearInterval(timer);
                    uni.hideLoading();
                    uni.showToast({
                        title: '领取失败',
                        icon: 'none'
                    });
                }
            }, 1000);
        }
    } catch (error: any) {
        uni.hideLoading();
        uni.showToast({
            title: error.msg,
            icon: 'none'
        });
    }
}

function receiveSuccess(index: number) {
    couponList.value[index].receive_status = 1;
    couponList.value[index].receive_count += 1;

    uni.hideLoading();

    uni.showToast({
        title: '领取成功',
        icon: 'none'
    });
}
</script>

<template>
    <view
        class="coupon"
        :style="{ backgroundColor: props.styleConfig.backgroundColor }"
    >
        <normal-style
            v-if="props.styleConfig.coupon_array !== CouponShowType.SLIDE"
            :coupon-list="couponList"
            :style-config="props.styleConfig"
            @receive="handleReceiveCoupon"
        />
        <slide-style
            v-else
            :coupon-list="couponList"
            :style-config="props.styleConfig"
            @receive="handleReceiveCoupon"
        />
    </view>
</template>

<style lang="scss" scoped>
.coupon {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 750rpx;
    box-sizing: border-box;
}
</style>
