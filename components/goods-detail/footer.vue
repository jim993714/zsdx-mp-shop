<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

import type { GoodsDetail } from '../../api/goods-detail/types';

const userStore = useUserStore();
const appStore = useAppStore();
const { shopCartCount } = toRefs(appStore);
const { isLogin } = toRefs(userStore);

const props = withDefaults(
    defineProps<{
        goodsDetail: GoodsDetail;
        showCollect: boolean;
        showKf: boolean;
        showShoppingCart: boolean;
        showShoppingCartBtn: boolean;
    }>(),
    {
        showCollect: true,
        showKf: true,
        showShoppingCart: true,
        showShoppingCartBtn: true
    }
);
const emit = defineEmits(['showSpecPop', 'orderSuccess', 'collect', 'goKf', 'track']);
const checkLogin = () => {
    if (!isLogin.value) {
        router.push('login');
    }
    return isLogin.value;
};
const fnGoKf = () => {
    if (checkLogin()) {
        emit('goKf');
    }
};
const fnShowSpec = (type: number) => {
    if (checkLogin()) {
        emit('showSpecPop', type);
    }
};
const fnOrder = () => {
    if (checkLogin()) {
        emit('orderSuccess');
    }
};
const fnGoShoppingCart = () => {
    if (checkLogin()) {
        emit('track', '详情页访问购物车');
        router.switchTab('shopCart');
    }
};
const fnCollect = () => {
    if (checkLogin()) {
        emit('collect', ((props.goodsDetail.collectStatus || 0) + 1) % 2);
    }
};
const fnShowLimitToast = (title: string) => {
    uni.showToast({
        title: title,
        icon: 'none'
    });
};
onMounted(() => {
    useAppStore().updateShopCartCount();
});
</script>
<template>
    <view class="footer-seat savepadding"></view>
    <view class="footer savepadding">
        <view class="menus">
            <view
                v-if="showCollect"
                class="menu"
                @tap="fnCollect"
            >
                <view class="menu-icon">
                    <zd-icon
                        type="zdmp-shoucang"
                        :color="
                            goodsDetail.collectStatus === 1 ? '#199FFF' : 'rgba(87, 96, 102, 1)'
                        "
                        :size="48"
                    ></zd-icon>
                </view>
                <view
                    class="menu-title"
                    :class="{ 'menu-title-selected': goodsDetail.collectStatus === 1 }"
                    >收藏</view
                >
            </view>
            <view
                v-if="showKf"
                class="menu"
                @tap="fnGoKf"
            >
                <view class="menu-icon">
                    <zd-icon
                        type="zdmp-kefu"
                        color="rgba(87, 96, 102, 1)"
                        :size="48"
                    ></zd-icon>
                </view>
                <view class="menu-title">客服</view>
            </view>
            <uni-badge
                v-if="showShoppingCart"
                class="uni-badge-left-margin"
                :text="shopCartCount"
                absolute="rightTop"
                :offset="[14, 8]"
                :custom-style="{
                    color: 'rgba(25, 159, 255, 1)',
                    border: '1px solid rgba(25, 159, 255, 1)',
                    backgroundColor: '#fff'
                }"
                size="small"
            >
                <view
                    class="menu"
                    @tap="fnGoShoppingCart"
                >
                    <view class="menu-icon">
                        <zd-icon
                            type="zdmp-gouwuche"
                            color="rgba(87, 96, 102, 1)"
                            :size="48"
                        ></zd-icon>
                    </view>
                    <view class="menu-title">购物车</view>
                </view>
            </uni-badge>
        </view>
        <view class="operate">
            <!-- <view class="btn blue" @tap="fnShowSpec(1)">立即购买</view> -->
            <!-- <view class="btn red"  @tap="fnOrder()">预约</view> -->
            <view
                v-if="goodsDetail.goodsStatus === -1"
                class="btn red disabled"
                @tap="fnShowLimitToast('商品已失效')"
                >已失效</view
            >
            <view
                v-else-if="goodsDetail.goodsStatus === -2"
                class="btn red disabled"
                @tap="fnShowLimitToast('被抢光了')"
                >被抢光了</view
            >
            <slot
                v-else
                name="footer"
            >
                <view
                    v-if="props.showShoppingCartBtn"
                    class="btn blue plain half"
                    @tap="fnShowSpec(2)"
                    >加入购物车</view
                >
                <view
                    v-if="
                        goodsDetail.buyLimitCount > 0 &&
                        goodsDetail.buyLimitCount <= goodsDetail.buyCount
                    "
                    class="btn red half disabled"
                    @tap="fnShowLimitToast('购买数量已达上限')"
                    >已达上限</view
                >
                <view
                    v-else-if="goodsDetail.goodsShowPriceType === 2"
                    class="btn red"
                    :class="{
                        half: props.showShoppingCartBtn,
                        block: !props.showShoppingCartBtn
                    }"
                    @tap="fnShowSpec(1)"
                >
                    <view class="btn-inner">
                        <zd-price
                            :value="goodsDetail.goodsShowPrice || 0"
                            :font-size-large="40"
                            :font-size-small="28"
                            :font-size-unit="24"
                            color="#fff"
                        ></zd-price>
                        <view class="btn-inner-bottom">学生价购买</view>
                    </view>
                </view>
                <view
                    v-else
                    class="btn red"
                    :class="{
                        half: props.showShoppingCartBtn,
                        block: !props.showShoppingCartBtn
                    }"
                    @tap="fnShowSpec(1)"
                    >立即购买</view
                >
            </slot>
        </view>
    </view>
</template>
<style lang="scss" scoped>
.footer-seat {
    width: 0;
    height: 120rpx;
}
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 750rpx;
    height: 100rpx;
    background-color: #fff;
    flex-direction: row;
}
.menus {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10rpx;
    color: rgba(87, 96, 102, 1);
    flex-direction: row;
    flex-shrink: 0;
    .menu {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90rpx;
        flex-direction: column;
    }
    .menu-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
    .menu-title {
        color: #576066;
        font-size: 20rpx;
        line-height: 20rpx;
        &-selected {
            color: $zd-main-color;
        }
    }
}
.operate {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
    padding-right: 20rpx;
}
.btn {
    width: max-content;
    height: 68rpx;
    padding: 0 58rpx;
    border-radius: 34rpx;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    line-height: 68rpx;
    background-color: $zd-main-color;
    &.red {
        background-color: $zd-color-red;
    }
    &.plain {
        color: $zd-main-color;
        background-color: $zd-main-color1;
        &.red {
            color: $zd-color-red;
            background-color: rgba(255, 232, 230, 1);
        }
    }
    &.half {
        flex: 1;
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
    &.block {
        height: 76rpx;
        border-radius: 38rpx;
        text-align: center;
        font-size: 32rpx;
        flex: 1;
        line-height: 76rpx;
    }
    &.disabled {
        color: #fff;
        opacity: 0.5;
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
        margin-top: 4rpx;
        color: #ffffff;
        font-size: 20rpx;
        font-weight: 500;
        line-height: 24rpx;
    }
}
</style>
