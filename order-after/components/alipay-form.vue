<script setup lang="ts">
import { formKey } from '../constants';
import BaseCard from './base-card.vue';

const form = inject(formKey)!;
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <base-card
        header-text="退款支付宝收款账户"
        class="goods-refund-info"
    >
        <uni-list :border="false">
            <uni-list-item
                class="list-item"
                :show-arrow="false"
            >
                <template #header>
                    <text class="label"> <text style="color: red">*</text>支付宝账号 </text>
                </template>
                <template #footer>
                    <uni-easyinput
                        v-model="form.fastRefundAccount"
                        error-message
                        :input-border="false"
                        :clearable="false"
                        placeholder="请输入手机号/邮箱"
                    ></uni-easyinput>
                </template>
            </uni-list-item>
            <uni-list-item
                :show-arrow="false"
                class="list-item"
            >
                <template #header>
                    <text class="label"> <text style="color: red">*</text>真实姓名 </text>
                </template>
                <template #footer>
                    <uni-easyinput
                        v-model="form.fastRefundAccountName"
                        error-message
                        :input-border="false"
                        :clearable="false"
                        placeholder="请输入对应支付宝账号认证的真实姓名"
                    ></uni-easyinput>
                </template>
            </uni-list-item>
        </uni-list>
    </base-card>
</template>

<style scoped lang="scss">
.goods-refund-info {
    :deep(.uni-list-item) {
        border: none;
    }
    :deep(.uni-list-item__container) {
        padding-left: 0;
    }

    .list-item {
        min-height: 100rpx;
        font-size: 28rpx;
        .label {
            color: $uni-color-title;
            font-size: 28rpx;
            font-weight: bold;
            line-height: 70rpx;
        }

        :deep(.uni-list-item__extra-text) {
            display: block;
            overflow: hidden;
            max-width: 400rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
        }
        :deep(.uni-easyinput__content-input) {
            display: block;
            overflow: hidden;
            width: 400rpx;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
        }
    }
    .extra {
        display: flex;
        align-items: center;
        color: $uni-color-paragraph;
        font-size: 24rpx;
    }
}
</style>
