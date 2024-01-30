<script setup lang="ts">
import type { IPackageTags } from '../../api/combination-package-goods-detail/types';
import type { GoodsDetail } from '../../api/goods-detail/types';
import serviceDialog from '../../components/goods-detail/service-pop.vue';

const props = withDefaults(
    defineProps<{
        goodsNo: string;
        goodsDetail: IPackageTags & GoodsDetail;
        showSpecial: boolean;
        serviceList: IPackageTags[];
    }>(),
    {
        showSpecial: false,
        serviceList: () => {
            return [];
        }
    }
);
const servicePopRef = ref();

const serviceText = computed(() => {
    let list = props.serviceList.map(item => item.title);

    return list.join(' · ');
});
const fnShowPop = () => {
    servicePopRef.value.open();
};
</script>
<template>
    <view
        v-if="serviceList.length > 0"
        class="service-wrap"
        @tap="fnShowPop"
    >
        <view class="service-text ellipsis">{{ serviceText }}</view>
        <zd-icon
            type="zdmp-qianwang"
            color="#199FFF"
            :size="32"
        ></zd-icon>
    </view>
    <serviceDialog
        ref="servicePopRef"
        :service-list="serviceList"
        :goods-detail="goodsDetail"
    />
</template>
<style lang="scss" scoped>
.service-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 710rpx;
    height: 88rpx;
    margin: 20rpx 20rpx 0rpx;
    padding: 0 20rpx;
    padding-bottom: 16rpx;
    border-radius: 16rpx 16rpx 0 0;
    background: linear-gradient(90deg, rgba(90, 228, 255, 0.1), rgba(25, 159, 255, 0.1));
    box-sizing: border-box;
    flex-direction: row;
}
.service-text {
    padding-right: 20rpx;
    color: #199fff;
    font-size: 24rpx;
    flex: 1;
    line-height: 32rpx;
    box-sizing: border-box;
}
</style>
