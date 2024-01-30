<script setup lang="ts">
import type { GoodsInfo } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';
import { clickTrack, router } from '@zsdx/mp-utils';

import { useAppStore } from '@/stores/app';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import { UserVerify } from '@/stores/user/types';

import { updateShopCart } from '../api/common/index';
import { collect, getCouponList, getGoodsDetail } from '../api/goods-detail/index';
import type { Coupon, CoverItem, GoodsDetail, SkuPopType } from '../api/goods-detail/types';
import atmosphereBar from '../components/goods-detail/atmosphere-bar.vue';
import atmosphereBarCashback from '../components/goods-detail/atmosphere-bar-cashback.vue';
import buyInfo from '../components/goods-detail/buy-info.vue';
import chooseCoupon from '../components/goods-detail/choose-coupon.vue';
import couponDisableTip from '../components/goods-detail/coupon-disable-tip.vue';
import coverSwiper from '../components/goods-detail/cover-swiper.vue';
import pageFooter from '../components/goods-detail/footer.vue';
import mainInfo from '../components/goods-detail/main-info.vue';
import richContent from '../components/goods-detail/rich-content.vue';
import serviceBar from '../components/goods-detail/service-bar.vue';
import {
    dealGroupGoodsDetail,
    getGoodsInfo,
    getGoodsMainCover,
    getGroupGoodsInfo,
    getShareTitle
} from '../components/goods-detail/util';
import studentAuthPop from '../components/student-auth-pop/index.vue';
import activeFooter from './components/active-footer.vue';
import groupFooter from './components/group-footer.vue';
import groupHead from './components/group-head.vue';
import studentPriceBar from './components/student-price-bar.vue';

// 导航栏
const headerTextColor = computed(() => {
    return showHeader.value ? '$uni-text-color' : 'rgba(0,0,0,0)';
});
const navBar = ref();
const showHeader = ref(false);
const headerOpacity = ref(0);
const pageStack = getCurrentPages();
const userStore = useUserStore();
const { isLogin } = toRefs(userStore);
const skuPop = ref();
const groupSkuPop = ref();
const couponRef = ref();
const couponList = ref<Coupon[]>([]);
const skuPopType = ref<SkuPopType>(1);
const studentAuth = ref();
// coverSwiper
const goodsNo = ref<string>('');
const customPageNo = ref<string>('');
const schoolDumplingId = ref<string>('');
const studentShopId = ref<string>('');
const orderStore = useOrderStore();
// skuPop类型, 0: 购买(支持学生价买), 1: 确认按钮
const skuType = ref<number>(1);
const zsdxPwd = ref('');
const authPopupRef = ref();
const trackSearchSession = ref(''); //搜索跟单专用
const isActive = computed(() => {
    return (
        !!goodsDetail.value?.activityInfo && goodsDetail.value?.activityInfo?.activityPrice !== null
    );
});
const isInit = ref(false);
const groupFooterRef = ref();

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
const groupGoodsInfo = ref<GoodsInfo>();
const fnBack = () => {
    if (pageStack.length == 1) {
        uni.$emit('goIndex');
    } else {
        router.back();
    }
};
const fnGetData = async () => {
    const goodsDetailResp = await getGoodsDetail({
        goodsNo: goodsNo.value,
        studentShopId: studentShopId.value,
        schoolDumplingId: schoolDumplingId.value
    });
    goodsDetail.value = dealGroupGoodsDetail(goodsDetailResp);
    groupGoodsInfo.value = getGroupGoodsInfo(goodsDetail.value);
    goodsInfo.value = getGoodsInfo(goodsDetail.value);
    isInit.value = true;
    nextTick(() => {
        if (groupFooterRef.value) {
            groupFooterRef.value.initData();
        }
    });
};
const fnGetCouponList = async () => {
    let data = await getCouponList({
        studentShopId: studentShopId.value,
        goodsNo: goodsNo.value,
        onlyHireCoupon: 0
    });

    couponList.value = data.list;
};

const openSkuPop = async (type: SkuPopType, stand: string) => {
    if ((type === 1 || type === 2) && !stand) {
        track(type === 2 ? '商品加购按钮' : '商品购买按钮');
    }
    if (stand) {
        track('选择商品规格按钮');
    }

    if (goodsDetail.value?.goodsStatus !== 1) {
        switch (goodsDetail.value?.goodsStatus) {
            case -1:
                uni.showToast({
                    title: '商品已失效',
                    icon: 'none'
                });
                break;
            case -2:
                uni.showToast({
                    title: '商品库存不足',
                    icon: 'none'
                });
                break;
            default:
                uni.showToast({
                    title: '商品已失效',
                    icon: 'none'
                });
                break;
        }
        return;
    }
    skuPopType.value = type;
    let result = false;
    switch (skuPopType.value) {
        case 3:
            // 如果开团需要学生认证, 先判断是否已经认证
            if (goodsDetail.value?.activityInfo?.leaderIdentity === 1) {
                result = await studentAuth.value.validate();
            } else {
                result = true;
            }

            if (result) {
                groupSkuPop.value.open();
            }
            track('商品确认购买按钮');
            break;
        case 4:
            groupSkuPop.value.open();
            track('商品确认购买按钮');
            break;
        case 2:
            skuPop.value.open();
            break;
        case 1:
            skuPop.value.open();
            track('商品确认购买按钮', {
                btn_type: userStore?.userInfo?.userVerify === UserVerify.Pass ? '已认证' : '未认证'
            });
            break;
        default:
            skuPop.value.open();

            break;
    }
};
const openCouponPop = () => {
    track('领取优惠券');
    couponRef.value.open();
};
const fnCollect = async (status: number) => {
    try {
        if (status === 1) {
            track('商品收藏按钮');
        }
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
    switch (skuPopType.value) {
        case 2:
            await updateShopCart({
                oldProductNo: '',
                studentShopId: studentShopId.value,
                productNo: sku.productNo,
                buyNum: sku.count
            });
            useAppStore().updateShopCartCount();
            uni.showToast({
                title: '商品加入购物车啦',
                icon: 'none'
            });
            track('商品确认加购按钮');
            break;
        case 3:
            fnDoBuyGroup(sku);
            break;
        case 4:
            fnDoBuyGroup(sku);
            break;
        default:
            track('商品确认购买按钮', {
                btn_type: userStore?.userInfo?.userVerify === UserVerify.Pass ? '已认证' : '未认证',
                btn_text:
                    sku.goodsShowPriceType === 2
                        ? sku.buyType !== 1
                            ? '学生价'
                            : '直接购买'
                        : '直接购买'
            });
            fnDoBuy(sku);
            break;
    }
};
/**
 * 购买
 */
const fnDoBuy = async (sku: any) => {
    console.log('doBuy', sku);
    // 判断是否学生价需要学生认证
    // 有学生价, 且用户没有学生认证, 开起弹窗
    if (sku.goodsShowPriceType === 2 && sku.buyType !== 1) {
        let authRes: boolean = await authPopupRef.value.validate();
        if (authRes) {
            fnGoBuy(sku);
        }
    } else {
        fnGoBuy(sku);
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
        customPageNo: customPageNo.value,
        __trackSearchSession: trackSearchSession.value
    });
};
/**
 * 参团
 */
const fnDoBuyGroup = (sku: any) => {
    orderStore.setSelectedProducts([
        {
            activityNo: goodsDetail.value?.activityInfo?.activityNo,
            schoolDumplingId: schoolDumplingId.value,
            goodsNo: goodsNo.value,
            productNo: sku.productNo,
            num: sku.count,
            studentShopId: studentShopId.value
        }
    ]);
    router.push('orderConfirm', {
        buyType: 18,
        __trackSearchSession: trackSearchSession.value
    });
};

const goKf = () => {
    router.push('chatRoom', {
        goodsNo: goodsNo.value,
        shopNo: goodsDetail.value?.shopInfo.shopNo
    });
};
const initShare = () => {
    let query = '';
    // 如果存在已成团信息, 则直接分享团购
    if (
        goodsDetail.value?.activityInfo?.schoolDumplingId &&
        goodsDetail.value?.activityType === 11
    ) {
        query = `activityNo=${goodsDetail.value?.activityInfo.activityNo}&studentShopId=${studentShopId.value}&schoolDumplingId=${goodsDetail.value?.activityInfo?.schoolDumplingId}&zsdxPwd=${zsdxPwd.value}`;

        return {
            path: `/pages/activity/campus-group/campus-group-detail/index?${query}`,
            query,
            imageUrl: getGoodsMainCover(goodsDetail.value),
            title: getShareTitle(goodsDetail.value, 0)
        };
    } else if (isActive.value && goodsDetail.value?.activityInfo?.subActivityType === 4) {
        query = `goodsNo=${goodsNo.value}&studentShopId=${studentShopId.value}&zsdxPwd=${zsdxPwd.value}`;

        return {
            path: `/pages/shop/goods-detail/index?${query}`,
            query,
            imageUrl: getGoodsMainCover(goodsDetail.value),
            title: getShareTitle(goodsDetail.value, 0)
        };
    } else {
        query = `goodsNo=${goodsNo.value}&studentShopId=${studentShopId.value}&zsdxPwd=${zsdxPwd.value}`;

        return {
            path: `/pages/shop/goods-detail/index?${query}`,
            query,
            imageUrl: getGoodsMainCover(goodsDetail.value),
            title: getShareTitle(goodsDetail.value, 0)
        };
    }
};

const track = (element_name: string, ext?: any) => {
    let extObj = ext || {};
    let data = {
        type: 'click',
        eventData: {
            action: element_name === '领取优惠券' ? 1 : 2,
            path: 'bi_event',
            element_name,
            student_shop_id: studentShopId.value,
            page_data_type: 'Goods',
            page_data_id: goodsDetail.value?.goodsNo,
            page_data_info: {
                id: goodsDetail.value?.goodsNo,
                title: goodsDetail.value?.goodsTitle,
                price: goodsDetail.value?.goodsShowOriginPrice,
                s_price: goodsDetail.value?.goodsShowPrice
            },
            ...extObj
        }
    };
    clickTrack(data);
};
onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 80;
    headerOpacity.value = e.scrollTop > 80 ? 1 : e.scrollTop / 80;
});
/**
 * 加入购物车
 */

onLoad(async (options: any) => {
    try {
        goodsNo.value = options.goodsNo || '';
        customPageNo.value = options.customPageNo || '';
        schoolDumplingId.value = options.schoolDumplingId || '';
        studentShopId.value = await userStore.updateStudentShopId();
        trackSearchSession.value = options.trackSearchSession || '';

        zsdxPwd.value = await userStore.getShareZsdxPwd();
        fnGetData();

        const optionLaunch = uni.getLaunchOptionsSync();

        console.log('======get option goodsDetail', optionLaunch);
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

        <!-- 校园团氛围条     -->
        <groupHead
            v-if="isActive && goodsDetail.activityType === 11"
            :goods-detail="goodsDetail"
            @fn-init="fnGetData"
        />
        <!-- 返现活动氛围条  -->
        <atmosphereBarCashback
            v-else-if="isActive && goodsDetail.activityInfo?.subActivityType === 4"
            :goods-detail="goodsDetail"
        />
        <!-- 大促等其他活动氛围条 -->
        <atmosphereBar
            v-else-if="isActive"
            :goods-detail="goodsDetail"
            @timeup="fnGetData"
        />
        <!-- 校园团氛围条 -->
        <studentPriceBar
            v-else-if="goodsDetail?.goodsShowPriceType === 2"
            :goods-detail="goodsDetail"
        />
        <mainInfo
            :goods-detail="goodsDetail"
            :show-price="!isActive && goodsDetail?.goodsShowPriceType == 3"
            :student-shop-id="studentShopId"
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
            @open-sku-pop="openSkuPop(goodsDetail?.activityInfo?.schoolDumplingId ? 4 : 1, 'stand')"
            @open-coupon-pop="openCouponPop"
        />
        <richContent
            :content="goodsDetail.goodsContent"
            :goods-detail="goodsDetail"
        />
        <couponDisableTip
            v-if="goodsDetail.isCanUse === false"
            content="该商品暂不支持用券"
            :bottom="104"
        />
        <activeFooter
            v-if="goodsDetail.activityInfo?.subActivityType === 4"
            class="page-footer"
            :goods-detail="goodsDetail"
            :student-shop-id="studentShopId"
            @show-spec-pop="openSkuPop"
            @collect="fnCollect"
            @go-kf="goKf"
        ></activeFooter>
        <!-- 团购购买操作 -->
        <groupFooter
            v-else-if="isActive && goodsDetail.activityType === 11"
            ref="groupFooterRef"
            class="page-footer"
            :goods-detail="goodsDetail"
            :student-shop-id="studentShopId"
            @show-spec-pop="openSkuPop"
            @collect="fnCollect"
            @go-kf="goKf"
        />
        <pageFooter
            v-else
            class="page-footer"
            :goods-detail="goodsDetail"
            @show-spec-pop="openSkuPop"
            @collect="fnCollect"
            @go-kf="goKf"
            @track="track"
        />
        <!-- 普通商品购买sku -->
        <zd-sku-pop
            v-if="goodsInfo"
            ref="skuPop"
            :info="goodsInfo"
            :product-list="goodsDetail.productList"
            :spec-list="goodsDetail.specList"
            :sku-type="skuPopType"
            :user-verify="userStore?.userInfo?.userVerify === UserVerify.Pass ? 1 : 0"
            @submit="fnChangeSku"
        ></zd-sku-pop>
        <!-- 大促活动sku -->
        <!-- <zd-sku-pop
            v-if="goodsInfo && isActive && goodsDetail.activityType !== 11"
            ref="skuPop"
            :info="goodsInfo"
            :product-list="goodsDetail.productList"
            :spec-list="goodsDetail.specList"
            @submit="fnChangeSku"
        ></zd-sku-pop> -->
        <!-- 校园团纸巾团sku弹窗 -->
        <zd-sku-pop
            v-if="groupGoodsInfo && goodsDetail.activityInfo?.productList"
            ref="groupSkuPop"
            :info="groupGoodsInfo"
            :product-list="goodsDetail.activityInfo?.productList"
            :spec-list="goodsDetail.specList"
            @submit="fnChangeSku"
        ></zd-sku-pop>
    </template>
    <track-view
        :track-data="{
            type: 'exposure',
            observerName: '.drawer-coupon',
            eventData: {
                path: 'bi_event',
                student_shop_id: studentShopId,
                page_data_type: 'Goods',
                element_name: '领取优惠券',
                page_data_id: goodsDetail?.goodsNo,
                page_data_info: goodsDetail
            }
        }"
    >
        <chooseCoupon
            ref="couponRef"
            :student-shop-id="studentShopId"
            :list="couponList"
        />
    </track-view>

    <studentAuthPop
        v-if="isLogin"
        ref="studentAuth"
        content="未获取到你的学生认证记录，前往认证，认证成功后可享专属认证权益~"
    ></studentAuthPop>
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
</style>
