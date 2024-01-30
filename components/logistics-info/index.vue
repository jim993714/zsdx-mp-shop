<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { CDN_BASE_URL } from '@/base/constants';

import { getLogisticsInfo } from '../../api/order/index';
import type { LogisticsInfoRes, TrackingDetailStatus } from '../../api/order/types';
import { LogisticsType, TrackingStatus } from '../../api/order/types';
import { trackingStatusLabel } from './constants';

const props = withDefaults(
    defineProps<{
        orderNo?: string;
        type?: LogisticsType;
        mode?: 'simple' | 'detail';
        request?: () => Promise<LogisticsInfoRes>;
        collectionSignImageList?: string[];
        tab?: number;
    }>(),
    {
        orderNo: undefined,
        type: LogisticsType.Normal,
        mode: 'detail',
        request: undefined,
        tab: 0,
        collectionSignImageList: undefined
    }
);

const goodInfo = ref<{
    goodsCover: string;
}>();

const logisticsCards = ref<
    {
        trackingNo: string;
        logisticsName: string;
        logisticsPhone: string;
    }[]
>([]);

const logisticsList = ref<
    {
        title: string;
        desc?: string;
        type?: TrackingDetailStatus;
    }[][]
>([]);

const cur = ref(0);

function formatDate(date: number) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

function onChange(event: { detail: { current: number } }) {
    cur.value = event.detail.current;
}

const statusLabel = computed(() => {
    const type = logisticsList.value[cur.value].slice(-1)[0].type;
    return type
        ? trackingStatusLabel[logisticsList.value[cur.value].slice(-1)[0].type!]
        : '物流信息';
});

const list = computed(() => {
    if (props.mode === 'detail') {
        return logisticsList.value[cur.value];
    } else {
        let data = logisticsList.value.map(item => item[0]).filter(item => item);

        if (isCollapse.value) {
            return data.slice(0, 1);
        }

        return data;
    }
});

const isCollapse = ref(true);

function copyTrackingNo() {
    uni.setClipboardData({
        data: logisticsCards.value[cur.value].trackingNo,
        success: res => {
            if (res) {
                uni.showToast({
                    title: '复制成功',
                    icon: 'success'
                });
            }
        }
    });
}

function previewImages() {
    if (props.collectionSignImageList?.length) {
        uni.previewImage({
            urls: props.collectionSignImageList
        });
    }
}

watch(
    props,
    async () => {
        if (props.orderNo) {
            const _logisticsList: typeof logisticsList.value = [];

            const data = await (props.request?.() ??
                getLogisticsInfo({
                    orderNo: props.orderNo,
                    type: props.type
                }));

            const cards: typeof logisticsCards.value = [];
            cards.push({
                trackingNo: data.trackingNo,
                logisticsName: data.logisticsName,
                logisticsPhone: data.logisticsPhone
            });

            if (data.trackingInfoList) {
                _logisticsList.push(
                    data.trackingInfoList.map(item => ({
                        title: item.info,
                        desc: formatDate(item.createTime),
                        type: item.type
                    }))
                );
            } else {
                _logisticsList.push([]);
            }

            if (data.extraTrackingInfo) {
                data.extraTrackingInfo.forEach(item => {
                    cards.push({
                        trackingNo: item.trackingNo,
                        logisticsName: item.logisticsName,
                        logisticsPhone: item.logisticsPhone
                    });

                    if (item.trackingInfoList) {
                        _logisticsList.push(
                            item.trackingInfoList.map(item => ({
                                title: item.info,
                                desc: formatDate(item.createTime),
                                type: item.type
                            }))
                        );
                    } else {
                        _logisticsList.push([]);
                    }

                    if (
                        props.mode === 'simple' &&
                        item.trackingStatus === TrackingStatus.None &&
                        item.trackingNo
                    ) {
                        _logisticsList[_logisticsList.length - 1].splice(0, 0, {
                            title: `物流单号: ${item.trackingNo}`
                        });
                    }
                });
            }

            goodInfo.value = {
                goodsCover: data.goodsCover
            };

            if (
                props.mode === 'simple' &&
                data.trackingStatus === TrackingStatus.None &&
                data.trackingNo
            ) {
                _logisticsList[0].splice(0, 0, {
                    title: `物流单号: ${data.trackingNo}`
                });
            }

            logisticsList.value = [..._logisticsList];

            logisticsCards.value = [...cards];
        }
    },
    {
        immediate: true
    }
);

watch(
    () => props.tab,
    () => {
        cur.value = props.tab;
        console.log(cur.value);
    }
);

function gotoDetail(i: number) {
    if (props.mode === 'simple') {
        router.push('logistics', {
            orderNo: props.orderNo,
            type: props.type,
            tab: i
        });
    }
}
</script>

<script lang="ts">
export default {
    options: {
        multipleSlots: true,
        styleIsolation: 'shared',
        addGlobalClass: true,
        virtualHost: true
    }
};
</script>

<template>
    <view class="logistics-info">
        <swiper
            v-if="mode === 'detail'"
            :class="{
                'logistics-info-cards': true,
                'logistics-info-cards__multi': logisticsCards.length > 1
            }"
            :current="cur"
            :indicator-dots="logisticsCards.length > 1"
            indicator-color="rgba(255,255,255,0.2)"
            indicator-active-color="#fff"
            @change="onChange"
        >
            <swiper-item
                v-for="(card, i) in logisticsCards"
                :key="i"
            >
                <view class="logistics-info-cards-content">
                    <image :src="goodInfo?.goodsCover" />
                    <view class="logistics-info-cards-content-right">
                        <view class="logistics-info-cards-content-right-row">
                            <text>物流公司：</text>
                            <text>{{ card.logisticsName }}</text>
                        </view>
                        <view class="logistics-info-cards-content-right-row">
                            <text>物流单号：</text>
                            <text>{{ card.trackingNo }}</text>
                            <view @tap="copyTrackingNo">
                                <zd-icon
                                    :size="24"
                                    type="zdmp-fuzhi"
                                    color="#fff"
                                />
                            </view>
                        </view>
                        <view class="logistics-info-cards-content-right-row">
                            <text>物流电话：</text>
                            <text>{{ card.logisticsPhone }}</text>
                        </view>
                    </view>
                </view>
            </swiper-item>
        </swiper>
        <scroll-view
            class="logistics-info-list"
            scroll-y
        >
            <view style="padding-right: 24rpx">
                <template
                    v-for="(item, i) in list"
                    :key="`${i}-${cur}`"
                >
                    <view
                        v-if="mode === 'simple' || i === 0"
                        :class="{
                            'logistics-info-list-status': true,
                            'logistics-info-list-status__simple': mode === 'simple'
                        }"
                        @tap="gotoDetail(i)"
                    >
                        <view class="logistics-info-list-status-icon">
                            <zd-icon
                                type="zdmp-zaituzhong"
                                color="#fff"
                                :size="32"
                            />
                        </view>
                        <text>
                            <template v-if="mode === 'simple' && logisticsList.length > 1">
                                包裹{{ i + 1 }}:
                            </template>
                            {{ statusLabel }}
                        </text>
                        <view
                            v-if="collectionSignImageList?.length"
                            class="logistics-info-list-status-img"
                            @click.stop="previewImages"
                        >
                            签收照片
                        </view>
                        <text
                            v-if="mode === 'simple'"
                            class="logistics-info-list-status-date"
                        >
                            {{ item.desc }}
                        </text>
                    </view>
                    <view
                        :class="{
                            'logistics-info-list-cell': true,
                            'logistics-info-list-cell__simple': mode === 'simple'
                        }"
                        @tap="gotoDetail(i)"
                    >
                        <view class="logistics-info-list-cell-progress">
                            <view class="logistics-info-list-cell-progress-line" />
                        </view>
                        <view class="logistics-info-list-cell-detail">
                            <text>
                                {{ item.title }}
                            </text>
                            <text
                                v-if="mode === 'detail'"
                                style="color: #88909c"
                                >{{ item.desc }}</text
                            >
                        </view>
                    </view>
                </template>
                <zd-empty
                    v-if="list && list.length === 0 && mode === 'detail'"
                    :image-width="450"
                    :image-height="250"
                    :image="`${CDN_BASE_URL}/mp-cs/images/shop/order/empty-track-bg.png`"
                    description="暂无获取到您的物流信息"
                />
                <view
                    v-if="mode === 'simple' && logisticsList.length > 1"
                    class="logistics-info-list-collapse"
                    @tap="isCollapse = !isCollapse"
                >
                    {{ isCollapse ? '更多物流' : '收起' }}
                    <view
                        :style="{
                            transform: `rotate(${isCollapse ? '-90deg' : '90deg'})`,
                            'margin-top': `${isCollapse ? '' : '-'}4rpx`
                        }"
                    >
                        <zd-icon
                            :size="24"
                            type="zdmp-fanhui"
                            color="#8A9399"
                        />
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<style scoped lang="scss">
.logistics-info {
    position: relative;
    width: 100%;

    &-cards {
        width: 100%;
        height: 180rpx;
        margin-bottom: 24rpx;

        &__multi {
            height: 232rpx;
        }

        &-content {
            display: flex;
            align-items: center;
            width: 100%;
            height: 180rpx;
            padding: 20rpx;
            border-radius: 16rpx;
            background: rgba(255, 255, 255, 0.2);
            box-sizing: border-box;
            gap: 30rpx;

            > image {
                width: 140rpx;
                height: 140rpx;
                border-radius: 16rpx;
            }

            &-right {
                display: flex;
                font-weight: 400;
                flex: 1;
                flex-direction: column;
                gap: 4rpx;
                line-height: 40rpx;

                &-row {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 18rpx;
                    color: rgba($color: #fff, $alpha: 0.8);
                    font-size: 28rpx;
                    font-weight: 400;
                    line-height: 40rpx;

                    text:not(:first-of-type) {
                        color: #fff;
                    }
                }
            }
        }
    }

    &-list {
        border-radius: 16rpx;
        background: #fff;
        box-sizing: border-box;

        &-status {
            display: flex;
            align-items: center;
            width: calc(100% - 20rpx);
            height: 84rpx;
            margin: 0 20rpx 0 20rpx;
            padding-top: 36rpx;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 44rpx;
            gap: 20rpx;
            box-sizing: border-box;

            &-icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 44rpx;
                height: 44rpx;
                border-radius: 22rpx;
                background: $zd-main-color;
            }

            &__simple {
                &:not(:first-of-type) {
                    border-top: 2rpx solid #f5f6f8;
                }
            }

            &-date {
                flex: 1;
                text-align: right;
                color: #576066;
                font-size: 24rpx;
                font-weight: 500;
                line-height: 34rpx;
            }

            &-img {
                width: 112rpx;
                height: 36rpx;
                border-radius: 18rpx;
                text-align: center;
                color: #fff;
                font-size: 20rpx;
                background: #199fff;
                line-height: 36rpx;
            }
        }

        &-collapse {
            display: flex;
            justify-content: center;
            align-items: center;
            width: calc(100% + 24rpx);
            height: 82rpx;
            border-top: 2rpx solid #f5f6f8;
            color: $uni-color-title;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 28rpx;
            gap: 12rpx;

            > view {
                width: 19rpx;
                height: 19rpx;
            }
        }

        &-cell {
            display: flex;

            &-progress {
                position: relative;
                display: flex;
                align-items: center;
                width: 84rpx;
                flex-direction: column;

                &::before {
                    position: absolute;
                    width: 14rpx;
                    height: 14rpx;
                    margin-top: 32rpx;
                    border-radius: 7rpx;
                    background: $uni-text-color-disable;
                    content: '';
                }

                &-line {
                    width: 2rpx;
                    height: 100%;
                    background: $uni-text-color-disable;
                }
            }

            &__simple {
                .logistics-info-list-cell-progress::before {
                    display: none;
                }

                .logistics-info-list-cell-progress-line {
                    height: 100% !important;
                }
            }

            &-detail {
                display: flex;
                padding: 18rpx 0;
                color: $uni-text-color;
                font-size: 28rpx;
                font-weight: 400;
                flex: 1;
                flex-direction: column;
                line-height: 40rpx;
                gap: 4rpx;
                word-break: break-all;
            }

            &:nth-of-type(2) {
                .logistics-info-list-cell-progress {
                    &::before {
                        display: none;
                    }
                }
            }

            &:last-of-type {
                .logistics-info-list-cell-progress {
                    &-line {
                        height: 46rpx;
                    }
                }
            }
        }
    }
}
</style>
