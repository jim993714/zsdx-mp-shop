<script setup lang="ts">
import type { GoodsInfo } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';
import { router } from '@zsdx/mp-utils';

import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user/index';
import { UserVerify } from '@/stores/user/types';

import { getActivityDetail } from '../api/combination-package-goods-detail/index';
import type {
    ICombinationDetail,
    IGoodsList,
    IPackageParams
} from '../api/combination-package-goods-detail/types';
import coverSwiper from '../components/goods-detail/cover-swiper.vue';
import richContent from '../components/goods-detail/rich-content.vue';
import studentAuthPop from '../components/student-auth-pop/index.vue';
import buyInfo from './components/buy-info.vue';
import goodsInfoBox from './components/goods-info.vue';
import packageGoods from './components/package-goods.vue';
import packageSku from './components/package-sku.vue';
import pageFooter from './components/page-footer.vue';
import serviceBar from './components/service-bar.vue';
import { getGoodsInfo, getToastTips } from './constants';
import type { CoverItem } from './types';

const orderStore = useOrderStore();
const userStore = useUserStore();
const { studentShopId, isLogin } = toRefs(userStore);
const navBar = ref();

const headerOpacity = ref(0);
const showHeader = ref(false);
const pageStack = getCurrentPages();
const goodsIndex = ref(0);
const currentGoods = ref({} as IGoodsList | any);
const packageDetail = ref({} as ICombinationDetail);
const skuPop = ref();
const packageSkuPop = ref();
const params = ref<IPackageParams>({
    studentShopId: studentShopId.value,
    schoolSeasonCombinationPackageActivityId: ''
});
const goodsInfo = ref<GoodsInfo>();
const authPopupRef = ref();

const time = ref(0);
const timeBg = ref('');
const headerTextColor = computed(() => {
    return showHeader.value ? '$uni-text-color' : 'rgba(0,0,0,0)';
});

const coverList = computed(() => {
    if (!packageDetail.value) {
        return [];
    }
    let list: CoverItem[] = currentGoods.value?.goodsImageList?.reduce(
        (result: CoverItem[], item: string) => {
            result.push({
                type: 1,
                cover: item
            });
            return result;
        },
        []
    );

    return list;
});

onLoad((options: any) => {
    params.value.schoolSeasonCombinationPackageActivityId =
        options.schoolSeasonCombinationPackageActivityId || '';
});
onShow(() => {
    getPackageDetail();
});
/**
 * 获取详情
 */
const getPackageDetail = async () => {
    try {
        const res = await getActivityDetail(params.value);
        packageDetail.value = res;
        currentGoods.value = (res.goodsList && res.goodsList[0]) || {};
        goodsInfo.value = getGoodsInfo(currentGoods.value);
    } catch (err) {
        console.error(err);
    }
};
/**  活动状态： -1已售罄 0已结束 1预热 2开始 3未开始 */
const activityStatus = computed(() => {
    let now = new Date().getTime();
    if (packageDetail.value.isSoldOut === 1) {
        return -1;
    } else if (
        now >= packageDetail.value.warmUpStartTime &&
        now < packageDetail.value.warmUpEndTime
    ) {
        time.value = parseInt((packageDetail.value.warmUpEndTime - now) / 1000 + '');
        timeBg.value =
            'https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/buy-status-no.png';

        return 1;
    } else if (now >= packageDetail.value.startTime && now < packageDetail.value.endTime) {
        time.value = parseInt((packageDetail.value.endTime - now) / 1000 + '');
        timeBg.value =
            'https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/buy-status-start.png';

        return 2;
    } else if (now < packageDetail.value.startTime) {
        time.value = parseInt((packageDetail.value.startTime - now) / 1000 + '');
        timeBg.value =
            'https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/buy-status-no.png';

        return 3;
    } else if (now > packageDetail.value.endTime) {
        return 0;
    }
    return 0;
});

const fnBack = () => {
    if (pageStack?.length == 1) {
        router.switchTab('home');
    } else {
        router.back();
    }
};
/**
 * 切换商品
 */
const checkGoods = (item: IGoodsList, index: number) => {
    goodsIndex.value = index;
    currentGoods.value = item;
};

const timeEnd = () => {
    console.log('活动倒计时结束');
};
/**
 * 单个商品的sku
 */
const checkGoodsSku = () => {
    skuPop.value.open();
};
/**
 * 单个商品的sku
 */
const fnChangeGoodsSku = async (sku: any) => {
    if (sku.goodsShowPriceType === 2 && sku.buyType !== 1) {
        let authRes: boolean = await authPopupRef.value.validate();
        if (authRes) {
            fnDoBuy(sku);
        }
    } else {
        fnDoBuy(sku);
    }
};

/**
 * 单个商品购买
 */
const fnDoBuy = (sku: any) => {
    orderStore.setSelectedProducts([
        {
            goodsNo: currentGoods.value.goodsNo,
            productNo: sku.productNo,
            num: sku.count,
            studentShopId: studentShopId.value,
            usePayType: sku.buyType
        }
    ]);
    router.push('orderConfirm');
};

/**
 * 组合包sku显示
 */
const checkPackageSku = () => {
    if (activityStatus.value === 2) {
        packageSkuPop.value.open();
    } else {
        uni.showToast({
            icon: 'none',
            title: getToastTips(activityStatus.value)
        });
    }
};

const fnChangePackageSku = (item: Array<string>) => {
    orderStore.setSelectedProducts([
        {
            schoolSeasonCombinationPackageActivityId:
                params.value.schoolSeasonCombinationPackageActivityId,
            productNos: item,
            studentShopId: params.value.studentShopId
        }
    ]);
    router.push('orderConfirm', { buyType: 11 });
};

onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 80;
    headerOpacity.value = e.scrollTop > 80 ? 1 : e.scrollTop / 80;
});

onPullDownRefresh(async () => {
    getPackageDetail();
    uni.stopPullDownRefresh();
});
</script>

<template>
    <view class="page-warp">
        <zd-navbar
            ref="navBar"
            title="商品详情"
            :background="`rgba(255,255,255, ${headerOpacity})`"
            :color="headerTextColor"
            class="header"
            fixed
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

        <cover-swiper :list="coverList" />
        <goods-info-box
            :current-goods="currentGoods"
            :package-detail="packageDetail"
        />
        <packageGoods
            v-if="packageDetail.goodsList"
            :list="packageDetail.goodsList"
            :goods-num="packageDetail.goodsNum"
            :goods-index="goodsIndex"
            @check-goods="checkGoods"
        />
        <service-bar
            :service-list="packageDetail.packageTags"
            :goods-no="currentGoods.goodsNo"
            :goods-detail="currentGoods"
            :show-special="false"
        />
        <buy-info
            :goods-detail="currentGoods"
            :selected-product="''"
            :goods-freight="packageDetail.goodsFreight"
            @open-sku-pop="checkPackageSku"
        />
        <richContent
            :content="currentGoods.goodsContent"
            :goods-detail="currentGoods"
        />
        <page-footer
            :package-detail="packageDetail"
            :goods-detail="currentGoods"
            :activity-status="activityStatus"
            :time="time"
            :time-bg="timeBg"
            @time-end="timeEnd"
            @check-goods-sku="checkGoodsSku"
            @check-package-sku="checkPackageSku"
        />
        <zd-sku-pop
            v-if="goodsInfo"
            ref="skuPop"
            :info="goodsInfo"
            :product-list="currentGoods.productList"
            :spec-list="currentGoods.specList"
            :sku-type="1"
            :user-verify="userStore?.userInfo?.userVerify === UserVerify.Pass ? 1 : 0"
            @submit="fnChangeGoodsSku"
        ></zd-sku-pop>
        <package-sku
            v-if="packageDetail?.goodsList?.length"
            ref="packageSkuPop"
            :package-detail="packageDetail"
            button-text="购买组合包"
            @submit="fnChangePackageSku"
        ></package-sku>
        <studentAuthPop
            v-if="isLogin"
            ref="authPopupRef"
            content="未获取到你的学生认证记录，前往认证，认证成功后可享学生价~"
        />
    </view>
</template>

<style lang="scss" scoped>
.page-warp {
    width: 750rpx;
    min-height: 100%;
    background: #f5f8fa;
}
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
