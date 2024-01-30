<script setup lang="ts">
import titleWithTag from '../../components/goods-detail/title-with-tag.vue';
import type { GoodsSpec, OrderItem } from '../types';

const props = defineProps<{
    goods: OrderItem;
    fromType: number;
}>();
const filterSpec = (specs: GoodsSpec[]) => {
    let list = specs.reduce((result: string[], item: GoodsSpec) => {
        result.push(item.name + ':' + item.value);
        return result;
    }, []);
    return list.join(';');
};
</script>
<template>
    <view class="goods-info">
        <image
            class="goods-info-image"
            :src="goods.goodsInfo.thumbPic"
            mode="aspectFill"
        />
        <view class="goods-info-main">
            <view class="goods-info-main-top">
                <titleWithTag
                    :goods="goods.goodsInfo"
                    :from-type="fromType"
                    :title="goods.goodsInfo.title"
                />
                <view class="goods-info-spec ellipsis">
                    {{ filterSpec(goods.goodsProductInfo.goodsSpecs) }}
                </view>
            </view>
            <view class="goods-info-bottom">
                <zd-price
                    :value="goods.price"
                    color="rgba(41, 47, 51, 1)"
                    :font-size-large="32"
                    :font-size-small="32"
                    :font-size-unit="24"
                />
                <view class="goods-info-bottom-number">x{{ goods.num }}</view>
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.goods-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 20rpx 0;
    flex-direction: row;
}
.goods-info-image {
    width: 180rpx;
    height: 180rpx;
    margin-right: 20rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
}
.goods-info-main {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    width: 462rpx;
    height: 180rpx;
    flex-direction: column;
    &-top {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        overflow: hidden visible;
        width: 100%;
        flex: 1;
        flex-direction: column;
    }
}
.goods-info-spec {
    width: 100%;
    margin-top: 16rpx;
    color: $uni-text-color-grey;
    font-size: 24rpx;
    line-height: 32rpx;
    box-sizing: border-box;
}
.goods-info-bottom {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    flex-direction: row;
    &-number {
        margin-left: 4rpx;
        margin-left: 8rpx;
        color: $uni-text-color-grey;
        font-size: 24rpx;
        line-height: 24rpx;
    }
}
</style>
