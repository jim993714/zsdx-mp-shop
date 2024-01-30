<script setup lang="ts">
import type { ICombinationDetail } from '../../api/combination-package-goods-detail/types';
import specUnit from './spec-unit.vue';

interface Props {
    /**
     * 按钮文字
     */
    buttonText?: string;
    packageDetail: ICombinationDetail;
}

const props = withDefaults(defineProps<Props>(), {
    showNumber: true,
    buttonText: '确定'
});

const emit = defineEmits(['submit']);
const sku = ref();
const productNos = ref<Array<string | undefined>>([]);
/**
 * 打开页面
 */
onMounted(() => {
    if (props.packageDetail.goodsList.length) {
        props.packageDetail.goodsList.forEach(() => {
            productNos.value.push(undefined);
        });
    }
});
const open = () => {
    sku.value.open('bottom');
};

const fnClose = () => {
    sku.value.close();
};

/**
 * 包名缩进
 */
const packageTitleIndent = computed(() => {
    return props.packageDetail.goodsNum > 10 ? '5.5em' : '5em';
});

/**
 * 确认提交
 */
const submit = () => {
    let isSubmit = productNos.value.every(item => !!item);
    console.log(productNos.value, 'productNos.value');

    if (isSubmit) {
        emit('submit', productNos.value);
    } else {
        uni.showToast({
            title: '请选择规格',
            icon: 'none'
        });
    }
};

const selectSku = (item: any, index: number) => {
    if (item) {
        productNos.value.splice(index, 1, item.productNo);
    } else {
        productNos.value.splice(index, undefined);
    }
};

const fnStop = (e: any) => {
    console.log(e, '12312321');

    e.stopPropagation();
};

defineExpose({
    open
});
</script>

<template>
    <uni-popup
        ref="sku"
        :safe-area="false"
        @touchmove.stop.prevent="fnStop"
    >
        <view class="sku-main">
            <view class="package-info">
                <image
                    class="package-cover"
                    :src="props.packageDetail.packageCover"
                    mode="scaleToFill"
                />
                <view class="package-info-content">
                    <view class="package-title-warp">
                        <view class="package-count-text"
                            >共{{ props.packageDetail.goodsNum }}款商品</view
                        >
                        <view
                            class="package-title-text ellipsis2"
                            :style="{ textIndent: packageTitleIndent }"
                            >{{ props.packageDetail.packageTitle }}</view
                        >
                    </view>
                    <view class="package-info-bottom">
                        <zd-price
                            :value="props.packageDetail.fixedMoney"
                            :font-size-large="40"
                            :font-size-small="24"
                            :font-size-unit="20"
                        ></zd-price>
                        <view class="package-last-count"
                            >剩余数量{{ props.packageDetail.packageNum }}件</view
                        >
                    </view>
                </view>
            </view>
            <view
                class="close-btn"
                @tap="fnClose"
            >
                <zd-icon
                    type="zdmp-guanbidefuben"
                    color="rgba(138, 147, 153, 1)"
                    :size="36"
                />
            </view>
            <scroll-view
                scroll-y
                class="sku-scroll-view"
            >
                <view class="sku-head-title">请选择规格</view>
                <view
                    v-for="(item, index) in props.packageDetail.goodsList"
                    :key="index"
                >
                    <spec-unit
                        v-if="item"
                        :info="item"
                        :index="index"
                        :product-list="item.activityProductList"
                        :spec-list="item.activitySpecList"
                        @select-sku="selectSku"
                    ></spec-unit>
                </view>
            </scroll-view>

            <view class="sku-bottom">
                <zd-button
                    type="primary"
                    :button-style="{ borderRadius: '38rpx' }"
                    @tap="submit()"
                >
                    {{ buttonText }}
                </zd-button>
            </view>
        </view>
    </uni-popup>
</template>

<style scoped lang="scss">
.sku-main {
    position: relative;
    width: 100%;
    padding: 40rpx;
    padding-top: 288rpx;
    border-radius: 32rpx 32rpx 0 0;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
}

.package-info {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 750rpx;
    height: 270rpx;
    padding: 40rpx 0 30rpx 40rpx;
    box-sizing: border-box;
    box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
    .package-cover {
        width: 200rpx;
        height: 200rpx;
        border-radius: 12rpx;
    }
    .package-info-content {
        display: flex;
        justify-content: space-between;
        width: 394rpx;
        height: 200rpx;
        margin-left: 20rpx;
        flex-direction: column;

        .package-title-warp {
            position: relative;
            .package-count-text {
                position: absolute;
                top: 4rpx;
                left: 0;
                padding: 4rpx 8rpx;
                border-radius: 4rpx;
                color: #ff4734;
                font-size: 24rpx;
                font-weight: 500;
                background: rgba(255, 71, 52, 0.1);
                line-height: 24rpx;
            }
            .package-title-text {
                color: #292f33;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 40rpx;
            }
        }
        .package-last-count {
            margin-top: 16rpx;
            color: #8a9399;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 24rpx;
        }
    }
}
.sku-head-title {
    color: #333333;
    font-size: 28rpx;
    font-weight: 500;
    line-height: 28rpx;
}

.sku-scroll-view {
    width: 100%;
    max-height: 670rpx;
}

.sku-bottom {
    margin-top: 40rpx;
}
.close-btn {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    width: 66rpx;
    height: 78rpx;
    flex-direction: row;
}
</style>
