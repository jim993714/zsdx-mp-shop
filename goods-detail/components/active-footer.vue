<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { useUserStore } from '@/stores/user';

import type { GoodsDetail, SkuPopType } from '../../api/goods-detail/types';
import pageFooter from '../../components/goods-detail/footer.vue';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
    studentShopId?: string;
}>();
const emit = defineEmits(['showSpecPop', 'collect']);
const userStore = useUserStore();
const { isLogin } = toRefs(userStore);

/**
 * 当前购买数量对应的返现值
 */
const currCashbackMoney = computed(() => {
    let result = props.goodsDetail?.activityInfo?.levelList?.reduce((result, item) => {
        if (
            props.goodsDetail?.activityInfo?.saleNum &&
            item.num <= props.goodsDetail?.activityInfo?.saleNum
        ) {
            return item.money || 0;
        }
        return result;
    }, 0);
    return result;
});
const openSkuPop = (type: SkuPopType) => {
    if (!isLogin.value) {
        router.push('login');
        return;
    }
    emit('showSpecPop', type);
};
const fnCollect = (status: number) => {
    emit('collect', status);
};
</script>
<template>
    <zd-price
        :value="goodsDetail?.goodsPricePay || 0"
        :font-size-large="32"
        :font-size-small="32"
        :font-size-unit="24"
        color="#fff"
    ></zd-price>
    <pageFooter
        v-if="goodsDetail"
        class="page-footer"
        :show-kf="false"
        :goods-detail="goodsDetail"
        @show-spec-pop="openSkuPop"
        @collect="fnCollect"
    >
        <template #footer>
            <view class="footer-btns">
                <view
                    class="btn plain half"
                    @tap="openSkuPop(2)"
                >
                    <view class="btn-inner">
                        <view class="btn-inner-primary">加入购物车</view>
                    </view>
                </view>
                <view
                    class="btn red half"
                    @tap="openSkuPop(1)"
                >
                    <view class="btn-inner">
                        <view
                            class="btn-inner-bottom"
                            :class="{
                                'btn-inner-primary': !currCashbackMoney || currCashbackMoney <= 0
                            }"
                            >立即购买</view
                        >
                        <view
                            v-if="currCashbackMoney && currCashbackMoney > 0"
                            class="btn-inner-little"
                            >返{{ currCashbackMoney }}元</view
                        >
                    </view>
                </view>
            </view>
        </template>
    </pageFooter>
</template>
<style lang="scss" scoped>
.footer-btns {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
}
.btn {
    width: max-content;
    height: 68rpx;
    margin: 0;
    padding: 0 58rpx;
    border-radius: 34rpx;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    background-color: $zd-main-color;
    line-height: 68rpx;
    &.red {
        background-color: $zd-color-red;
    }
    &.plain {
        color: $zd-main-color;
        background-color: $zd-main-color1;
        &.red {
            color: $zd-color-red;
            background-color: rgba(255, 71, 52, 0.5);
        }
    }
    &.half {
        width: 212rpx;
        padding: 0;
        text-align: center;
        &:nth-child(2n) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        &:nth-child(2n + 1) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }
}
.btn-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    line-height: 1;
    &-bottom {
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 600;
        line-height: 24rpx;
    }
    &-primary {
        font-size: 28rpx;
        font-weight: 600;
        line-height: 28rpx;
    }
    &-little {
        margin-top: 4rpx;
        color: #ffffff;
        font-size: 20rpx;
        font-weight: 400;
        line-height: 20rpx;
    }
}
</style>
