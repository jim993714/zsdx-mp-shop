<script setup lang="ts">
import { clickTrack } from '@zsdx/mp-utils';
import dayjs from 'dayjs';
import { ref } from 'vue';

import {
    receiveCoupon,
    receiveCouponCheck,
    receiveRedPacket,
    receiveRedPacketCheck
} from '../../api/goods-detail/index';
import type { Coupon } from '../../api/goods-detail/types';

const props = defineProps<{
    list: Coupon[];
    studentShopId: string;
}>();
const emit = defineEmits(['change']);
const drawerRef = ref();
let checkTimer = 0;

const open = () => {
    drawerRef?.value?.open();
};
const close = () => {
    drawerRef?.value?.close();
};
const fnAccept = async (item: Coupon) => {
    if (item.type === 'coupon') {
        try {
            const result = await receiveCoupon({
                isNeedReturnResultCheck: 0,
                couponNo: item.couponNo,
                studentShopId: props.studentShopId
            });

            if (result.result == -1) {
                uni.showToast({
                    title: '领取失败',
                    icon: 'none'
                });
            } else if (result.result == 1) {
                item.receiveStatus = 1;
                uni.showToast({
                    title: '领取成功',
                    icon: 'none'
                });
            } else if (result.result == 2) {
                fnCheckReceive(result.receiveTicket || '', item);
            }
        } catch (e: any) {
            uni.showToast({
                title: e.msg,
                icon: 'none'
            });
        }
    } else if (item.type === 'red_packet') {
        try {
            const result = await receiveRedPacket({
                packetNo: item.packetNo
            });

            if (result.result == -1) {
                uni.showToast({
                    title: '领取失败',
                    icon: 'none'
                });
            } else if (result.result == 1) {
                item.receiveStatus = 1;
                uni.showToast({
                    title: '领取成功',
                    icon: 'none'
                });
            } else if (result.result == 2) {
                fnCheckReceivePacket(result.receiveTicket || '', item);
            }
        } catch (e: any) {
            uni.showToast({
                title: e.msg,
                icon: 'none'
            });
        }
    }
    track(item);
};
const track = (item: Coupon) => {
    let data = {
        type: 'click',
        eventData: {
            action: 2,
            path: 'bi_event',
            element_name: '确认领取优惠券',
            student_shop_id: props.studentShopId,
            page_data_type: 'Goods',
            page_data_id: item.couponNo,
            page_data_info: item
        }
    };
    clickTrack(data);
};
const fnCheckReceivePacket = (ticket: string, item: Coupon) => {
    clearTimeout(checkTimer);

    checkTimer = setTimeout(async () => {
        const checkResult = await receiveRedPacketCheck({
            receiveTicket: ticket
        });
        if (checkResult.result === 1) {
            item.receiveStatus = 1;
            uni.showToast({
                title: '领取成功',
                icon: 'none'
            });
        } else if (checkResult.result === 0) {
            fnCheckReceive(ticket, item);
        } else if (checkResult.result === -1) {
            uni.showToast({
                title: '领取失败',
                icon: 'none'
            });
        }
    }, 1000);
};
const fnCheckReceive = (ticket: string, item: Coupon) => {
    clearTimeout(checkTimer);

    checkTimer = setTimeout(async () => {
        const checkResult = await receiveCouponCheck({
            receiveTicket: ticket
        });
        if (checkResult.result === 1) {
            item.receiveStatus = 1;
            uni.showToast({
                title: '领取成功',
                icon: 'none'
            });
        } else if (checkResult.result === 0) {
            fnCheckReceive(ticket, item);
        } else if (checkResult.result === -1) {
            uni.showToast({
                title: '领取失败',
                icon: 'none'
            });
        }
    }, 1000);
};
const filterLimit = (limit: number, limitType: number) => {
    switch (limitType) {
        case 0:
            return '无门槛';
        case 1:
            return `满${limit}元可用`;
        case 2:
            return `满${limit}件可用`;
        default:
            return '';
    }
};
const filterTime = (time: number) => {
    return dayjs(time).format('YYYY.MM.DD');
};
const fnStop = (e: any) => {
    e && e.stopPropagation();
};
defineExpose({
    open
});
onUnload(() => {
    clearTimeout(checkTimer);
});
</script>
<template>
    <zd-drawer-bottom
        ref="drawerRef"
        header-text="优惠"
        @touchmove.prevent.stop="fnStop"
    >
        <scroll-view
            scroll-y
            class="drawer-main"
        >
            <view
                v-for="(item, index) in list"
                :key="index"
                class="coupon-item"
                :class="{
                    packet: item.type === 'red_packet',
                    purple: item.type === 'coupon' && item.isOfficial === 1
                }"
            >
                <image
                    v-if="item.hasLastCount === 0"
                    class="coupon-tag"
                    src="https://cdn.zsdx.cn/mp-cs/images/shop/detail/over.png"
                    mode="aspectFit"
                />
                <image
                    v-else-if="item.receiveStatus === 1"
                    class="coupon-tag"
                    src="https://cdn.zsdx.cn/mp-cs/images/shop/detail/icon-accepted.png"
                    mode="aspectFit"
                />
                <view class="coupon-head">
                    <!-- 折扣券 -->
                    <view
                        v-if="item.type === 'coupon' && item.couponType == 2"
                        class="coupon-money"
                    >
                        <view class="bebas-neue-regular coupon-money-number">{{
                            item.discountNum
                        }}</view>
                        <view class="bebas-neue-regular coupon-money-unit">折</view>
                    </view>
                    <!-- 红包,优惠券 -->
                    <view
                        v-else
                        class="coupon-money"
                    >
                        <view class="bebas-neue-regular coupon-money-unit">¥</view>
                        <view class="bebas-neue-regular coupon-money-number">{{
                            item.discountNum
                        }}</view>
                    </view>
                    <view class="coupon-limit">{{
                        filterLimit(item.discountLimit, item.discountLimitType)
                    }}</view>
                    <view
                        v-if="item.type === 'red_packet'"
                        class="coupon-type"
                        >红包</view
                    >
                    <view
                        v-else-if="item.isOfficial !== 1 && item.type === 'coupon'"
                        class="coupon-type"
                        >校园店券</view
                    >
                    <view
                        v-else
                        class="coupon-type"
                        >掌大券</view
                    >
                </view>
                <view class="coupon-main">
                    <view class="coupon-title">{{ item.title }}</view>
                    <view class="coupon-time"
                        >有效期: {{ filterTime(item.useStartTime) }}
                        -
                        {{ filterTime(item.useEndTime) }}</view
                    >
                    <view
                        v-if="
                            item.type === 'coupon' &&
                            item.isSingleGoods !== 1 &&
                            item.useLimitType === 2
                        "
                        class="coupon-enable"
                    >
                        部分可用{{ item.couponType === 2 ? ',' : '' }}
                    </view>
                    <view
                        v-else-if="
                            item.type === 'red_packet' &&
                            item.isSingleGoods !== 1 &&
                            item.useLimitType === 2
                        "
                        class="coupon-enable"
                    >
                        部分可用{{ item.couponType === 2 ? ',' : '' }}
                    </view>
                    <view
                        v-else-if="item.useLimitType == 1"
                        class="coupon-enable"
                    >
                        <view class="coupon-enable-text">
                            全场可用{{ item.couponType === 2 ? ',' : '' }}
                        </view>
                        <view
                            v-if="item.couponType === 2"
                            class="coupon-enable-text primary"
                        >
                            最高可减{{ item.discountNumMax }}元
                        </view>
                    </view>
                </view>
                <view
                    v-if="item.couponStatus === 1"
                    class="accept-button primary"
                    @tap="fnAccept(item)"
                    >立即领取</view
                >
                <view
                    v-else
                    class="accept-button"
                    >已领完</view
                >
            </view>
            <view class="bottom-seat savepadding"></view>
        </scroll-view>
        <view class="pop-footer savepadding">
            <zd-button
                type="primary"
                :button-style="{
                    width: '670rpx',
                    height: '80rpx',
                    fontSize: '32rpx'
                }"
                @tap="close()"
            >
                完成
            </zd-button>
        </view>
    </zd-drawer-bottom>
</template>
<style lang="scss" scoped>
.pop-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 120rpx;
    background: #ffffff;
    flex-direction: row;
}
.drawer-main {
    width: 750rpx;
    height: calc(100% - 120rpx);
    background-color: rgba(245, 248, 250, 1);
}

.coupon-item {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    width: 710rpx;
    height: 176rpx;
    margin: 20rpx 20rpx 0;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    flex-direction: row;
    background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/coupon-bg.png);
    &.packet {
        background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/package-bg.png);
    }
    &.purple {
        background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/allowance-bg.png);
        .coupon-money {
            color: rgba(127, 102, 255, 1);
        }
        .coupon-limit {
            color: rgba(127, 102, 255, 1);
        }
        .coupon-type {
            background-color: rgba(127, 102, 255, 1);
        }
        .accept-button.primary {
            background-color: rgba(127, 102, 255, 1);
        }
    }
}
.coupon-tag {
    position: absolute;
    top: -30rpx;
    right: -20rpx;
    width: 120rpx;
    height: 120rpx;
}
.accept-button {
    position: absolute;
    top: 50%;
    right: 20rpx;
    padding: 0 20rpx;
    border-radius: 28px;
    text-align: center;
    color: #8a9399;
    font-size: 24rpx;
    font-weight: 500;
    background: rgba(231, 233, 234, 1);
    transform: translateY(-50%);
    line-height: 56rpx;
    &.primary {
        color: #fff;
        background-color: $zd-color-red;
    }
}
.coupon-head {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 154rpx;
    height: 100%;
    margin-right: 20rpx;
    flex-direction: column;
}
.coupon-money {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: row;
    color: $zd-color-red;
    &-unit {
        font-size: 32rpx;
        line-height: 32rpx;
    }
    &-number {
        font-size: 64rpx;
        line-height: 50rpx;
    }
}
.coupon-limit {
    margin-top: 10rpx;
    color: $zd-color-red;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 28rpx;
}
.coupon-type {
    height: 32rpx;
    margin-top: 10rpx;
    padding: 0 30rpx;
    border-radius: 16rpx;
    color: rgba(255, 255, 255, 0.9);
    font-size: 20rpx;
    background: $zd-color-red;
    line-height: 32rpx;
}

.coupon-main {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    flex: 1;
    .coupon-title {
        color: #292f33;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
    }
    .coupon-time {
        margin-top: 20rpx;
        color: #8a9399;
        font-size: 24rpx;
        line-height: 28rpx;
    }

    .coupon-enable {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 22rpx;
        color: $uni-text-color-grey;
        font-size: 20rpx;
        flex-direction: row;
        line-height: 20rpx;
        &-text {
            &.primary {
                color: $uni-text-color;
            }
        }
    }
}
.bottom-seat {
    height: 20rpx;
}
</style>
