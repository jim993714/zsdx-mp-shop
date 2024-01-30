<script setup lang="ts">
import type { AgentConfig } from '../types';

const popup = ref();
const title = ref('校内员工代收说明');
const list = ref<
    {
        type: string;
        content: string;
    }[]
>([]);

const open = (type: number, config: AgentConfig) => {
    if (type === 1) {
        title.value = '校内送货到寝';
        list.value = [
            {
                type: 'normal',
                content: '送货到寝服务是由掌上大学的校内员工提供代收快递包裏并送货到寝室的服务。'
            }
        ];
    } else if (type === 2) {
        title.value = '说明';
        let subContent = '';
        switch (config?.enable) {
            case 0:
            case 1:
                subContent =
                    '该校园店支持本校快递代收取送服务。送件时间为' + config?.deliveryTimeStr + '。';
                break;
            case -1:
                subContent = '该校园店暂时无法提供快递代收服务';
                break;
            case -2:
                subContent = '未进行校园认证，校园店暂时无法提供快递代收服务';
                break;
            case -3:
                subContent = '非校园店订单';
                break;
            case -4:
                subContent = '非同校订单';
                break;
            case -5:
                subContent = '该校园店暂时关闭快递代收服务，原因：' + config?.closeReason + '。';
                break;
            default:
                subContent = '该校园店暂时关闭快递代收服务';
                break;
        }
        list.value = [
            {
                type: 'normal',
                content: subContent
            }
        ];
    }
    popup.value.open('center');
};
const close = () => {
    popup.value.close();
};

defineExpose({
    open
});
</script>
<template>
    <uni-popup
        ref="popup"
        mask-background-color="rgba(0,0,0,0.6)"
    >
        <view class="pop-main">
            <view class="pop-title">{{ title }}</view>
            <view class="pop-content">
                <view
                    v-for="(item, index) in list"
                    :key="index"
                    class="pop-content-line"
                >
                    {{ item.content }}
                </view>
            </view>
            <view
                class="pop-btn"
                @tap="close"
                >知道啦</view
            >
        </view>
    </uni-popup>
</template>
<style lang="scss" scoped>
.pop-main {
    position: relative;
    display: flex;
    align-items: center;
    width: 582rpx;
    padding: 48rpx 0;
    box-sizing: border-box;
    border-radius: 32rpx;
    background-color: #fff;
    flex-direction: column;
}
.pop-title {
    margin-bottom: 40rpx;
    text-align: center;
    color: $uni-text-color;
    font-size: 36rpx;
    font-weight: 500;
    line-height: 36rpx;
}
.pop-content {
    display: flex;
    align-items: flex-start;
    width: 80%;
    margin-bottom: 16rpx;
    flex-direction: row;
    flex-wrap: wrap;
    &-line {
        color: #666666;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 44rpx;
    }
}
.pop-btn {
    width: 442rpx;
    height: 80rpx;
    margin-top: 60rpx;
    border-radius: 40rpx;
    text-align: center;
    color: #ffffff;
    font-size: 28rpx;
    background: linear-gradient(to right, #19dfa9, #20a0ff);
    line-height: 80rpx;
}
</style>
