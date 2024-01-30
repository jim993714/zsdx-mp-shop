<script setup lang="ts">
import { getCustomPageData } from '../../../api/custom-page/index';
import {
    COMPONENT_TYPE_FOR_DATA,
    type GoodsGroupCategory,
    type GoodsGroupData,
    type GoodsGroupStyle,
    type PageBaseConfig
} from '../../types';
import { calcContainerOffsetTop } from '../../utils';
import GoodsList from '../common/goods-list.vue';

const props = withDefaults(
    defineProps<{
        data: GoodsGroupData;
        styleConfig: GoodsGroupStyle;
        getOffsetTop: () => Promise<number>;
        baseConfig: PageBaseConfig;
    }>(),
    {
        styleConfig: () => ({
            fixHeader: 1,
            headerActiveBackgroundColor: 'rgba(255, 91, 73, 1)',
            headerBackgroundColor: '',
            headerActiveColor: '#fff',
            headerColor: '#000',
            headerBackgroundImage: '',
            pageMargin: 0,
            goodsMargin: 30,
            columns: 2,
            goodsButton: {
                show: 0,
                text: '立即购买',
                backgroundColor: ''
            },
            goodsTag: {
                show: 0,
                left: 30,
                top: 0,
                url: '',
                type: 0,
                width: 60,
                height: 60
            },
            goodsBorderRadius: '16rpx',
            backgroundColor: 'rgba(255, 186, 161, 1)',
            mBottom: 0
        })
    }
);

const instance = getCurrentInstance();
const categoryList = ref<GoodsGroupCategory[]>([]);

const activeIndex = ref(0);
const navbarHeight = ref(0);

async function onTabChange(index: number) {
    if (index === activeIndex.value) return;
    activeIndex.value = index;

    const currentTab = categoryList.value[index];

    if (!currentTab.init) {
        getData(1, index);
    }

    const parentTop = await props.getOffsetTop();
    const tabTop = await calcContainerOffsetTop(instance, '.tab-wrap');

    console.log(parentTop, tabTop);

    // 跳转到顶部
    uni.pageScrollTo({
        duration: 0,
        selector: '.tab-wrap',
        scrollTop: tabTop - parentTop - navbarHeight.value
    });
}

async function getData(pageId = 1, tabIndex: number) {
    const currentTab = categoryList.value[tabIndex];
    const dataJson = JSON.stringify({
        page_id: pageId,
        param_str: categoryList.value[tabIndex].param_str
    });
    const {
        data: { page, list }
    } = await getCustomPageData({
        type: COMPONENT_TYPE_FOR_DATA.GOODS_GROUP,
        dataJson
    });

    currentTab.dataList = [...(currentTab.dataList || []), ...list];
    currentTab.page = page;

    if (!currentTab.init) {
        currentTab.init = true;
    }
}

function initData() {
    categoryList.value = props.data.category_list.map(item => {
        return {
            ...item,
            dataList: [],
            init: false,
            page: {
                next_page: 1
            }
        };
    });

    getData(1, 0);
}

onReachBottom(() => {
    const currentTab = categoryList.value[activeIndex.value];

    if (currentTab.page?.next_page === 0) return;

    if (currentTab.init) {
        getData(currentTab.page?.next_page, activeIndex.value);
    }
});

onMounted(() => {
    const { statusBarHeight } = uni.getSystemInfoSync();

    navbarHeight.value = (statusBarHeight as number) + uni.upx2px(88);

    initData();
});
</script>

<template>
    <view
        :style="{
            backgroundColor: props.styleConfig.backgroundColor,
            marginBottom: props.styleConfig.mBottom * 2 + 'rpx',
            minHeight: '100vh'
        }"
    >
        <scroll-view
            class="tab-wrap"
            scroll-x
            enable-passive
            :show-scrollbar="false"
            :scroll-with-animation="true"
            :scroll-into-view="`tab-${activeIndex}`"
            :style="{
                backgroundColor: props.styleConfig.headerBackgroundColor,
                position: props.styleConfig.fixHeader ? 'sticky' : 'relative',
                top: props.styleConfig.fixHeader ? navbarHeight + 'px' : '0'
            }"
        >
            <view class="tab-list">
                <view
                    v-for="(item, index) in categoryList"
                    :id="`tab-${index}`"
                    :key="index"
                    class="tab-item"
                    :style="{
                        color:
                            activeIndex === index
                                ? props.styleConfig.headerActiveColor
                                : props.styleConfig.headerColor,
                        backgroundColor:
                            activeIndex === index
                                ? props.styleConfig.headerActiveBackgroundColor
                                : props.styleConfig.headerBackgroundColor
                    }"
                    @click="onTabChange(index)"
                >
                    {{ item.title }}
                </view>
            </view>
        </scroll-view>

        <view
            v-for="(item, index) in categoryList"
            :key="index"
            class="tab-content"
        >
            <goods-list
                v-if="index === activeIndex"
                :nav-name="categoryList[activeIndex].title"
                :data="item.dataList || []"
                :style-config="props.styleConfig"
                :base-config="props.baseConfig"
            />
        </view>
    </view>
</template>

<style lang="scss" scoped>
.tab-wrap {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 100;
    width: 750rpx;
    height: 80rpx;
    white-space: nowrap;
    box-sizing: border-box;

    .tab-list {
        display: flex;
        align-items: center;
        height: 80rpx;
        gap: 20rpx;
        padding: 0 30rpx;
        .tab-item {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 56rpx;
            padding: 0 22rpx;
            border-radius: 68rpx;
        }
    }
}
</style>
