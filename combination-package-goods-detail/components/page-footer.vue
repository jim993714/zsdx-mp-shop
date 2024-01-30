<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { useUserStore } from '@/stores/user';

import type {
    ICombinationDetail,
    IGoodsList
} from '../../api/combination-package-goods-detail/types';
import type { GoodsDetail } from '../../api/goods-detail/types';
import Footer from '../../components/goods-detail/footer.vue';
import timeOut from './time-out.vue';

const userStore = useUserStore();
const { isLogin } = toRefs(userStore);

const props = withDefaults(
    defineProps<{
        goodsDetail: IGoodsList & GoodsDetail;
        packageDetail: ICombinationDetail;
        activityStatus: number;
        time: number;
        timeBg: string;
    }>(),
    {}
);

const emit = defineEmits(['checkGoodsSku', 'goKf', 'timeEnd', 'checkPackageSku']);
const checkLogin = () => {
    if (!isLogin.value) {
        router.push('login');
    }
    return isLogin.value;
};
const fnGoKf = () => {
    if (checkLogin()) {
        router.push('chatRoom');
    }
};
const timeEnd = () => {
    emit('timeEnd');
};
const checkGoodsSku = () => {
    emit('checkGoodsSku');
};

const checkPackageSku = () => {
    emit('checkPackageSku');
};
</script>
<template>
    <view class="footer-seat savepadding"></view>
    <view class="footer-warp">
        <view class="activity-status">
            <view
                v-if="[1, 2, 3].includes(activityStatus)"
                class="activity-no-end"
            >
                <view class="activity-label">开学季组合大礼包</view>
                <view
                    class="activity-time"
                    :style="{
                        backgroundImage: `url(${props.timeBg})`
                    }"
                >
                    <time-out
                        :time="props.time"
                        :activity-status="props.activityStatus"
                        @time-end="timeEnd"
                    ></time-out>
                </view>
            </view>
            <view
                v-if="[-1, 0].includes(activityStatus)"
                class="activity-end"
            >
                {{
                    activityStatus === -1 ? '该开学季组合大礼包已售罄' : '该开学季组合大礼包已结束'
                }}
            </view>
        </view>

        <Footer
            class="page-footer"
            :show-kf="true"
            :goods-detail="goodsDetail"
            :show-collect="false"
            :show-shopping-cart="false"
            :show-shopping-cart-btn="false"
            @show-spec-pop="checkGoodsSku"
            @collect="timeEnd"
            @go-kf="fnGoKf"
        >
            <template #footer>
                <view class="operate">
                    <view
                        class="btn-pink"
                        @tap.prevent="checkGoodsSku"
                        >学生价购买</view
                    >
                    <view
                        class="btn-red"
                        :class="{ disable: activityStatus !== 2 }"
                        @tap.prevent="checkPackageSku"
                        >组合包购买</view
                    >
                </view>
            </template>
        </Footer>
    </view>
</template>
<style lang="scss" scoped>
.footer-seat {
    width: 0;
    height: 120rpx;
}
.footer-warp {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    .activity-status {
        display: flex;
        width: 710rpx;
        height: 96rpx;
        margin-left: 20rpx;
        border-radius: 48rpx;
        background: rgba($color: #000000, $alpha: 0.6);
        box-sizing: border-box;
    }
    .activity-no-end {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12rpx 0 36rpx;
        .activity-label {
            margin-right: 24rpx;
            color: #ffffff;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
        .activity-time {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 400rpx;
            height: 72rpx;
            border-radius: 72rpx;
            background-size: cover;
        }
    }
    .activity-end {
        flex: 1;
        text-align: center;
        color: #ffffff;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 96rpx;
    }
}
.disable {
    opacity: 0.5;
}

.operate {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
    padding-right: 20rpx;
    .btn-pink {
        width: 212rpx;
        height: 68rpx;
        border-radius: 38rpx 0rpx 0rpx 38rpx;
        text-align: center;
        color: #ff4734;
        font-size: 24rpx;
        font-weight: 500;
        background: #ff4734;
        line-height: 68rpx;
        background: rgba(255, 71, 52, 0.1);
    }
    .btn-red {
        width: 212rpx;
        height: 68rpx;
        border-radius: 0rpx 38rpx 38rpx 0rpx;
        text-align: center;
        color: #ffffff;
        font-size: 24rpx;
        font-weight: 500;
        background: #ff4734;
        line-height: 68rpx;
        background: rgba(255, 71, 52, 1);
    }
}
</style>
