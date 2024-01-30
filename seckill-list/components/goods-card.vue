<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { useUserStore } from '@/stores/user';

import { setSaleAlert } from '../../api/seckill-list/index';
import type { GetTimeGoodsListItem } from '../../api/seckill-list/types';
import GoodsCardBase from './goods-card-base.vue';
import ProgressBar from './progress-bar.vue';

const userStore = useUserStore();

const props = defineProps<{
    item: GetTimeGoodsListItem;
    startTime: string;
}>();
const { isLogin } = toRefs(userStore);

const { item } = toRefs(props);
const percent = computed<number>(() => {
    const v = (item.value.saleNum / item.value.goodsNum) * 100;
    return v < 11 ? 10 : v;
});

const progressColor = computed<[string, string]>(() => {
    if (percent.value < 100) return ['rgba(255,71,52,0.4)', '#FF4734'];
    return ['#CCC3C2', '#CCC3C2'];
});

const goodsConfig = {
    titleLine: '1',
    priceLabel: '',
    showHeaderTag: true,
    fontSizeLarge: 40,
    fontSizeSmall: 24,
    fontSizeUnit: 20,
    itemStyle: {
        width: '710rpx'
    },
    coverStyle: {
        borderRadius: '8rpx'
    }
};

function toDetail() {
    router.push('goodsDetailFlash', {
        saleNo: item.value.saleNo
    });
}

async function addAlert(item: GetTimeGoodsListItem, status: number) {
    if (!isLogin.value) {
        return router.push('login');
    }
    // 添加提醒
    await setSaleAlert({
        saleNo: item.saleNo!,
        status: status
    });
    item.alertStatus = status;
}
</script>

<template>
    <goods-card-base
        class="goods-item"
        v-bind="goodsConfig"
        title-line="1"
        :item="props.item"
        @tap="toDetail"
    >
        <template #head-tag>
            <view
                v-if="item.isCrossBorder"
                class="head-tag"
            >
                跨境商品
            </view>
        </template>
        <template #tag>
            <view
                v-if="item.status === 2"
                class="progress-box"
            >
                <progress-bar
                    :width="430"
                    :percent="percent > 80 ? 100 : percent"
                    :stroke-width="28"
                    :border-radius="16"
                    :font-size-small="28"
                    :background-color="progressColor?.[0]"
                    :active-color="progressColor?.[1]"
                />
                <view
                    class="progress-text"
                    :style="{
                        width: percent > 80 ? '430rpx' : 'auto',
                        textAlign: percent > 80 ? 'center' : 'left',
                        left: percent > 80 ? 0 : `calc(${percent}% + 10rpx)`
                    }"
                >
                    <template v-if="percent >= 100"> 已售馨 </template>
                    <template v-else-if="percent > 80">即将售馨</template>
                    <template v-else-if="percent <= 80 && percent >= 11"
                        >{{ percent.toFixed(0) }}%</template
                    >
                    <template v-else-if="percent < 11">火热抢购中</template>
                    <image
                        v-if="percent > 80 && percent < 100"
                        :src="`https://nss1.zsdx.cn/mp-cs/images/shop/seckill/icon-time.png`"
                        mode="widthFix"
                        class="icon-time"
                    />
                </view>
            </view>
            <view
                v-if="item.status === 1"
                class="start-time"
            >
                {{ props.startTime }}开始
            </view>
        </template>
        <template #footer>
            <view
                class="price-footer"
                :style="{
                    height: (item.status === 2 ? 96 : 80) + 'rpx',
                    background: item.status === 2 ? '#FFF3F2' : '#FFF4E0'
                }"
            >
                <view class="price-left">
                    <view style="display: flex; align-items: flex-end">
                        <view
                            style="
                                height: 20rpx;
                                margin-right: 5rpx;
                                font-weight: bold;
                                line-height: 20rpx;
                            "
                            >秒杀</view
                        >
                        <zd-price
                            :value="item.goodsPricePay ?? 0"
                            :font-size-large="40"
                            :font-size-small="28"
                            :font-size-unit="20"
                            color="#FF4734"
                        />
                    </view>
                    <view
                        v-if="item.status === 2"
                        style="margin-top: 4rpx"
                    >
                        即将恢复{{ item.goodsPriceOrigin }}元
                    </view>
                </view>

                <image
                    v-if="item.status === 2"
                    :src="`https://nss1.zsdx.cn/mp-cs/images/shop/seckill/item-bg${
                        percent >= 100 ? '-gray' : ''
                    }.png`"
                    mode="widthFix"
                    class="bg-image"
                />
                <view
                    v-if="item.status === 1"
                    @tap.stop="addAlert(props.item, props.item.alertStatus === 0 ? 1 : 0)"
                >
                    <image
                        v-if="item.status === 1 && props.item.alertStatus === 1"
                        :src="`https://nss1.zsdx.cn/mp-cs/images/shop/seckill/item-bg-yellow-1.png`"
                        mode="widthFix"
                        class="bg-image"
                        :style="{
                            marginTop: (item.status === 1 ? -16 : 0) + 'rpx'
                        }"
                    />
                    <image
                        v-if="item.status === 1 && props.item.alertStatus === 0"
                        :src="`https://nss1.zsdx.cn/mp-cs/images/shop/seckill/item-bg-yellow-2.png`"
                        mode="widthFix"
                        class="bg-image"
                        :style="{
                            marginTop: (item.status === 1 ? -16 : 0) + 'rpx'
                        }"
                    />
                    <view class="btn-text">
                        <template v-if="props.item.alertStatus === 1">已预约</template>
                        <template v-if="props.item.alertStatus === 0">预约</template>
                    </view>
                </view>

                <view
                    class="price-right"
                    :style="{
                        top: item.status === 2 ? 36 : 20 + 'rpx'
                    }"
                >
                    ¥{{ item.discountPrice }}
                </view>
            </view>
        </template>
        <template #btn> </template>
    </goods-card-base>
</template>

<style scoped lang="scss">
.goods-item {
    :deep(.goods-wrap) {
        width: 710rpx;
        height: 260rpx;
    }
    :deep(button) {
        height: 60rpx;
        line-height: 56rpx;
        font-size: 28rpx;
    }
    :deep(.goods-price-label) {
        display: flex;
        align-items: flex-end;
    }

    .head-tag {
        width: 104rpx;
        height: 34rpx;
        margin: 16rpx;
        border-radius: 17rpx;
        text-align: center;
        color: #fff;
        font-size: 20rpx;
        background: linear-gradient(135deg, #6d35da 0%, #5f56e6 100%);
        box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(107, 57, 219, 0.4);
        line-height: 34rpx;
    }
    .progress-box {
        position: relative;
        display: flex;
        width: 430rpx;
        align-content: center;
        :deep(progress) {
            flex: 1;
            height: 24rpx;
        }
        .progress-text {
            position: absolute;
            top: 0rpx;
            height: 20rpx;
            color: #fff;
            font-size: 20rpx;
        }
    }
    .start-time {
        color: #ff8026;
        font-size: 20rpx;
    }

    .price-footer {
        position: relative;
        width: 430rpx;
        height: 96rpx;
        border-radius: 16rpx 16rpx 40rpx 16rpx;
        background-color: #fff3f2;
        .bg-image {
            position: absolute;
            top: 0;
            right: 0;
            width: 186rpx;
            height: 96rpx;
        }
        .price-left {
            padding-top: 16rpx;
            padding-left: 20rpx;
            color: $zd-color-red;
            font-size: 20rpx;
        }
        .price-right {
            position: absolute;
            top: 36rpx;
            left: 230rpx;
            min-width: 100rpx;
            text-align: center;
            color: #713d17;
            font-size: 20rpx;
        }
        .btn-text {
            position: absolute;
            right: 20rpx;
            bottom: 20rpx;
            width: 90rpx;
            text-align: center;
            color: #fff;
            font-size: 28rpx;
        }
    }
}

.btn {
    height: 60rpx;
    margin-bottom: -6rpx;
    :deep(button) {
        font-size: 28rpx;
        font-weight: bold;
    }
}

.icon-time {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 12;
    width: 28rpx;
    height: 28rpx;
}
</style>
