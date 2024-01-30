<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { generateTrackSearchSession } from '@/utils/track/search';

import { COMPONENT_TYPE_FOR_DATA, type SearchData, type SearchStyle } from '../../types';

const props = withDefaults(
    defineProps<{
        data: SearchData;
        styleConfig: SearchStyle;
    }>(),
    {
        styleConfig: () => ({
            position: 'normal',
            textAlign: 'left',
            height: 28,
            backgroundColor: 'rgba(255,255,255,1)',
            borderColor: 'rgba(153,153,153,1)',
            textColor: 'rgba(153,153,153,1)'
        })
    }
);
const searchSession = generateTrackSearchSession();
const customPageNo = inject('customPageNo');
const goSearch = () => {
    router.push('search', {
        type: COMPONENT_TYPE_FOR_DATA.GOODS_SEARCH,
        search_source_key: props.data.search_source_key,
        customPageNo: customPageNo,
        __trackSearchSession: searchSession
    });
};
</script>

<template>
    <track-view
        :track-data="{
            type: 'click',
            eventData: {
                path: 'bi_search',
                search_session: searchSession
            },
            clickData: {
                action: 1
            }
        }"
    >
        <view
            class="search-component"
            :style="{
                position: props.styleConfig.position === 'normal' ? 'relative' : 'fixed',
                background: props.styleConfig.backgroundColor
            }"
        >
            <view
                class="search-info"
                :style="{
                    height: props.styleConfig.height + 'px',
                    borderColor: props.styleConfig.borderColor
                }"
                @tap="goSearch"
            >
                <zd-icon
                    class="zd-icon"
                    type="zdmp-sousuo1"
                    :size="32"
                    :color="props.styleConfig.textColor"
                ></zd-icon>
                <text
                    class="search-placeholder"
                    :style="{
                        color: props.styleConfig.textColor,
                        textAlign: props.styleConfig.textAlign
                    }"
                    >搜索商品</text
                >
            </view>
        </view>
    </track-view>
    <view
        v-if="props.styleConfig.position === 'fixed'"
        class="search-set"
        :style="{ height: props.styleConfig.height + 'px' }"
    ></view>
</template>

<style lang="scss" scoped>
.search-component {
    z-index: 99;
    width: 750rpx;
    padding: 10rpx 30rpx;
    .search-info {
        display: flex;
        align-items: center;
        width: 690rpx;
        border: 1px solid;
        border-radius: 68rpx;
        background: #ffffff;
    }
    .zd-icon {
        margin: 0 14rpx 0 30rpx;
    }
    .search-placeholder {
        flex: 1;
        margin-right: 76rpx;
        color: #999999;
        font-size: 28rpx;
        font-family: 400;
        line-height: 28rpx;
    }
}
.search-set {
    padding: 10rpx 15rpx;
}
</style>
