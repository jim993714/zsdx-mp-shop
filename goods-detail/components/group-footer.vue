<script setup lang="ts">
import { clickTrack, router } from '@zsdx/mp-utils';

import { useUserStore } from '@/stores/user';

import { getSchoolDumplingDetail } from '../../api/common/index';
import type { ISchoolDumplingDetail } from '../../api/common/types';
import type { GoodsDetail, SkuPopType } from '../../api/goods-detail/types';
import pageFooter from '../../components/goods-detail/footer.vue';

const props = defineProps<{
    goodsDetail?: GoodsDetail;
    studentShopId?: string;
}>();
const emit = defineEmits(['showSpecPop', 'collect']);
const userStore = useUserStore();
const { isLogin } = toRefs(userStore);

const dumplingInfo = ref<ISchoolDumplingDetail>();
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

const fnCartTrack = () => {
    let data = {
        type: 'click',
        eventData: {
            path: 'bi_event',
            student_shop_id: props.studentShopId || '',
            element_name: '详情页访问购物车',
            page_data_type: 'Goods',
            page_data_id: props.goodsDetail?.goodsNo || '',
            page_data_info: {
                id: props.goodsDetail?.goodsNo,
                title: props.goodsDetail?.goodsTitle,
                price: props.goodsDetail?.goodsShowOriginPrice,
                s_price: props.goodsDetail?.goodsShowPrice
            }
        }
    };
    clickTrack(data);
};

const initData = async () => {
    if (props.goodsDetail?.activityInfo?.schoolDumplingId) {
        try {
            dumplingInfo.value = await getSchoolDumplingDetail({
                activityNo: props.goodsDetail?.activityInfo?.activityNo || '',
                schoolDumplingId: props.goodsDetail?.activityInfo?.schoolDumplingId
            });
        } catch (err) {
            console.error(err);
        }
    }
};
defineExpose({
    initData
});
onMounted(() => {
    initData();
});
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
        @track="fnCartTrack"
    >
        <template #footer>
            <view class="footer-btns">
                <!-- 团购未成团且已参团 -->
                <template
                    v-if="dumplingInfo && dumplingInfo.status === 0 && dumplingInfo.hasJoined === 1"
                >
                    <button
                        class="btn red"
                        open-type="share"
                    >
                        邀请好友参团
                    </button>
                </template>
                <template v-else-if="dumplingInfo && dumplingInfo.status === 1">
                    <view class="btn disabled">已成团</view>
                </template>
                <!-- 团购未成团且未参团 -->
                <template
                    v-else-if="
                        dumplingInfo && dumplingInfo.status === 0 && dumplingInfo.hasJoined === 0
                    "
                >
                    <view
                        class="btn red"
                        @tap="openSkuPop(4)"
                        >立即参团</view
                    >
                </template>
                <!-- 所有人可开团, 且当前商品没有开团中团,可以开团或直接购买 -->
                <template
                    v-else-if="
                        goodsDetail?.activityInfo?.leaderType === 2 &&
                        !goodsDetail?.activityInfo?.haveUnFinishedDumpling
                    "
                >
                    <view
                        class="btn red plain half"
                        @tap="openSkuPop(1)"
                    >
                        <view class="btn-inner">
                            <zd-price
                                :value="goodsDetail.goodsShowPrice || 0"
                                :font-size-large="40"
                                :font-size-small="28"
                                :font-size-unit="24"
                                color="#fff"
                            ></zd-price>
                            <view class="btn-inner-bottom">单独购买</view>
                        </view>
                    </view>
                    <view
                        class="btn red half"
                        @tap="openSkuPop(3)"
                    >
                        <view class="btn-inner">
                            <zd-price
                                :value="goodsDetail.activityInfo.activityPrice"
                                :font-size-large="40"
                                :font-size-small="28"
                                :font-size-unit="24"
                                color="#fff"
                            ></zd-price>
                            <view class="btn-inner-bottom"
                                >{{ goodsDetail.activityInfo?.studentNum }}人团专享</view
                            >
                        </view>
                    </view>
                </template>
                <!-- 只有代理可开团,但是参数中没有已有团的信息,只能单独购买 -->
                <template
                    v-else-if="
                        goodsDetail?.activityInfo?.leaderType === 1 &&
                        !goodsDetail?.activityInfo?.schoolDumplingId
                    "
                >
                    <view
                        class="btn red"
                        @tap="openSkuPop(1)"
                        >单独购买</view
                    >
                </template>
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
    height: 72rpx;
    margin: 0;
    padding: 0 58rpx;
    border-radius: 34rpx;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 600;
    background-color: $zd-main-color;
    line-height: 72rpx;
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
        font-size: 20rpx;
        font-weight: 500;
        line-height: 24rpx;
    }
}
</style>
