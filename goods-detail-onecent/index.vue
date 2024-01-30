<script setup lang="ts">
import type { GoodsInfo } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';
import { router } from '@zsdx/mp-utils';

import { updateShopCart } from '@/api/shop-cart/index';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import definePageProps from '@/utils/definePageProps';

import { collect, getCouponList } from '../api/goods-detail/index';
import type { Coupon, CoverItem } from '../api/goods-detail/types';
import { fetchLimit, fetchPennyGoodsDetail } from '../api/goods-detail-onecent';
import type { GoodsDetail } from '../api/goods-detail-onecent/types';
import atmosphereBar from '../components/goods-detail/atmosphere-bar-onecent.vue';
import buyInfo from '../components/goods-detail/buy-info.vue';
import chooseCoupon from '../components/goods-detail/choose-coupon.vue';
import coverSwiper from '../components/goods-detail/cover-swiper.vue';
import pageFooter from '../components/goods-detail/footer.vue';
import mainInfo from '../components/goods-detail/main-info.vue';
import richContent from '../components/goods-detail/rich-content.vue';
import serviceBar from '../components/goods-detail/service-bar.vue';
import { getGoodsInfo, getGoodsMainCover, getShareTitle } from '../components/goods-detail/util';

// 导航栏
const headerTextColor = computed(() => {
    return showHeader.value ? '$uni-text-color' : 'rgba(0,0,0,0)';
});
const navBar = ref();
const showHeader = ref(false);
const headerOpacity = ref(0);
const pageStack = getCurrentPages();
const userStore = useUserStore();
const skuPop = ref();
const couponRef = ref();
const couponList = ref<Coupon[]>([]);
const skuPopType = ref(1);
// coverSwiper
const goodsNo = ref<string>('');
const activityNo = ref<string>('');
const studentShopId = ref<string>('');
const orderStore = useOrderStore();
const zsdxPwd = ref('');
const isActive = computed(() => {
    return goodsDetail.value?.activityInfo && goodsDetail.value?.activityInfo?.activityPrice;
});
const isInit = ref(false);
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
    goodsDetail.value = await fetchPennyGoodsDetail({
        goodsNo: goodsNo.value,
        studentShopId: studentShopId.value,
        activityNo: activityNo.value
    });
    goodsInfo.value = getGoodsInfo(goodsDetail.value);
    isInit.value = true;
};
const fnGetCouponList = async () => {
    let data = await getCouponList({
        studentShopId: studentShopId.value,
        goodsNo: goodsNo.value,
        onlyHireCoupon: 0
    });

    couponList.value = data.list;
};
const openSkuPop = async (type: number) => {
    if ((options.value?.type ?? 0) * 1 === 20) {
        const resp = await fetchLimit({
            activityNo: options.value?.activityNo ?? '',
            goodsNo: options.value?.actGoodsNo ?? '',
            studentShopId: studentShopId.value
        });
        if (!resp.canBuy) {
            return uni.showToast({
                title: resp.desc,
                icon: 'none'
            });
        }
    }
    skuPopType.value = type;
    skuPop.value.open();
};
const openCouponPop = () => {
    couponRef.value.open();
};
const fnCollect = async (status: number) => {
    try {
        await collect({
            goodsNo: goodsNo.value,
            studentShopId: studentShopId.value,
            type: 1,
            collectStatus: status
        });
        goodsDetail.value && (goodsDetail.value.collectStatus = status);
    } catch (e) {
        console.log(e);
    }
};

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
    // [{ act_goods_no: 商品活动编号, product_no: '', num: 0, student_shop_id: 0 }];
    orderStore.setSelectedProducts([
        {
            actGoodsNo: options.value?.actGoodsNo,
            productNo: sku.productNo,
            num: sku.count,
            studentShopId: studentShopId.value
        }
    ]);

    router.push('orderConfirm', {
        buyType: options.value?.type,
        activityNo: options.value?.activityNo
    });
};

const goKf = () => {
    router.push('chatRoom', {
        goodsNo: goodsNo.value,
        shopNo: goodsDetail.value?.shopInfo.shopNo
    });
};
const initShare = () => {
    const query = `goodsNo=${goodsNo.value}&studentShopId=${studentShopId.value}&zsdxPwd=${zsdxPwd.value}`;

    return {
        path: `/pages/shop/goods-detail/index?${query}`,
        query,
        imageUrl: getGoodsMainCover(goodsDetail.value),
        title: getShareTitle(goodsDetail.value, 1)
    };
};
onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 80;
    headerOpacity.value = e.scrollTop > 80 ? 1 : e.scrollTop / 80;
});

const options = definePageProps<{
    studentShopId: string;
    activityNo: string;
    goodsNo: string;
    type: number;
    actGoodsNo: string;
}>(async options => {
    try {
        goodsNo.value = options.goodsNo || '';
        studentShopId.value = await userStore.updateStudentShopId();
        activityNo.value = options.activityNo || '';

        zsdxPwd.value = await userStore.getShareZsdxPwd();
        fnGetData();
    } catch (e) {
        console.log(e);
    }
});

onShareAppMessage(initShare);
onShareTimeline(initShare);
onShow(() => {
    if (isInit.value) {
        fnGetData();
    }
    fnGetCouponList();
});
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
            v-if="isActive"
            :goods-detail="goodsDetail"
            @timeup="fnGetData"
        />
        <mainInfo
            :goods-detail="goodsDetail"
            :show-price="false"
        />
        <serviceBar
            :service-list="goodsDetail.goodsTagList"
            :goods-no="goodsNo"
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
        <pageFooter
            class="page-footer"
            :goods-detail="goodsDetail"
            :show-collect="false"
            :show-kf="false"
            :show-shopping-cart="false"
            :show-shopping-cart-btn="false"
            @show-spec-pop="openSkuPop"
            @collect="fnCollect"
            @go-kf="goKf"
        />
        <zd-sku-pop
            v-if="goodsInfo"
            ref="skuPop"
            :info="goodsInfo!"
            :product-list="goodsDetail.activityInfo?.productList ?? goodsDetail.productList"
            :spec-list="goodsDetail.specList"
            :show-number="(options?.type ?? 0) * 1 !== 20"
            @submit="fnChangeSku"
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
</style>
