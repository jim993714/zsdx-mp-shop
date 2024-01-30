<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { GoodsSpecs, OrderDetailResp, OrderItem } from '../../api/order/types';
import { EnumOrderAfterType } from '../../api/order-after/types/constants';
import titleWithTag from '../../components/goods-detail/title-with-tag.vue';

const props = defineProps<{
    orderNo: string;
    orderDetail: OrderDetailResp | undefined;
}>();

const fnGoApply = (goods?: any, status?: number) => {
    console.log('====', goods);
    if (props.orderDetail?.canCancelApply === 2) {
        uni.showToast({
            title: '抱歉，您已经错过了申请售后的实效',
            icon: 'none'
        });
        return;
    }

    if (status) {
        if ([0, 1, 2].includes(props.orderDetail?.status ?? 0)) {
            router.push('orderAfter', {
                orderNo: props.orderNo,
                index: goods.index,
                type: EnumOrderAfterType.REFUND
            });
        } else {
            router.push('orderAfterSelectType', {
                orderNo: props.orderNo,
                index: goods.index
            });
        }
    } else {
        router.push('orderAfterDetail', {
            applyNo: goods.cancelApplyNo
        });
    }
};
const filterSpec = (specs?: GoodsSpecs[]): string => {
    if (specs) {
        return specs
            .reduce((result: string[], item: GoodsSpecs) => {
                result.push(item.name + ':' + item.value);
                return result;
            }, [])
            .join(';');
    }
    return '';
};
const fnGoGoodsDetail = (goods: OrderItem) => {
    switch (props.orderDetail?.orderCategory) {
        case 1: //秒杀专区
            router.push('goodsDetail', {
                goodsNo: goods.goodsInfo?.goodsNo
            });
            break;
        case 21: //暑假专区
            router.push('goodsDetail', {
                goodsNo: goods.goodsInfo?.goodsNo
            });
            break;
        default:
            router.push('goodsDetail', {
                goodsNo: goods.goodsInfo?.goodsNo
            });
            return;
    }
};
</script>
<template>
    <view class="container">
        <template
            v-for="(group, gIndex) in orderDetail?.buyStudentList"
            :key="gIndex"
        >
            <view class="shop-info">
                <zd-icon
                    type="zdmp-dianpu"
                    :size="32"
                />
                <view class="shop-info-title">{{
                    orderDetail?.studentShopName || orderDetail?.shopTitle
                }}</view>
            </view>
            <view
                v-for="(goods, goodsIndex) in group.orderItemList"
                :key="goodsIndex"
                class="goods-item-wrap"
                @tap="fnGoGoodsDetail(goods)"
            >
                <image
                    class="goods-item-cover"
                    :src="goods.goodsInfo?.thumbPic"
                    mode="aspectFill"
                />
                <view class="goods-item-main">
                    <titleWithTag
                        :from-type="orderDetail?.fromType"
                        :title="goods.goodsInfo?.title || ''"
                    />
                    <view class="goods-item-main-center">
                        <view class="goods-item-spec ellipsis">
                            {{ filterSpec(goods.goodsProductInfo?.goodsSpecs || []) }}
                        </view>
                    </view>
                    <view class="goods-item-main-bottom">
                        <zd-price
                            :value="goods.price ? +goods.price : 0"
                            color="rgba(41, 47, 51, 1)"
                            :font-size-large="32"
                            :font-size-small="32"
                            :font-size-unit="24"
                        />
                        <view class="goods-item-main-bottom-count">x{{ goods.num }}</view>
                        <!-- 非虚拟订单 -->
                        <template
                            v-if="
                                orderDetail?.orderCategory !== 10 &&
                                orderDetail?.orderCategory !== 12 &&
                                orderDetail?.orderCategory !== 14 &&
                                orderDetail?.orderCategory !== 16 &&
                                orderDetail?.fromType !== 29
                            "
                        >
                            <!-- (goods.canCancelApply == 1 || goods.canCancelApply == 2) -->
                            <view
                                v-if="
                                    ((orderDetail?.status === 1 &&
                                        (orderDetail?.tissueDumplingInfo?.tissueDumplingId ||
                                            orderDetail?.schoolDumplingInfo?.schoolDumplingId)) ||
                                        orderDetail?.status === 2 ||
                                        orderDetail?.status === 3 ||
                                        orderDetail?.status === 301 ||
                                        orderDetail?.status === 302 ||
                                        orderDetail?.status === 4) &&
                                    !orderDetail.awardNo &&
                                    goods.cancelStatus === 0 &&
                                    (goods.canCancelApply == 1 || goods.canCancelApply == 2)
                                "
                                class="goods-item-main-bottom-btn"
                                @tap.prevent.stop="fnGoApply(goods, 1)"
                            >
                                申请售后
                            </view>
                            <view
                                v-else-if="goods.cancelStatus === 1"
                                class="goods-item-main-bottom-btn"
                                @tap.prevent.stop="fnGoApply(goods)"
                            >
                                售后中
                            </view>
                            <view
                                v-else-if="goods.cancelStatus === 11"
                                class="goods-item-main-bottom-btn"
                                @tap.prevent.stop="fnGoApply(goods)"
                            >
                                售后中
                            </view>
                            <view
                                v-else-if="goods.cancelStatus === 2"
                                class="goods-item-main-bottom-btn"
                                @tap.prevent.stop="fnGoApply(goods)"
                            >
                                售后成功
                            </view>
                            <view
                                v-else-if="goods.cancelStatus === -1"
                                class="goods-item-main-bottom-btn"
                                @tap.prevent.stop="fnGoApply(goods)"
                            >
                                售后失败
                            </view>
                            <view
                                v-else-if="goods.cancelStatus === -2"
                                class="goods-item-main-bottom-btn"
                                @tap.prevent.stop="fnGoApply(goods)"
                            >
                                售后取消
                            </view>
                        </template>
                    </view>
                </view>
            </view>
            <view class="discount-list">
                <view class="discount-list-item">
                    <view class="discount-list-item-label">商品总价</view>
                    <view class="discount-list-item-value">
                        <zd-price
                            :value="orderDetail?.productMoney ? +orderDetail?.productMoney : 0"
                            :color="true ? 'rgba(41, 47, 51, 1)' : 'rgba(255, 71, 52, 1)'"
                            :font-size-large="28"
                            :font-size-small="28"
                            :font-size-unit="20"
                        />
                    </view>
                </view>
                <view class="discount-list-item">
                    <view class="discount-list-item-label">运费</view>
                    <view class="discount-list-item-value">
                        <zd-price
                            :value="orderDetail?.freight ? +orderDetail?.freight : 0"
                            :color="
                                orderDetail?.freight && +orderDetail?.freight <= 0
                                    ? 'rgba(41, 47, 51, 1)'
                                    : 'rgba(255, 71, 52, 1)'
                            "
                            :font-size-large="28"
                            :font-size-small="28"
                            :font-size-unit="20"
                        />
                    </view>
                </view>
                <view
                    v-for="(discount, dIndex) in orderDetail?.discountInfo"
                    :key="dIndex"
                    class="discount-list-item"
                >
                    <view class="discount-list-item-label">{{ discount.desc }}</view>
                    <view class="discount-list-item-value">
                        <view class="discount-list-item-minus">-</view>
                        <zd-price
                            :value="discount.discountMoney ? +discount.discountMoney : 0"
                            color="rgba(255, 71, 52, 1)"
                            :font-size-large="28"
                            :font-size-small="28"
                            :font-size-unit="20"
                        />
                    </view>
                </view>
                <view class="discount-list-item">
                    <view class="discount-list-item-label">实付款</view>
                    <view class="discount-list-item-value">
                        <zd-price
                            :value="orderDetail?.money ? +orderDetail?.money : 0"
                            color="rgba(255, 71, 52, 1)"
                            :font-size-large="32"
                            :font-size-small="32"
                            :font-size-unit="24"
                        />
                    </view>
                </view>
            </view>
        </template>
    </view>
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    width: 710rpx;
    margin: 20rpx 20rpx 0;
    padding: 30rpx 24rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
}

.shop-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    color: $uni-text-color;
    &-title {
        margin-left: 4rpx;
        color: #292f33;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 32rpx;
    }
}
.goods-item-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    flex-direction: row;
    padding: 20rpx 0;
}
.goods-item-cover {
    width: 180rpx;
    height: 180rpx;
    margin-right: 20rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
}
.goods-item {
    &-main {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        overflow: hidden;
        overflow: hidden;
        height: 180rpx;
        flex: 1;
        flex-direction: column;
        box-sizing: border-box;
        &-center {
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            width: 100%;
            flex: 1;
            flex-direction: column;
        }
        &-bottom {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            flex-direction: row;
            &-count {
                margin-left: 8rpx;
                color: #8a9399;
                font-size: 24rpx;
                font-weight: 400;
                line-height: 24rpx;
                flex: 1;
            }
            &-btn {
                padding: 0 20rpx;
                border: 2rpx solid $zd-main-color;
                border-radius: 26rpx;
                color: $zd-main-color;
                font-size: 24rpx;
                line-height: 40rpx;
                box-sizing: border-box;
            }
        }
    }
    &-spec {
        margin-top: 20rpx;
        color: $uni-text-color-grey;
        font-size: 24rpx;
        line-height: 26rpx;
    }
}

.discount-list {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    padding-top: 4rpx;
    border-top: 2rpx solid $uni-text-color-disable;
    flex-direction: column;
    &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        margin-top: 16rpx;
        &-label {
            color: $uni-text-color;
            font-size: 24rpx;
            line-height: 40rpx;
        }
        &-value {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            flex-direction: row;
            color: $uni-text-color;
            font-size: 20rpx;
            line-height: 20rpx;
        }
        &-minus {
            color: $zd-color-red;
            font-size: 20rpx;
            line-height: 20rpx;
        }
    }
}
</style>
