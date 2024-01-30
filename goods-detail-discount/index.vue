<script setup lang="ts">
import type { GoodsInfo } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';
import { router } from '@zsdx/mp-utils';

import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import { UserVerify } from '@/stores/user/types';

import { updateShopCart } from '../api/common/index';
import { getCouponList, getSummerDiscountGoodsDetail } from '../api/goods-detail/index';
import type { Coupon, CoverItem, GoodsDetail } from '../api/goods-detail/types';
import atmosphereBarDiscount from '../components/goods-detail/atmosphere-bar-discount.vue';
import buyInfo from '../components/goods-detail/buy-info.vue';
import chooseCoupon from '../components/goods-detail/choose-coupon.vue';
import coverSwiper from '../components/goods-detail/cover-swiper.vue';
import pageFooter from '../components/goods-detail/footer.vue';
import mainInfo from '../components/goods-detail/main-info.vue';
import richContent from '../components/goods-detail/rich-content.vue';
import serviceBar from '../components/goods-detail/service-bar.vue';
import {
    getDiscountGoodsInfo,
    getGoodsMainCover,
    getShareTitle
} from '../components/goods-detail/util';
import studentAuthPop from '../components/student-auth-pop/index.vue';
import buyTipBar from './components/buy-tip-bar.vue';

// 导航栏
const headerTextColor = computed(() => {
    return showHeader.value ? '$uni-text-color' : 'rgba(0,0,0,0)';
});
const navBar = ref();
const showHeader = ref(false);
const headerOpacity = ref(0);
const pageStack = getCurrentPages();
const skuPop = ref();
const couponRef = ref();
const couponList = ref<Coupon[]>([]);
const skuPopType = ref(1);
const authPopupRef = ref();
// coverSwiper
const userStore = useUserStore();
const { isLogin } = toRefs(userStore);
const activityNo = ref<string>('');
const goodsNo = ref<string>('');
const timeId = ref<string>('');
const date = ref<string>('');
const studentShopId = ref<string>('');
const trackSearchSession = ref(''); //搜索跟单专用
const orderStore = useOrderStore();
const zsdxPwd = ref('');
const coverList = computed(() => {
    if (!goodsDetail.value) {
        return [];
    }
    let list: CoverItem[] = goodsDetail.value.goodsImageList.reduce(
        (result: CoverItem[], item: string) => {
            result.push({
                type: 1,
                cover: item
            });
            return result;
        },
        []
    );

    if (goodsDetail.value.coverVideo && goodsDetail.value.coverVideo.videoUrl) {
        list.unshift({
            type: 2,
            cover: goodsDetail.value.coverVideo.videoCover,
            videoUrl: goodsDetail.value.coverVideo.videoUrl
        });
    }
    return list;
});

const goodsDetail = ref<GoodsDetail>();
const goodsInfo = ref<GoodsInfo>();
const fnBack = () => {
    if (pageStack.length == 1) {
        uni.$emit('goIndex');
    } else {
        uni.navigateBack();
    }
};
const fnGetData = async () => {
    goodsDetail.value = await getSummerDiscountGoodsDetail({
        goodsNo: goodsNo.value,
        activityNo: activityNo.value,
        zsdxPwd: '',
        timeId: timeId.value,
        date: date.value,
        studentShopId: studentShopId.value
    });

    goodsInfo.value = getDiscountGoodsInfo(goodsDetail.value);
    if (
        goodsDetail.value.isSummerActivityWeek === 0 ||
        goodsDetail.value.activityInfo?.activityStatus === -2
    ) {
        uni.showToast({
            title: '活动已结束',
            icon: 'none'
        });
    }
};
const fnGetCouponList = async () => {
    let data = await getCouponList({
        studentShopId: studentShopId.value,
        goodsNo: goodsNo.value,
        onlyHireCoupon: 1
    });

    couponList.value = data.list;
};
const openSkuPop = (type: number) => {
    if (
        goodsDetail.value?.isSummerActivityWeek === 0 ||
        goodsDetail.value?.activityInfo?.activityStatus === -2
    ) {
        uni.showToast({
            title: '活动已结束',
            icon: 'none'
        });
        return;
    }
    skuPopType.value = type;
    skuPop.value.open();
};
const openCouponPop = () => {
    couponRef.value.open();
};

const btnDisabled = computed(() => {
    if (
        (goodsDetail.value &&
            goodsDetail.value.buyLimitCount >= 0 &&
            goodsDetail.value.buyCount > goodsDetail.value.buyLimitCount) ||
        goodsDetail.value?.limitOrder === 1
    ) {
        return true;
    }
    return false;
});

const fnChangeSku = async (sku: any) => {
    skuPopType.value;
    if (skuPopType.value == 1) {
        fnDoBuy(sku);
    } else {
        await updateShopCart({
            oldProductNo: '',
            studentShopId: studentShopId.value,
            productNo: sku.productNo,
            buyNum: sku.count
        });
        uni.showToast({
            title: '商品加入购物车啦',
            icon: 'none'
        });
    }
};
/**
 * 购买
 */
const fnDoBuy = async (sku: any) => {
    if (goodsDetail.value?.activityInfo?.activityStatus === 2) {
        orderStore.setSelectedProducts([
            {
                actGoodsNo: goodsDetail.value?.actGoodsNo,
                productNo: sku.productNo,
                num: sku.count,
                studentShopId: studentShopId.value,
                timeId: goodsDetail.value?.timeId
            }
        ]);
        router.push('orderConfirm', {
            buyType: 21,
            __trackSearchSession: trackSearchSession.value
        });
    } else {
        if (sku.goodsShowPriceType === 2 && sku.buyType !== 1) {
            let authRes: boolean = await authPopupRef.value.validate();
            if (authRes) {
                fnGoBuy(sku);
            }
        } else {
            fnGoBuy(sku);
        }
    }
};
const fnGoBuy = (sku: any) => {
    orderStore.setSelectedProducts([
        {
            goodsNo: goodsNo.value,
            productNo: sku.productNo,
            num: sku.count,
            studentShopId: studentShopId.value,
            usePayType: sku.buyType
        }
    ]);
    router.push('orderConfirm', {
        buyType: 1
    });
};
const initShare = () => {
    const query = `goodsNo=${goodsNo.value}&activityNo=${activityNo.value}&studentShopId=${studentShopId.value}&zsdxPwd=${zsdxPwd.value}&timeId=${timeId.value}&date=${date.value}`;

    return {
        path: `/pages/shop/goods-detail-discount/index?${query}`,
        imageUrl: getGoodsMainCover(goodsDetail.value),
        query,
        title: getShareTitle(goodsDetail.value, 1)
    };
};
onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 80;
    headerOpacity.value = e.scrollTop > 80 ? 1 : e.scrollTop / 80;
});

onLoad(async (options: any) => {
    studentShopId.value = options.studentShopId || uni.getStorageSync('studentShopId');
    activityNo.value = options.activityNo || '';
    goodsNo.value = options.goodsNo || '';
    timeId.value = options.timeId || '';
    date.value = options.date || '';
    trackSearchSession.value = options.trackSearchSession || '';
    fnGetCouponList();
    fnGetData();
});
onShareAppMessage(initShare);
onShareTimeline(initShare);
</script>
<template>
    <zd-navbar
        ref="navBar"
        title="商品详情"
        :background="`rgba(255,255,255, ${headerOpacity})`"
        :color="headerTextColor"
        class="header"
    >
        <template #prefix>
            <view
                class="back-btn"
                :class="{
                    'back-btn-transparent': headerOpacity === 1
                }"
                @tap="fnBack"
            >
                <zd-icon
                    v-if="pageStack.length !== 1"
                    type="zdmp-fanhui"
                    :color="headerOpacity === 1 ? '#292F33' : '#fff'"
                    :size="40"
                ></zd-icon>
                <zd-icon
                    v-else
                    type="zdmp-huidaoshouye"
                    :color="headerOpacity === 1 ? '#292F33' : '#fff'"
                    :size="40"
                ></zd-icon>
            </view>
        </template>
    </zd-navbar>
    <template v-if="goodsDetail">
        <coverSwiper :list="coverList" />
        <atmosphereBarDiscount
            :goods-detail="goodsDetail"
            @timeup="fnGetData()"
        />
        <mainInfo
            :goods-detail="goodsDetail"
            :show-price="false"
            :student-shop-id="studentShopId"
        />
        <serviceBar
            :service-list="goodsDetail.goodsTagList"
            :goods-no="goodsNo"
            :show-special="true"
            :goods-detail="goodsDetail"
        />
        <buyInfo
            :selected-product="''"
            :goods-detail="goodsDetail"
            :coupon-list="couponList"
            @open-sku-pop="openSkuPop(1)"
            @open-coupon-pop="openCouponPop"
        />
        <richContent
            :content="goodsDetail.goodsContent"
            :goods-detail="goodsDetail"
        />
        <buyTipBar :goods-detail="goodsDetail" />
        <pageFooter
            v-if="goodsDetail"
            class="page-footer"
            :goods-detail="goodsDetail"
            :show-kf="false"
            :show-collect="false"
        >
            <template #footer>
                <view class="footer-wrap">
                    <template v-if="goodsDetail.activityInfo?.activityStatus === -2">
                        <view class="btn red disabled">你来晚啦</view>
                    </template>
                    <template v-else-if="goodsDetail.goodsStatus === -1">
                        <view class="btn red disabled">已下架</view>
                    </template>
                    <template v-else-if="goodsDetail.goodsStatus === -2">
                        <view class="btn red disabled">库存不足</view>
                    </template>
                    <template v-else-if="goodsDetail.activityInfo?.activityStatus === 3">
                        <view class="btn gray disabled">你来晚啦</view>
                    </template>
                    <template v-else-if="goodsDetail.activityInfo?.activityStatus === 2">
                        <view
                            v-if="btnDisabled"
                            class="btn red disabled"
                            >已达到限购数量, 无法购买</view
                        >
                        <view
                            v-else
                            class="btn red"
                            @tap="openSkuPop(1)"
                            >立即购买</view
                        >
                    </template>
                    <template v-else>
                        <view
                            class="btn blue plain half"
                            @tap="openSkuPop(2)"
                            >加入购物车</view
                        >
                        <view
                            v-if="
                                goodsDetail.buyLimitCount > 0 &&
                                goodsDetail.buyLimitCount <= goodsDetail.buyCount
                            "
                            class="btn red half disabled"
                            >已达上限</view
                        >
                        <view
                            v-else
                            class="btn red half"
                            @tap="openSkuPop(1)"
                            >立即购买</view
                        >
                    </template>
                </view>
            </template>
        </pageFooter>
        <zd-sku-pop
            v-if="goodsInfo"
            ref="skuPop"
            :info="goodsInfo"
            :product-list="goodsDetail.productList"
            :spec-list="goodsDetail.specList"
            :sku-type="1"
            :user-verify="userStore?.userInfo?.userVerify === UserVerify.Pass ? 1 : 0"
            @submit="fnChangeSku"
        ></zd-sku-pop>
    </template>
    <chooseCoupon
        ref="couponRef"
        :student-shop-id="studentShopId"
        :list="couponList"
    />
    <studentAuthPop
        v-if="isLogin"
        ref="authPopupRef"
        content="未获取到你的学生认证记录，前往认证，认证成功后可享学生价~"
    />
</template>
<style>
page {
    background-color: #f5f8fa;
}
</style>
<style lang="scss" scoped>
.header {
    position: fixed;
    top: 0;
    z-index: 10;
}
.back-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60rpx;
    height: 60rpx;
    margin-left: 20rpx;
    border-radius: 60rpx;
    background-color: rgba(0, 0, 0, 0.5);
    flex-direction: row;
    &-transparent {
        background-color: rgba(0, 0, 0, 0);
    }
}
.footer-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
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
    &.gray {
        background-color: $uni-text-color-grey;
        opacity: 0.5;
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
</style>
