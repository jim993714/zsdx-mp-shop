<script setup lang="ts">
import type { CustomGoodsData, GoodsGroupStyle, PageBaseConfig } from '../../types';
import GoodsList from '../common/goods-list.vue';

const props = withDefaults(
    defineProps<{
        data: CustomGoodsData;
        styleConfig: GoodsGroupStyle;
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
</script>

<template>
    <view
        class="custom-goods"
        :style="{ backgroundColor: props.styleConfig.backgroundColor }"
    >
        <goods-list
            :data="props.data.goods_list"
            :style-config="props.styleConfig"
            :base-config="props.baseConfig"
        />
    </view>
</template>

<style lang="scss" scoped>
.custom-goods {
    padding-top: 20rpx;
}
</style>
