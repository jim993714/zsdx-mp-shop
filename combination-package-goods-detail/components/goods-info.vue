<script setup lang="ts">
import type {
    ICombinationDetail,
    IGoodsList
} from '../../api/combination-package-goods-detail/types';
import shareBar from '../../components/goods-detail/share-bar.vue';

const props = defineProps<{
    currentGoods: IGoodsList;
    packageDetail: ICombinationDetail;
}>();

const packageStatusText = computed(() => {
    let now = new Date().getTime();
    if (props.packageDetail.endTime < now) {
        return '已结束';
    } else if (props.packageDetail.isSoldOut === 1) {
        return '已售罄';
    } else {
        return `数量  ${props.packageDetail.goodsNum}`;
    }
});
</script>

<template>
    <view class="package-info">
        <view class="ambience-bg">
            <view class="ambience-top">
                <view class="price-label">一口价</view>
                <zd-price
                    :value="props.packageDetail.fixedMoney || 0"
                    :font-size-large="48"
                    :font-size-small="32"
                    :font-size-unit="24"
                    color="#ffffff"
                ></zd-price>
            </view>
            <view class="ambience-bottom">
                <view class="ambience-bottom-label ml0">原总价</view>
                <view class="ambience-bottom-num">￥{{ props.packageDetail.originPrice }}</view>
                <view class="ambience-bottom-label">当前原总价</view>
                <view class="ambience-bottom-num">￥999.00</view>
            </view>
            <view class="ambience-status">{{ packageStatusText }}</view>
        </view>
        <view class="goods-info">
            <view
                v-if="props.packageDetail?.packageTags?.length"
                class="goods-tag-box"
            >
                <view
                    v-for="(item, index) in props.packageDetail?.packageTags"
                    :key="index"
                    class="goods-tag"
                    >{{ item.title }}</view
                >
            </view>
            <view class="goods-title ellipsis2">{{ props.currentGoods.goodsTitle }}</view>
            <view
                v-if="props.packageDetail.packageRemark"
                class="package-intro"
                >{{ props.packageDetail.packageRemark }}</view
            >
            <share-bar :commission="1000"></share-bar>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.package-info {
    width: 710rpx;
    margin-top: 20rpx;
    margin-left: 20rpx;
    box-sizing: border-box;
    .ambience-bg {
        position: relative;
        width: 710rpx;
        height: 140rpx;
        padding: 12rpx 20rpx 20rpx;
        background-size: cover;
        box-sizing: border-box;
        background-image: url('https://cdn.zsdx.cn/mp-cs/images/activity/combination-package/ambience-bg.png');
        .ambience-top {
            display: flex;
            align-items: flex-end;
            .price-label {
                margin-right: 8rpx;
                margin-bottom: 4rpx;
                color: #ffffff;
                font-size: 20rpx;
                font-weight: 400;
                line-height: 20rpx;
            }
        }
        .ambience-bottom {
            display: flex;
            align-items: center;
            margin-top: 12rpx;
            opacity: 0.7;
            .ambience-bottom-label {
                margin: 0 8rpx;
                text-align: left;
                color: #ffffff;
                font-size: 20rpx;
                font-weight: 400;
                line-height: 20rpx;
            }
            .ml0 {
                margin-left: 0;
            }
            .ambience-bottom-num {
                text-decoration: line-through;
                color: #ffffff;
                font-size: 20rpx;
                font-weight: 400;
                line-height: 20rpx;
            }
        }
        .ambience-status {
            position: absolute;
            top: 32rpx;
            right: 0;
            width: 176rpx;
            height: 44rpx;
            border-radius: 24rpx 0rpx 0rpx 24rpx;
            text-align: center;
            color: #ffffff;
            font-size: 24rpx;
            font-weight: 400;
            background: rgba(255, 255, 255, 0.2);
            line-height: 44rpx;
        }
    }
    .goods-info {
        position: relative;
        width: 710rpx;
        margin-top: -30rpx;
        padding: 30rpx 20rpx;
        border-radius: 16rpx;
        background: #ffffff;
        box-sizing: border-box;

        .goods-tag-box {
            display: flex;
            align-items: center;
            .goods-tag {
                margin-right: 10rpx;
                padding: 8rpx 10rpx;
                border: 2rpx solid #199fff;
                border-radius: 4rpx;
                color: #199fff;
                font-size: 20rpx;
                font-weight: 500;
                line-height: 20rpx;
            }
        }
        .goods-title {
            width: 670rpx;
            margin-top: 20rpx;
            color: #292f33;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
        .package-intro {
            width: 670rpx;
            margin-top: 20rpx;
            padding: 20rpx;
            border-radius: 16rpx;
            color: #8a9399;
            font-size: 24rpx;
            font-weight: 400;
            background: #f5f8fa;
            line-height: 40rpx;
            box-sizing: border-box;
        }
    }
}
</style>
