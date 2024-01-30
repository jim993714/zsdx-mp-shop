<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import type { GoodsItem } from '../../api/search/types';

const props = defineProps<{
    goods: GoodsItem;
    options: any;
    trackSearchSession?: string;
}>();
const localStorage = storage();
const { goods } = toRefs(props);

function toDetail() {
    if (props.options.from === 'goodsDetailDiscount') {
        return router.push(props.options.from, {
            goodsNo: goods.value.goodsNo,
            studentShopId:
                props.options?.studentShopId ?? (localStorage.get('studentShopId') || ''),
            activityNo: props.options?.activityNo,
            timeId: goods.value.timeId,
            __trackSearchSession: props.trackSearchSession
        });
    }
    if (props.options.from === 'NewYearShop') {
        return router.push('goodsDetail', {
            goodsNo: goods.value.goodsNo,
            __trackSearchSession: props.trackSearchSession
        });
    }
    if (props.options.activityNo) {
        router.push('goodsDetailSummer', {
            goodsNo: goods.value.goodsNo,
            studentShopId:
                props.options?.studentShopId ?? (localStorage.get('studentShopId') || ''),
            zoneId: goods.value.zoneId,
            actGoodsNo: goods.value.actGoodsNo,
            timeId: goods.value.timeId,
            __trackSearchSession: props.trackSearchSession
        });
    } else {
        router.push('goodsDetail', {
            goodsNo: goods.value.goodsNo,
            studentShopId:
                props.options?.studentShopId ?? (localStorage.get('studentShopId') || ''),
            customPageNo: props.options?.customPageNo ?? '',
            __trackSearchSession: props.trackSearchSession
        });
    }
}
const getTextIndent = (item: any, goodsShowPriceType?: number) => {
    if (!item.activityTagImg && goodsShowPriceType == 2) return '2.7rem';
    if (!item.width) {
        return '0rpx';
    }
    let width = (item.width * 28) / item.height;

    if (!width) {
        return '0rpx';
    }
    return width + 8 + 'rpx';
};
</script>

<template>
    <view
        class="goods-item"
        @tap="toDetail"
    >
        <image
            class="goods-cover"
            :src="goods.goodsCover"
            mode="scaleToFill"
        />
        <view
            v-if="goods.maxSubsidy"
            class="badge-wrapper"
        >
            <image
                :src="'http://cdn.zsdx.cn/mp-cs/images/activity/new-year-shop/widget.png'"
                mode="scaleToFill"
                class="badge-wrapper"
            />
            <view class="badge-text ellipsis"> 最多返{{ goods.maxSubsidy }}元 </view>
        </view>
        <view class="goods-title-info">
            <image
                v-if="goods.activityTagImg"
                class="goods-tag"
                :src="goods.activityTagImg"
                mode="heightFix"
            />
            <image
                v-else-if="goods.goodsShowPriceType == 2"
                class="goods-tag"
                src="https://cdn.zsdx.cn/mp-cs/images/home/student-price-red.png"
                mode="widthFix"
            />
            <text
                class="goods-title ellipsis2"
                :style="{
                    textIndent: getTextIndent(goods, goods.goodsShowPriceType)
                }"
            >
                {{ goods.goodsTitle }}
            </text>
        </view>
        <view class="goods-price">
            <zd-price
                :value="
                    (goods.discount ?? -1) > 0 ? goods.vacationPrice : goods.goodsShowPrice ?? 0
                "
                :font-size-large="40"
                :font-size-small="28"
                :font-size-unit="20"
            />
            <view
                v-if="
                    (goods.discount ?? -1) > 0 ||
                    goods.goodsShowOriginPrice !== goods.goodsShowPrice
                "
                class="origin-price"
            >
                {{ (goods.discount ?? -1) > 0 ? '' : '原价' }}
                ¥{{ goods.goodsShowOriginPrice }}
            </view>
        </view>
        <view
            v-if="goods.activityStatus && goods.activityStatus == 1"
            class="goods-activity-status"
            >即将开始</view
        >
    </view>
</template>

<style lang="scss" scoped>
.goods-item {
    position: relative;
    display: flex;
    width: 348rpx;
    padding-bottom: 20rpx;
    border-radius: 12rpx;
    background-color: #fff;
    flex-direction: column;
    gap: 20rpx;
    .goods-activity-status {
        position: absolute;
        top: 0;
        left: 0;
        padding: 10rpx 20rpx;
        border-radius: 12rpx 0rpx 12rpx 0rpx;
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 500;
        background: rgba(0, 0, 0, 0.5);
        line-height: 24rpx;
    }

    .goods-cover {
        width: 348rpx;
        height: 348rpx;
        border-radius: 12rpx 12rpx 0rpx 0rpx;
    }

    .goods-title-info {
        position: relative;
        display: flex;
        align-items: center;
        width: 308rpx;
        padding: 0 20rpx;
        .goods-tag {
            position: absolute;
            top: 6rpx;
            left: 20rpx;
            width: 76rpx;
            height: 28rpx;
        }
        .goods-title {
            width: 308rpx;
            margin-bottom: 20rpx;
            color: $uni-text-color;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 40rpx;
        }
    }

    .goods-price {
        display: flex;
        align-items: flex-end;
        gap: 8rpx;
        padding: 0 20rpx;

        .label {
            color: $zd-color-red;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;
        }

        .origin-price {
            margin-left: 4rpx;
            text-decoration: line-through;
            color: #999999;
            font-size: 24rpx;
            line-height: 24rpx;
        }
    }
}

.badge-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 156rpx;
    height: 36rpx;
    flex-direction: row;
    .badge-text {
        z-index: 100;
        max-width: 148rpx;
        margin-top: -4rpx;
        padding-left: 8rpx;
        color: #a03c01;
        font-size: 20rpx;
        font-weight: bold;
        line-height: 28rpx;
    }
}
</style>
