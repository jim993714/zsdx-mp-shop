<script setup lang="ts">
import { router, storage } from '@zsdx/mp-utils';
import { ref } from 'vue';

import { getGoodsDetail } from '../api/goods-detail';
import type { GoodsDetail } from '../api/goods-detail/types';
import { addMyGoodsReport, getGoodsSpecList } from '../api/price-break';
import type { GoodReportReq } from '../api/price-break/types';
import FormBase from './components/form-base.vue';

interface Options {
    goodsNo: string;
    studentShopId: string;
}

const localStorage = storage();
const formRef = ref<InstanceType<typeof FormBase>>();

const headerTextColor = computed(() => {
    return showHeader.value ? '$uni-text-color' : 'rgba(0,0,0,0)';
});
const showHeader = ref(false);
const headerOpacity = ref(0);
const goodsDetail = ref<GoodsDetail>();
const specList = ref<any>();

const options = ref<Options>({
    goodsNo: '',
    studentShopId: ''
});

onLoad(options_ => {
    options.value = options_ as Options;

    getDetail();
    getSpecList();
});

onPageScroll((e: any) => {
    showHeader.value = e.scrollTop >= 80;
    headerOpacity.value = e.scrollTop / 80;
});

function goBack() {
    router.back();
}
function toList() {
    router.push('priceBreakList');
}

/** */
async function getDetail() {
    const resp = await getGoodsDetail({
        goodsNo: options.value?.goodsNo,
        studentShopId: options.value?.studentShopId ?? localStorage.get('studentShopId')
    });
    goodsDetail.value = resp;
}

async function getSpecList() {
    const resp: any = await getGoodsSpecList({
        goodsNo: options.value?.goodsNo,
        studentShopId: options.value?.studentShopId ?? localStorage.get('studentShopId')
    });
    specList.value = resp.list;
}

async function submit() {
    const validateRes = formRef.value?.formvalidate();
    if (validateRes) {
        return uni.showToast({
            title: validateRes,
            icon: 'none'
        });
    }
    try {
        await addMyGoodsReport(formRef.value?.form as GoodReportReq);
        router.redirect('priceBreakStatus');
    } catch (err: any) {
        uni.showToast({
            title: err.msg,
            icon: 'none'
        });
    }
}
</script>

<template>
    <view class="page">
        <zd-navbar
            title="低价爆料"
            :background="`rgba(255,255,255, ${headerOpacity})`"
            :color="headerTextColor"
            class="header"
        >
            <template #prefix>
                <view
                    class="back-btn"
                    @tap="goBack"
                >
                    <zd-icon
                        type="zdmp-fanhui"
                        color="#000"
                        :size="40"
                    ></zd-icon>
                </view>
            </template>
        </zd-navbar>

        <view class="banner">
            <image
                class="banner-img"
                src="http://cdn.zsdx.cn/mp-cs/images/shop/price-break/banner-1.png"
                mode="widthFix"
            ></image>

            <view
                class="rule"
                @tap="router.push('priceBreakRule')"
            >
                <zd-icon
                    type="zdmp-chakan"
                    :size="30"
                />
                <text style="line-height: 24rpx">规则</text>
            </view>
        </view>
        <view class="banner-info">
            <view
                class="text"
                style="justify-content: space-between"
            >
                爆料全网最低价
                <view
                    class="btn"
                    @tap="toList"
                >
                    我的爆料
                    <zd-icon
                        type="zdmp-qianwang"
                        :size="24"
                    />
                </view>
            </view>
            <view class="text">
                审核通过后可获得对应商品
                <image
                    style="width: 102rpx; height: 32rpx"
                    src="http://cdn.zsdx.cn/mp-cs/images/shop/price-break/label.png"
                    mode="widthFix"
                ></image>
            </view>
        </view>
        <view class="form-wrapper">
            <form-base
                ref="formRef"
                :goods-detail="goodsDetail!"
                :spec-list="specList"
            />
        </view>

        <zd-button
            type="primary"
            class="confirm-btn"
            @tap="submit"
        >
            提交审核
        </zd-button>
        <view class="tips">
            工作人员将以审核时所看到的页面价格作为最终审核依据审核时长大约1~3个工作日
        </view>
    </view>
</template>

<style scoped lang="scss">
.page {
    display: flex;
    min-height: 100vh;
    padding-bottom: 50rpx;
    background-color: #f5f8fa;
    flex-direction: column;
    flex: 1;
}
.back-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60rpx;
    height: 60rpx;
    margin-left: 20rpx;
    flex-direction: row;
}

.header {
    position: fixed;
    top: 0;
    z-index: 1000;
}
.banner {
    position: relative;
    width: 750rpx;
    &-img {
        width: 100%;
    }
    .rule {
        position: absolute;
        top: 186rpx;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 116rpx;
        height: 48rpx;
        text-align: center;
        color: #fff;
        font-size: 24rpx;
        background-color: rgba($color: #000000, $alpha: 0.4);
        line-height: 48rpx;
        border-top-left-radius: 24rpx;
        border-bottom-left-radius: 24rpx;
    }
}
.banner-info {
    z-index: 10;
    width: 750rpx;
    height: 116rpx;
    margin-top: -116rpx;
    padding: 20rpx;
    border: 2rpx solid #fff;
    border-bottom: none;
    border-radius: 0rpx 60rpx 0rpx 0rpx;
    background: rgba(245, 248, 250, 0.7);
    box-sizing: border-box;
    .text {
        display: flex;
        align-items: center;
        padding-left: 40rpx;
        font-size: 28rpx;
        line-height: 48rpx;
        .btn {
            width: 178rpx;
            height: 56rpx;
            text-align: center;
            color: #fff;
            font-size: 24rpx;
            font-weight: bold;
            background: url(http://cdn.zsdx.cn/mp-cs/images/shop/price-break/btn-bg.png);
            background-size: 100% 100%;
            line-height: 56rpx;
        }
    }
}

.form-wrapper {
    margin: 0 20rpx;
    margin-top: 30rpx;
    padding: 40rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
}
.confirm-btn {
    width: 670rpx;
    height: 80rpx;
    margin: 0 40rpx;
    margin-top: 30rpx;
    border: none;
    :deep(button) {
        border: none;
        font-weight: bold;
    }
}
.tips {
    height: 68rpx;
    margin: 40rpx;
    color: #8a9399;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 34rpx;
}
</style>
