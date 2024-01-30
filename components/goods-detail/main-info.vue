<script setup lang="ts">
import { clickTrack } from '@zsdx/mp-utils';
import { computed } from 'vue';

import type { GoodsDetail } from '../../api/goods-detail/types';
import cashbackStep from './cashback-step.vue';
import shareBar from './share-bar.vue';

const props = withDefaults(
    defineProps<{
        goodsDetail: GoodsDetail;
        showPrice?: boolean;
        studentShopId?: string;
    }>(),
    {
        showPrice: true,
        studentShopId: ''
    }
);

const titleTextIndent = computed(() => {
    if (props.showPrice && props.goodsDetail.newRecruitHireGoodsStatus == 1) {
        return 70;
    }

    if (
        props.goodsDetail.activityAdditionalInfoDTO &&
        props.goodsDetail.activityAdditionalInfoDTO.activityTagImg &&
        props.goodsDetail.activityAdditionalInfoDTO.width &&
        props.goodsDetail.activityAdditionalInfoDTO.height
    ) {
        return (
            (props.goodsDetail.activityAdditionalInfoDTO.width * 28) /
                props.goodsDetail.activityAdditionalInfoDTO.height +
            10
        );
    }
    return 0;
});

const track = () => {
    let data = {
        type: 'click',
        eventData: {
            action: 2,
            path: 'bi_event',
            element_name: '商品分享按钮',
            student_shop_id: props.studentShopId,
            page_data_type: 'Goods',
            page_data_id: props.goodsDetail?.goodsNo,
            page_data_info: props.goodsDetail
        }
    };
    clickTrack(data);
};
</script>
<template>
    <view
        class="main-info"
        :class="{ 'main-info-padding': showPrice }"
    >
        <view
            v-if="showPrice"
            class="price-wrap"
        >
            <zd-price
                :value="goodsDetail.goodsShowPrice || 0"
                color="#FF4734"
                :font-size-large="48"
                :font-size-small="32"
                :font-size-unit="24"
            />
            <view
                v-if="goodsDetail.goodsShowOriginPrice !== goodsDetail.goodsShowPrice"
                class="price-origin"
                >¥{{ goodsDetail.goodsShowOriginPrice }}</view
            >
        </view>
        <view
            v-if="goodsDetail.goodsTagList.length > 0"
            class="tag-list"
        >
            <view
                v-for="(goodsTag, tIndex) in goodsDetail.goodsTagList"
                :key="tIndex"
                class="tag"
                >{{ goodsTag.title }}</view
            >
        </view>
        <view class="goods-title">
            <text
                v-if="showPrice && goodsDetail.newRecruitHireGoodsStatus === 1"
                class="title-inline-tag"
                >新品</text
            >
            <image
                v-if="
                    goodsDetail.activityAdditionalInfoDTO &&
                    goodsDetail.activityAdditionalInfoDTO.activityTagImg
                "
                class="title-inline-tag-img"
                :src="goodsDetail.activityAdditionalInfoDTO?.activityTagImg"
                :style="{ height: '28rpx' }"
                mode="heightFix"
            />
            <view
                class="goods-title-text ellipsis2"
                :style="{ textIndent: titleTextIndent + 'rpx' }"
            >
                {{ goodsDetail.goodsTitle }}
            </view>
        </view>
        <view
            v-if="goodsDetail.recommendWords"
            class="recommend-words"
        >
            <view class="recommend-words-text ellipsis2"> “{{ goodsDetail.recommendWords }}" </view>
        </view>
        <cashbackStep
            v-if="
                goodsDetail.activityInfo?.subActivityType === 4 &&
                goodsDetail.activityInfo?.levelList &&
                goodsDetail.activityInfo?.levelList.length > 0
            "
            :step="goodsDetail.activityInfo?.levelList || []"
            :sale-num="goodsDetail.activityInfo?.saleNum || 0"
        />
        <shareBar
            :max-subsidy="
                goodsDetail.activityInfo?.activityStatus === 2 &&
                goodsDetail.activityInfo?.subActivityType === 4
                    ? goodsDetail.activityInfo?.maxSubsidy
                    : 0
            "
            :commission="goodsDetail.workHireNotAgentRebateMoney || 0"
            @track="track"
        ></shareBar>
    </view>
</template>
<style lang="scss" scoped>
.main-info {
    position: relative;
    z-index: 0;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    width: 710rpx;
    margin: 20rpx 20rpx 0;
    padding: 0rpx 20rpx 30rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
    flex-direction: column;
    &-padding {
        padding-top: 28rpx;
    }
}
.price-wrap {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    flex-direction: row;
    .price-title {
        margin-right: 4rpx;
        color: #ff4734;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }
    .price-origin {
        margin-bottom: 4rpx;
        margin-left: 8rpx;
        text-decoration: line-through;
        color: $uni-text-color-grey;
        font-size: 24rpx;
        line-height: 24rpx;
    }
}

.tag-list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: calc(100% + 20rpx);
    margin-top: 14rpx;
    margin-right: -20rpx;
    flex-direction: row;
    flex-wrap: wrap;
    .tag {
        margin-top: 10rpx;
        margin-right: 10rpx;
        padding: 0 10rpx;
        border: 1px solid #199fff;
        border-radius: 4rpx;
        color: #199fff;
        font-size: 20rpx;
        font-weight: 600;
        line-height: 36rpx;
    }
}
.goods-title {
    position: relative;
    margin-top: 20rpx;
    .goods-title-text {
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 600;
        line-height: 40rpx;
    }
    .title-inline-tag {
        position: absolute;
        top: 6rpx;
        left: 0;
        width: 56rpx;
        border-radius: 4rpx;
        text-align: center;
        color: #ffffff;
        font-size: 20rpx;
        background: linear-gradient(135deg, #ff8f40 0%, #ff4734 100%);
        line-height: 28rpx;
    }
    .title-inline-tag-img {
        position: absolute;
        top: 6rpx;
        left: 0;
    }
}
.recommend-words {
    margin-top: 20rpx;
    padding: 20rpx;
    border-radius: 16rpx;
    color: #8a9399;
    background: #f5f8fa;
    .recommend-words-text {
        font-size: 24rpx;

        box-sizing: border-box;
        line-height: 40rpx;
    }
}
</style>
