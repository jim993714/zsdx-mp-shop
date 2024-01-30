<script setup lang="ts">
import type { OrderItem } from '../../api/order-after/types/order-after-list';
import goodsCardMulti from './goods-card-multi.vue';
import GoodsCardSingle from './goods-card-single.vue';

const props = withDefaults(
    defineProps<{
        /** 是否现实 foote */
        showFooter?: boolean;

        showStatus?: boolean;

        /** 订单编号 */
        orderNo?: string;

        /** 子订单编号 */
        index?: string[];

        /** 禁止组件内自动请求 */
        forbidReq?: boolean;
        /** 外部数据, 当作为列表时使用，使用前请打开禁止组件内自动请求 */
        item?: OrderItem | OrderItem[];

        /** 检测是否需要极速退款 */
        fastCheck?: boolean;
    }>(),
    {
        showFooter: false,
        showStatus: false
    }
);
</script>
<template>
    <goods-card-single
        v-if="!props.index || props.index?.length <= 1"
        v-bind="props"
        :item="Array.isArray(props.item) ? props.item[0] : props.item"
    >
        <template #right> <slot name="right" /></template>
    </goods-card-single>
    <goods-card-multi
        v-if="props.index && props.index?.length > 1"
        v-bind="props"
        :item="((Array.isArray(props.item) ? props.item : [props.item]) as OrderItem[])"
    >
        <template #right> <slot name="right" /></template>
    </goods-card-multi>
</template>
