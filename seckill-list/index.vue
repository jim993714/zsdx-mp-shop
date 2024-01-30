<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import doAction from '@/utils/action/index';

import { fetchTimeGoodsList, fetchTimeList } from '../api/seckill-list/index';
import type { GetTimeGoodsListItem, TimeItem, TimeListResp } from '../api/seckill-list/types';
import GoodsCard from './components/goods-card.vue';

const currentTabIndex = ref(0);
const detail = ref<TimeListResp>();
const timeList = ref<TimeItem[]>([]);
const scrollIdMap = ref<Record<string, string>>({});
const goodsListMap = ref<Record<string, GetTimeGoodsListItem[]>>({});
const isRefresh = ref(false);
const showHome = ref(false);
const statusBarHeight = ref(0);
const listType = ref<Record<string, 1 | 2>>({});

const swiperHeight = computed(() => {
    return (
        280 *
            goodsListMap.value?.[timeList.value?.[currentTabIndex.value]?.timeNo]?.filter?.(
                goods => goods.status !== 3
            )?.length +
        100 +
        'rpx'
    );
});
const currentTimeNo = computed(() => {
    return timeList.value[currentTabIndex.value].timeNo;
});

onLoad(() => {
    getTimeList();
    const pages = getCurrentPages();
    showHome.value = pages.length === 1;
    statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight ?? 0;
});

/**
 * 状态显示
 * @param startTime
 * @param endTime
 */
function filterStatus(startTime: number, endTime: number) {
    startTime = startTime * 1;
    endTime = endTime * 1;

    const now = dayjs();
    const start = dayjs(startTime);
    if (start.isSame(now, 'day')) {
        if (now.unix() * 1000 < startTime) {
            return '即将开始';
        }
        if (now.unix() * 1000 >= startTime && now.unix() * 1000 <= endTime) {
            return '疯抢中';
        }
    }
    if (now.add(1, 'day').isSame(start, 'day')) {
        return '明日预告';
    }
    return start.format('MM月DD日');
}

/**
 * 倒计时
 * @param endTime
 */
function filterCountDown(endTime: number) {
    let delta = (endTime - new Date().getTime()) / 1000 + 1;
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

function handleSwiperChange(item: any) {
    currentTabIndex.value = item.target.current;
    const timeNo = timeList.value[currentTabIndex.value].timeNo;
    console.log('goodsListMap.value[timeNo]', goodsListMap.value[timeNo], currentTabIndex.value);
    if (!goodsListMap.value[timeNo] || goodsListMap.value[timeNo]?.length < 1) {
        getGoodsList(timeNo, true);
    }
}

async function getTimeList() {
    const resp = await fetchTimeList();
    detail.value = resp;
    timeList.value = resp.list;
    getGoodsList(timeList.value?.[currentTabIndex.value].timeNo, true);
    isRefresh.value = false;
}

async function getGoodsList(timeNo: string, init?: boolean) {
    if (init) {
        goodsListMap.value[timeNo] = [];
        scrollIdMap.value[timeNo] = '';
        listType.value[timeNo] = 1;
    }
    if (scrollIdMap.value[timeNo] === 'null') return;
    const resp = await fetchTimeGoodsList({
        timeNo: timeNo,
        scrollId: scrollIdMap.value[timeNo] ?? '',
        listType: listType.value[timeNo] ?? 1
    });
    if (!goodsListMap.value[timeNo]) {
        if (listType.value[timeNo] === 2) {
            goodsListMap.value[timeNo] = [...goodsListMap.value[timeNo], ...(resp.list ?? [])];
        } else {
            goodsListMap.value[timeNo] = resp.list ?? [];
        }
    } else {
        goodsListMap.value[timeNo] = [...goodsListMap.value[timeNo], ...(resp.list ?? [])];
    }

    if (!resp.scrollId) {
        if (listType.value[timeNo] === 2) {
            scrollIdMap.value[timeNo] = resp.scrollId || 'null';
        } else {
            listType.value[timeNo] = 2;
            scrollIdMap.value[timeNo] = resp.scrollId || '';
        }

        if (Array.isArray(resp.list) && resp.list.length < 5) {
            // 如果 listType 为 1, 且首页家在不足五条，自动加载 listType 为 2 的数据
            getGoodsList(timeNo);
        }
    } else {
        scrollIdMap.value[timeNo] = resp.scrollId || '';
    }
    uni.stopPullDownRefresh();
}

const initShare = () => {
    return {
        path: `/pages/shop/seckill-list/index`,
        title: '欢迎来到我的校园店～'
    };
};
onPullDownRefresh(() => {
    getTimeList();
});
onReachBottom(() => {
    if (scrollIdMap.value[currentTimeNo.value] === 'null') return;
    getGoodsList(currentTimeNo.value);
});
onShareAppMessage(initShare);
onShareTimeline(initShare);

function refresh() {
    isRefresh.value = true;
    setTimeout(() => {
        getTimeList();
    }, 600);
}
function toHome() {
    uni.$emit('goIndex');
}

const show = ref(false);
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view class="background-circle"></view>
    <zd-header
        title="物流信息"
        color="red"
        show-header-left
        class="zd-header"
        show-fixed
        fix-background="#ff4734"
        fix-color="#fff"
    >
        <template #fix-set>
            <view class="header">
                <zd-icon
                    v-if="showHome"
                    type="zdmp-huidaoshouye"
                    :size="36"
                    @tap="toHome"
                />
                <zd-icon
                    v-else
                    type="zdmp-fanhui"
                    :size="36"
                    @tap="router.back()"
                />

                <view class="title">
                    <image
                        src="https://nss1.zsdx.cn/mp-cs/images/shop/seckill/header.png"
                        mode="widthFix"
                    />
                </view>
            </view>
        </template>
    </zd-header>
    <view class="container">
        <view class="content">
            <image
                v-if="detail?.imageUrl"
                class="banner"
                :src="detail?.imageUrl"
                mode="aspectFill"
                @tap="doAction(detail?.appAction.toUpperCase())"
            />
            <view
                class="tabbar-wrapper"
                :style="{
                    top: statusBarHeight * 2 + 80 + 'rpx'
                }"
            >
                <view class="bg-layer">
                    <view class="tabbar">
                        <view
                            v-for="(item, index) in timeList"
                            :key="index"
                            class="tabbar-item"
                            :class="{
                                'active-item': index === currentTabIndex
                            }"
                            @tap="currentTabIndex = index"
                        >
                            <view class="time bebas-neue-regular">{{
                                dayjs(item.startTime).format('HH:mm')
                            }}</view>
                            <view class="status">{{
                                filterStatus(item.startTime, item.endTime)
                            }}</view>
                        </view>
                    </view>
                    <view class="countdown">
                        <view class="label">
                            {{
                                timeList[currentTabIndex]?.startTime < dayjs().unix() * 1000
                                    ? '距结束'
                                    : '距开始'
                            }}
                        </view>
                        <template
                            v-for="(item, index) in timeList"
                            :key="item.endTime"
                        >
                            <uni-countdown
                                v-if="index === currentTabIndex && !isRefresh"
                                background-color="#CC2F1F"
                                splitor-color="#fff"
                                color="#fff"
                                :font-size="22"
                                v-bind="
                                    filterCountDown(
                                        item.startTime < dayjs().unix() * 1000
                                            ? item.endTime
                                            : item.startTime
                                    )
                                "
                                @timeup="refresh"
                            />
                        </template>
                    </view>
                </view>
            </view>

            <swiper
                class="swiper"
                :autoplay="false"
                :current="currentTabIndex"
                :style="{
                    height: swiperHeight
                }"
                @change="handleSwiperChange"
            >
                <swiper-item
                    v-for="item in timeList"
                    :key="item.timeNo"
                >
                    <view class="swiper-item">
                        <template
                            v-if="
                                (goodsListMap[item.timeNo]?.length ?? 0) === 0 &&
                                scrollIdMap[item.timeNo] === 'null'
                            "
                        >
                            <zd-empty
                                :top="20"
                                image="https://nss1.zsdx.cn/mp-cs/images/shop/seckill/empty.png"
                                :image-height="200"
                                description="商品正在马不停蹄的赶来~"
                            ></zd-empty>
                        </template>
                        <template v-else>
                            <template
                                v-for="goods in goodsListMap[item.timeNo] ?? []"
                                :key="goods.saleNo + goods.status"
                            >
                                <goods-card
                                    v-if="goods.status !== 3"
                                    :key="goods.saleNo + goods.status"
                                    :item="goods"
                                    style="margin-bottom: 20rpx"
                                    :start-time="
                                        dayjs(timeList[currentTabIndex].startTime).format('HH:mm')
                                    "
                                />
                            </template>
                        </template>
                    </view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<style scoped lang="scss">
$circleSize: 3000rpx;
.container {
    z-index: -1;
    width: 100%;
    min-height: calc(100vh - env(safe-area-inset-top) - 120rpx - var(--status-bar-height));
    margin: 0;
    background-color: #f5f8fa;
}
.background-circle {
    position: fixed;
    top: calc(910rpx - $circleSize);
    left: calc($circleSize/-2 + 375rpx);
    z-index: 0;
    width: $circleSize;
    height: $circleSize;
    border-radius: calc($circleSize/2);
    background: linear-gradient($zd-color-red 90%, #e62f2f 100%);
}
.zd-header {
    z-index: 100;
    .header {
        top: 0;
        display: flex;
        align-items: center;
        height: 100rpx;
        padding-left: 20rpx;
        color: #fff;
        .title {
            margin-left: 20rpx;
            image {
                width: 148rpx;
            }
        }
    }
}

.content {
    z-index: 10;
    padding: 0 20rpx;
    box-sizing: border-box;
}
.banner {
    position: relative;
    z-index: 10;
    width: 710rpx;
    height: 240rpx;
    margin-top: 20rpx;
    border-radius: 16rpx;
}

.tabbar-wrapper {
    position: sticky;
    z-index: 100;
    background-color: #ff4734;
    .bg-layer {
        width: 710rpx;
        height: 216rpx;
        margin-top: 0rpx;
        margin-bottom: 24rpx;
        background: linear-gradient(180deg, #d92621 0%, #ff4734 100%);
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
        .tabbar {
            display: flex;
            justify-content: space-around;
            &-item {
                display: flex;
                align-items: center;
                margin-top: 40rpx;
                text-align: center;
                color: #fff;
                opacity: 0.7;
                flex-direction: column;
                .time {
                    font-size: 40rpx;
                    line-height: 40rpx;
                }
                .status {
                    width: min-content;
                    height: 36rpx;
                    line-height: 36rpx;
                    margin-top: 6rpx;
                    padding: 0rpx 12rpx;
                    border-radius: 20rpx;
                    white-space: nowrap;
                    font-size: 20rpx;
                }
            }
            .active-item {
                opacity: 1;
                .status {
                    color: $zd-color-red;
                    background-color: #fff;
                }
            }
        }
    }

    .countdown {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10rpx;
        color: #fff;
        .label {
            margin-right: 20rpx;
        }
        :deep(.uni-countdown__number) {
            width: 60rpx;
            height: 60rpx;
            font-family: 'Bebas Neue' !important;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    }
}

.swiper {
    position: relative;
    z-index: 20;
    height: max-content;
    min-height: 400rpx;
    transition: all 0.3s;
    :deep(swiper-item) {
        height: max-content;
    }
    .swiper-item {
        display: flex;
        height: 400rpx;
        flex-direction: column;
    }
}
</style>
