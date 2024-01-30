<script setup lang="ts">
import type { GoodsDetail, GoodsTag } from '../../api/goods-detail/types';

const props = withDefaults(
    defineProps<{
        serviceList: GoodsTag[];
        goodsDetail: GoodsDetail;
    }>(),
    {
        serviceList: () => {
            return [];
        }
    }
);

const emit = defineEmits(['goExpose']);
const drawerRef = ref();
const open = () => {
    drawerRef?.value?.open();
};
const close = () => {
    drawerRef?.value?.close();
};
const fnGoExpose = () => {
    console.log(props.goodsDetail);
    emit('goExpose');
};
defineExpose({
    open
});
</script>
<template>
    <zd-drawer-bottom
        ref="drawerRef"
        header-text="服务保障"
    >
        <view class="drawer-main">
            <view
                v-for="(item, index) in serviceList"
                :key="index"
                class="rule"
            >
                <view class="rule-head">
                    <view class="rule-head-title ellipsis">{{ item.title }}</view>
                    <view
                        v-if="index === 0 && goodsDetail.goodsShowPriceType === 2"
                        class="rule-head-link"
                        @tap="fnGoExpose"
                    >
                        爆料低价
                    </view>
                </view>
                <view class="rule-content">
                    {{ item.desc }}
                </view>
            </view>
        </view>
        <view class="pop-footer savepadding">
            <zd-button
                type="primary"
                :button-style="{
                    width: '670rpx',
                    height: '80rpx',
                    fontSize: '32rpx'
                }"
                @tap="close()"
            >
                确定
            </zd-button>
        </view>
    </zd-drawer-bottom>
</template>
<style lang="scss" scoped>
.pop-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 120rpx;
    background: #ffffff;
    flex-direction: row;
}
.drawer-main {
    overflow: hidden auto;
    width: 750rpx;
    flex: 1;
}

.rule {
    width: 670rpx;
    margin: 30rpx 40rpx 0;
    padding-bottom: 30rpx;
}
.rule-head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100;
    padding-left: 20rpx;
    border-left: 8rpx solid $uni-color-primary;
    flex-direction: row;
    box-sizing: border-box;
    &-title {
        width: 308px;
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 600;
        flex: 1;
        line-height: 28rpx;
    }
    &-link {
        color: $uni-color-primary;
        font-size: 24rpx;
        line-height: 28rpx;
    }
}
.rule-content {
    width: 100%;
    margin-top: 24rpx;
    padding-left: 28rpx;
    text-align: justify;
    color: #8a9399;
    font-size: 24rpx;
    box-sizing: border-box;
    line-height: 36rpx;
}
</style>
