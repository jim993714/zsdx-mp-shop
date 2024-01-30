<script setup lang="ts">
import type { GoodsInfo } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';
import { router } from '@zsdx/mp-utils';

import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';

import { getFlashGoodsDetail, setSaleAlert } from '../api/goods-detail/index';
import type { Coupon, CoverItem, GoodsDetail } from '../api/goods-detail/types';
import buyInfo from '../components/goods-detail/buy-info.vue';
import chooseCoupon from '../components/goods-detail/choose-coupon.vue';
import coverSwiper from '../components/goods-detail/cover-swiper.vue';
import pageFooter from '../components/goods-detail/footer.vue';
import mainInfo from '../components/goods-detail/main-info.vue';
import richContent from '../components/goods-detail/rich-content.vue';
import serviceBar from '../components/goods-detail/service-bar.vue';
import { getGoodsInfo, getGoodsMainCover, getShareTitle } from '../components/goods-detail/util';
import atmosphereBar from './components/atmosphere-bar.vue';

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
// coverSwiper
const goodsNo = ref<string>('');
const saleNo = ref<string>('');
const customPageNo = ref<string>('');
const zsdxPwd = ref('');

const userStore = useUserStore();
const { isLogin } = toRefs(userStore);

const studentShopId = ref<string>('');
const orderStore = useOrderStore();
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
    goodsDetail.value = await getFlashGoodsDetail({
        saleNo: saleNo.value,
        studentShopId: studentShopId.value
    });
    goodsInfo.value = getGoodsInfo(goodsDetail.value);
};

const openSkuPop = (type: number) => {
    skuPopType.value = type;
    skuPop.value.open();
};
const openCouponPop = () => {
    couponRef.value.open();
};
/**
 * 购买
 */
const fnDoBuy = (sku: any) => {
    if (checkLogin()) {
        orderStore.setSelectedProducts([
            {
                saleNo: saleNo.value,
                goodsNo: goodsNo.value,
                productNo: sku.productNo,
                num: sku.count,
                studentShopId: studentShopId.value
            }
        ]);
        router.push('orderConfirm', {
            buyType: 2,
            customPageNo: customPageNo.value
        });
    }
};
const goKf = () => {
    if (checkLogin()) {
        router.push('chatRoom', {
            saleNo: saleNo.value,
            shopNo: goodsDetail.value?.shopInfo.shopNo
        });
    }
};
const fnOrder = async (status: number) => {
    if (checkLogin()) {
        await setSaleAlert({
            saleNo: saleNo.value,
            status: status
        });
        if (goodsDetail.value?.alertStatus === 0 || goodsDetail.value?.alertStatus === 1) {
            goodsDetail.value.alertStatus = status;
            uni.showToast({
                title: status == 1 ? '预约成功' : '取消预约成功',
                icon: 'none'
            });
        }
    }
};
const checkLogin = () => {
    if (!isLogin.value) {
        router.push('login');
    }
    return isLogin.value;
};
const initShare = () => {
    const query = `saleNo=${saleNo.value}&studentShopId=${studentShopId.value}&zsdxPwd=${zsdxPwd.value}`;

    return {
        path: `/pages/shop/goods-detail-flash/index?${query}`,
        query,
        imageUrl: getGoodsMainCover(goodsDetail.value),
        title: getShareTitle(goodsDetail.value, 1)
    };
};

onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 80;
    headerOpacity.value = e.scrollTop > 80 ? 1 : e.scrollTop / 80;
});

onLoad(async (options: any) => {
    studentShopId.value = options.studentShopId || uni.getStorageSync('studentShopId');
    saleNo.value = options.saleNo || '';
    customPageNo.value = options.customPageNo || '';
    fnGetData();
    zsdxPwd.value = await userStore.getShareZsdxPwd();
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
        <atmosphereBar
            :goods-detail="goodsDetail"
            @timeup="fnGetData"
        />
        <mainInfo
            :show-price="false"
            :goods-detail="goodsDetail"
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
            @open-sku-pop="openSkuPop"
            @open-coupon-pop="openCouponPop"
        />
        <richContent
            :content="goodsDetail.goodsContent"
            :goods-detail="goodsDetail"
        />
        <pageFooter
            class="page-footer"
            :goods-detail="goodsDetail"
            :show-collect="false"
            @go-kf="goKf"
        >
            <template #footer>
                <view
                    v-if="goodsDetail.status === 3"
                    class="btn red disabled"
                    >你来晚啦</view
                >
                <view
                    v-else-if="goodsDetail.status === 2 && goodsDetail.goodsStatus === -2"
                    class="btn red disabled"
                    >被抢光了</view
                >
                <!-- <view
                    v-else-if="
                        goodsDetail?.goodsNum &&
                        goodsDetail?.goodsSale &&
                        goodsDetail.goodsNum <= goodsDetail.goodsSale
                    "
                    class="btn red disabled"
                    >被抢光了</view
                > -->
                <view
                    v-else-if="goodsDetail.status === 2"
                    class="btn red"
                    @tap="openSkuPop(1)"
                    >立即购买</view
                >
                <view
                    v-else-if="goodsDetail.alertStatus === 0"
                    class="btn blue"
                    @tap="fnOrder(1)"
                    >预约提醒</view
                >
                <view
                    v-else-if="goodsDetail.alertStatus === 1"
                    class="btn blue plain"
                    @tap="fnOrder(0)"
                    >已预约</view
                >
            </template>
        </pageFooter>
        <zd-sku-pop
            v-if="goodsInfo"
            ref="skuPop"
            :info="goodsInfo"
            :product-list="goodsDetail.productList"
            :spec-list="goodsDetail.specList"
            @submit="fnDoBuy"
        ></zd-sku-pop>
    </template>
    <chooseCoupon
        ref="couponRef"
        :student-shop-id="studentShopId"
        :list="couponList"
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
    &.blue {
        background-color: rgba(25, 159, 255, 1);
    }
    &.red {
        background-color: $zd-color-red;
    }
    &.plain {
        color: rgba(25, 159, 255, 1);
        background-color: rgba(25, 159, 255, 1);
        &.blue {
            color: #fff;
            background-color: rgba(25, 159, 255, 0.2);
        }
        &.red {
            color: $zd-color-red;
            background-color: rgba(255, 232, 230, 1);
        }
    }
    &.disabled {
        opacity: 0.7;
    }
}
</style>
