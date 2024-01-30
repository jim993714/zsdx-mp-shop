<script setup lang="ts">
import { clickTrack } from '@zsdx/mp-utils';

import { useUserStore } from '@/stores/user';

import { getCustomPage } from '../api/custom-page/index';
import ComposePackage from './components/compose-package/index.vue';
import Coupon from './components/coupon/index.vue';
import CustomGoods from './components/custom-goods/index.vue';
import GoodsGroup from './components/goods-group/index.vue';
import MultiImage from './components/multi-image/index.vue';
import Packet from './components/packet/index.vue';
import PageHeader from './components/page-header.vue';
import Search from './components/search/index.vue';
import Seckill from './components/seckill/index.vue';
import SingleImage from './components/single-image/index.vue';
import { COMPONENT_TYPE, type Components, type PageBaseConfig, type PageConfig } from './types';
import { calcContainerOffsetTop } from './utils';

const userStore = useUserStore();
const instance = getCurrentInstance();
const { studentShopId } = toRefs(userStore);
const pageNo = ref('');
const zsdxPwd = ref('');
const baseConfig = ref<PageBaseConfig>({
    title_type: 1,
    title_text: '',
    title_image: '',
    title_background: '',
    icon_type: 1,
    header_type: 'transparent',
    background_color: '',
    share_config: {
        enable: false,
        title: '',
        desc: '',
        wx_mini_app_image: ''
    }
});
const itemList = ref<Components[]>([]);

function onShare() {
    const query = `pageNo=${pageNo.value}&studentShopId=${studentShopId.value}&zsdxPwd=${zsdxPwd.value}`;

    return {
        path: `/pages/shop/custom-page/index?${query}`,
        query,
        title: baseConfig.value.share_config.title,
        imageUrl: baseConfig.value.share_config.wx_mini_app_image
    };
}

onShareAppMessage(onShare);
onShareTimeline(onShare);

function initPage() {
    // 设置背景色
    uni.setBackgroundColor({
        backgroundColor: baseConfig.value.background_color
    });
    uni.setNavigationBarColor({
        frontColor: baseConfig.value.icon_type === 2 ? '#ffffff' : '#000000',
        backgroundColor:
            baseConfig.value.header_type === 'transparent'
                ? 'transparent'
                : baseConfig.value.title_background
    });

    // 是否隐藏分享按钮
    if (!baseConfig.value.share_config.enable) {
        uni.hideShareMenu({
            hideShareItems: ['shareAppMessage', 'shareTimeline']
        });
    }
}

async function getPageConfig() {
    const { result, pageConfig } = await getCustomPage(pageNo.value);

    if (result === -1) {
        uni.showToast({
            title: '页面不存在',
            icon: 'none'
        });
        return;
    }

    baseConfig.value = pageConfig.base_config;
    itemList.value = pageConfig.item_list;
    let trackData = {
        type: 'click',
        eventData: {
            path: 'bi_page',
            action: 1,
            student_shop_id: studentShopId.value,
            page_data_type: 'customPage',
            page_data_info: pageConfig.base_config
        }
    };

    clickTrack(trackData);
    initPage();
}

async function calcOffsetTop() {
    return await calcContainerOffsetTop(instance, '.page-wrap');
}

onLoad(async options => {
    pageNo.value = options?.pageNo;

    provide('customPageNo', pageNo.value);
    zsdxPwd.value = await userStore.getShareZsdxPwd();
});

onShow(() => {
    getPageConfig();
});
</script>

<template>
    <view
        class="page-wrap"
        :style="{ backgroundColor: baseConfig.background_color }"
    >
        <page-header :base-config="baseConfig" />

        <template
            v-for="(item, index) in itemList"
            :key="index"
        >
            <!-- 搜索组件 -->
            <search
                v-if="item.type === COMPONENT_TYPE.SEARCH"
                :data="item.data"
                :style-config="item.style"
            />
            <!-- 单图组件 -->
            <single-image
                v-if="item.type === COMPONENT_TYPE.SINGLE_IMAGE"
                :data="item.data"
                :style-config="item.style"
            />

            <!-- 多图拼凑组件 -->
            <multi-image
                v-if="item.type === COMPONENT_TYPE.MULTI_IMAGE"
                :data="item.data"
                :style-config="item.style"
            />

            <!-- 商品分组 -->
            <goods-group
                v-if="item.type === COMPONENT_TYPE.GOODS_GROUP"
                :data="item.data"
                :style-config="item.style"
                :base-config="baseConfig"
                :get-offset-top="calcOffsetTop"
            />

            <!-- 自定义商品 -->
            <custom-goods
                v-if="
                    item.type === COMPONENT_TYPE.CUSTOM_GOODS ||
                    item.type === COMPONENT_TYPE.HOT_GOODS
                "
                :data="item.data"
                :style-config="item.style"
                :base-config="baseConfig"
            />

            <!-- 优惠券 -->
            <coupon
                v-if="item.type === COMPONENT_TYPE.COUPON"
                :data="item.data"
                :style-config="item.style"
            />

            <packet
                v-if="item.type === COMPONENT_TYPE.PACKET"
                :data="item.data"
                :style-config="item.style"
            />

            <!-- 限时秒杀 -->
            <seckill
                v-if="item.type === COMPONENT_TYPE.SECKILL"
                :data="item.data"
                :style-config="item.style"
            />

            <!-- 组合包 -->
            <compose-package
                v-if="item.type === COMPONENT_TYPE.COMPOSE_PACKAGE"
                :data="item.data"
                :style-config="item.style"
            />
        </template>
    </view>
</template>

<style lang="scss" scoped>
.page-wrap {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    min-height: 100%;
}
</style>
