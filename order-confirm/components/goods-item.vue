<script setup lang="ts">
import type { OrderItem, Spec } from '../../api/order-confirm/types/index';
import titleWithTag from '../../components/goods-detail/title-with-tag.vue';

const props = defineProps<{
    goods: OrderItem;
    buyType?: number;
}>();
const { goods } = toRefs(props);
const count = computed({
    get: () => {
        return props.goods.num;
    },
    set: (val: number) => {
        emit('changeCount', val);
    }
});
const emit = defineEmits(['changeCount']);
const filterSpec = (specs: Spec[]) => {
    const specList: string[] = specs.reduce((result: string[], item: Spec) => {
        result.push(item.value);
        return result;
    }, []);

    return specList.join(';');
};
const fnChangeNumber = (number: number) => {
    // goods.value.num = number;
    emit('changeCount', number);
};
const showOverTip = () => {
    uni.showToast({
        title: '超出限制',
        icon: 'none'
    });
};
</script>
<template>
    <view class="goods-item-wrap">
        <image
            class="goods-item-cover"
            :src="goods.goodsInfo.thumbPic"
            mode="aspectFill"
        />
        <view class="goods-item-main">
            <titleWithTag
                :from-type="buyType"
                :title="goods.goodsInfo.title"
            />
            <view class="goods-item-main-center">
                <view class="goods-item-spec ellipsis">{{
                    filterSpec(goods.goodsProductInfo.goodsSpecs)
                }}</view>
            </view>
            <view class="goods-item-main-bottom">
                <zd-price
                    :value="goods.price"
                    color="#FF4734"
                    :font-size-large="40"
                    :font-size-small="28"
                    :font-size-unit="20"
                />
                <zd-number-box
                    v-model="goods.num"
                    :min="1"
                    :max="goods.goodsProductInfo.stock"
                    @over="showOverTip"
                    @change="fnChangeNumber"
                />
            </view>
        </view>
    </view>
</template>
<style lang="scss" scoped>
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
        height: 180rpx;
        flex: 1;
        flex-direction: column;
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
            align-items: center;
            width: 100%;
            flex-direction: row;
        }
    }
    &-spec {
        margin-top: 20rpx;
        color: $uni-text-color-grey;
        font-size: 24rpx;
        line-height: 24rpx;
    }
}
</style>
