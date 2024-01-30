<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';

import type { GoodsGroupStyle, GoodsItem, PageBaseConfig } from '../../types';
import { formatMoney } from '../../utils';

const localStorage = storage();

const props = defineProps<{
    data: GoodsItem[];
    navName?: string;
    styleConfig: GoodsGroupStyle;
    baseConfig: PageBaseConfig;
}>();
const trackData = {
    type: 'all',
    clientTop: uni.getWindowInfo().windowHeight / 2
};
const customPageNo = inject('customPageNo');
</script>

<template>
    <view
        class="goods-list"
        :style="{
            paddingLeft: props.styleConfig.pageMargin + 'rpx',
            paddingRight: props.styleConfig.pageMargin + 'rpx'
        }"
    >
        <view
            v-for="(item, index) in props.data"
            :key="item.goods_no"
        >
            <track-view
                :track-data="{
                    ...trackData,
                    observerName: '.goods' + index,
                    eventData: {
                        path: 'bi_feeds',
                        student_shop_id: localStorage.get('studentShopId'),
                        page_data_type: 'activity',
                        nav_name: navName || '',
                        data_type: 'Goods',
                        data_id: item.goods_no,
                        data_info: item,
                        page_data_info: props.baseConfig,
                        index
                    }
                }"
            >
                <view
                    class="goods-item"
                    :style="{
                        width:
                            (750 -
                                props.styleConfig.pageMargin * 2 -
                                props.styleConfig.goodsMargin * (props.styleConfig.columns - 1)) /
                                props.styleConfig.columns +
                            'rpx',
                        borderRadius: props.styleConfig.goodsBorderRadius,
                        marginBottom: props.styleConfig.goodsMargin + 'rpx'
                    }"
                    @tap="
                        router.push('goodsDetail', {
                            goodsNo: item.goods_no,
                            customPageNo: customPageNo
                        })
                    "
                >
                    <!-- 封面 -->
                    <view class="goods-cover">
                        <image
                            :src="item.goods_cover"
                            mode="aspectFill"
                            class="cover-image"
                            :style="{
                                borderRadius: props.styleConfig.goodsBorderRadius,
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0
                            }"
                        />
                    </view>

                    <!-- 标题 -->
                    <view class="goods-title-warp">
                        <image
                            v-if="item.goods_show_price_type == 2"
                            class="goods-tag"
                            src="https://cdn.zsdx.cn/mp-cs/images/home/student-price-red.png"
                            mode="widthFix"
                        />
                        <view
                            class="goods-title"
                            :style="{ textIndent: item.goods_show_price_type == 2 ? '2.7rem' : '' }"
                            >{{ item.goods_title }}</view
                        >
                    </view>

                    <!-- 价格 -->
                    <view class="price">
                        <text
                            v-if="item.goods_show_price_type == 1"
                            class="price-label"
                            >活动价
                        </text>
                        <text class="price-unit">￥</text>
                        <text class="price-value">{{ formatMoney(item.goods_show_price) }}</text>
                    </view>
                    <view
                        v-if="item.goods_show_price != item.goods_show_origin_price"
                        class="origin-price"
                    >
                        <text class="line">￥{{ formatMoney(item.goods_show_origin_price) }}</text>
                    </view>
                    <view
                        v-else
                        class="origin-price"
                    ></view>

                    <!-- 按钮 -->
                    <view
                        v-if="props.styleConfig.goodsButton.show == 1"
                        class="btn"
                        :style="{ backgroundColor: props.styleConfig.goodsButton.backgroundColor }"
                    >
                        {{ props.styleConfig.goodsButton.text }}
                    </view>

                    <!-- 标签 -->
                    <image
                        v-if="props.styleConfig.goodsTag.show"
                        :src="props.styleConfig.goodsTag.url"
                        mode="aspectFit"
                        :style="{
                            left: props.styleConfig.goodsTag.left - 4 + 'rpx',
                            top: props.styleConfig.goodsTag.top + 'rpx',
                            width: props.styleConfig.goodsTag.width + 'rpx',
                            height: props.styleConfig.goodsTag.height + 'rpx'
                        }"
                        class="tag"
                    />
                </view>
            </track-view>
        </view>

        <view
            v-for="i in 3"
            :key="'seat' + i"
            class="seat"
        />
    </view>
</template>

<style lang="scss" scoped>
.goods-list {
    display: flex;
    justify-content: space-between;
    width: 750rpx;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-top: 20rpx;

    .goods-item {
        position: relative;
        display: flex;
        background-color: #ffffff;
        flex-direction: column;
        box-sizing: border-box;

        .goods-cover {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 100%;

            .cover-image {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
        .goods-title-warp {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: row;
        }
        .goods-title {
            display: -webkit-box;
            overflow: hidden;
            width: 100%;
            height: 72rpx;
            min-height: 72rpx;
            margin: 8rpx 0;
            padding: 0 10rpx;
            text-overflow: ellipsis;
            color: $uni-text-color;
            font-size: 26rpx;
            line-height: 36rpx;
            box-sizing: border-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }

        .goods-tag {
            position: absolute;
            top: 12rpx;
            left: 10rpx;
            width: 76rpx;
            height: 28rpx;
        }
        .price {
            height: 32rpx;
            padding: 8rpx;
            color: $zd-color-red;
            font-weight: 400;

            &-label {
                font-size: 20rpx;
                line-height: 26rpx;
            }

            &-unit {
                font-size: 24rpx;
                line-height: 24rpx;
            }

            &-value {
                font-size: 32rpx;
                font-weight: 500;
                line-height: 32rpx;
            }
        }

        .origin-price {
            display: flex;
            align-items: center;
            height: 40rpx;
            margin: 0 8rpx 16rpx 0;
            padding: 0 8rpx;
            color: $uni-color-paragraph;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 20rpx;

            .line {
                text-decoration: line-through;
            }
        }

        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 56rpx;
            border-radius: 32rpx 32rpx 0px 0px;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 500;
        }

        .tag {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 60rpx;
            height: 60rpx;
        }
    }

    .seat {
        width: 226rpx;
        height: 0;
    }
}
</style>
