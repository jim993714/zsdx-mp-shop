<script setup lang="ts">
import dayjs from 'dayjs';

import { fetchMyGoodsReportList } from '../api/price-break/index';
import type { ListItem } from '../api/price-break/types';
import GoodsCard from '../price-break/components/goods-card.vue';
import { ReportState } from './constants';

const list = ref<ListItem[]>([]);

const scrollId = ref('');

onBeforeMount(() => {
    getList();
});

async function getList() {
    if (scrollId.value === 'null') return;
    const resp = await fetchMyGoodsReportList({
        scrollId: scrollId.value,
        size: 20
    });

    list.value = [...list.value, ...(resp.list ?? [])];
    scrollId.value = resp.scrollId || 'null';
}
</script>

<template>
    <view class="page">
        <template v-if="list.length > 0">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="list-item"
            >
                <view class="header">
                    <view class="left">
                        <view
                            v-if="item.state === ReportState.Pass"
                            class="label-1"
                        >
                            恭喜您！获得一张该商品5折优惠券
                        </view>
                        <view
                            v-if="item.state === ReportState.Pass"
                            class="label-2"
                        >
                            预计1~3个工作日发放至您的账户
                        </view>
                        <view
                            v-if="item.state === ReportState.UnderReview"
                            class="label-2"
                        >
                            审核时长大约1~3个工作日
                        </view>
                        <view
                            v-if="item.state === ReportState.NoPass"
                            class="label-2"
                        >
                            {{ item.verifyFailReason }}
                        </view>
                    </view>
                    <view class="right">
                        <view v-if="item.state === ReportState.UnderReview">
                            <zd-icon
                                type="zdmp-shenhezhong"
                                :size="28"
                            />
                            审核中
                        </view>
                        <view v-if="item.state === ReportState.Pass">
                            <zd-icon
                                type="zdmp-shenhetongguo"
                                :size="28"
                            />
                            审核通过
                        </view>
                        <view
                            v-if="item.state === ReportState.NoPass"
                            class="gray"
                        >
                            <zd-icon type="zdmp-butongguo" />
                            审核不通过
                        </view>
                    </view>
                </view>
                <view class="content">
                    <goods-card
                        :goods-detail="{
                            goodsUrl: item.goodsUrl,
                            goodsTitle: item.goodsTitle,
                            spec: item.spec,
                            price: item.reportPrice,
                            reportPrice: item.reportPrice
                        }"
                    />
                </view>
                <view class="footer">
                    <view>爆料时间：</view>
                    <view>
                        {{ dayjs(item.reportTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </view>
                </view>
            </view>
        </template>
        <template v-else>
            <zd-empty
                description="暂无爆料信息哦～"
                image="https://nss1.zsdx.cn/mp-cs/images/shop/price-break/empty.png"
            />
        </template>
    </view>
</template>

<style scoped lang="scss">
$pageBg: #f5f8fa;
.page {
    min-height: 100vh;
    padding: 20rpx;
    background: $pageBg;
    box-sizing: border-box;
}

.list-item {
    display: flex;
    width: 710rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 12rpx;
    background-color: #fff;
    flex-direction: column;
    box-sizing: border-box;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 8rpx;
        .left {
            display: flex;
            flex-direction: column;
            .label-1 {
                font-size: 28rpx;
                line-height: 28rpx;
                font-weight: bold;
            }
            .label-2 {
                margin: 24rpx 0;
                font-size: 24rpx;
                line-height: 24rpx;
            }
        }
        .right {
            color: #199fff;
            font-size: 28rpx;
            font-weight: bold;
            .gray {
                color: #8a9399;
            }
        }
    }
    .content {
        padding: 24rpx;
        border-radius: 12rpx;
        background-color: $pageBg;
        box-sizing: border-box;
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 24rpx;
        color: #8a9399;
        font-size: 24rpx;
    }
}
</style>
