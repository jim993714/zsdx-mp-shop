<script setup lang="ts">
import ZdPopup from '@zsdx/mp-material/dist/lib/components/zd-popup/index.vue';
import { ref } from 'vue';

import { updateAccountInfo } from '../../api/order-after';
import type { FastRefundAccountReq } from '../../api/order-after/types/fast-refund';

type Form = FastRefundAccountReq;

const props = withDefaults(
    defineProps<{
        applyNo: string;
        fastRefundAccount: string;
        fastRefundAccountName: string;
    }>(),
    {
        fastRefundAccountName: '',
        fastRefundAccount: '',
        applyNo: ''
    }
);

const zdPopupRef = ref<InstanceType<typeof ZdPopup> | null>(null);

const form = reactive<Form>({ ...props });

watch(props, val => {
    form.fastRefundAccountName = val.fastRefundAccountName;
    form.fastRefundAccount = val.fastRefundAccount;
    form.applyNo = val.applyNo;
});

function open() {
    zdPopupRef.value?.open();
}

function close() {
    zdPopupRef.value?.close();
}

async function confirm() {
    let title = '';
    if (!form.fastRefundAccountName) title = '请填写支付宝认证真实名称';
    if (!form.fastRefundAccount) title = '请填写支付宝账号';
    if (title) {
        return uni.showToast({
            title,
            icon: 'none'
        });
    }

    try {
        await updateAccountInfo(form);
        setTimeout(() => {
            emits('confirm', form);
            close();
        }, 200);
    } catch (err: any) {
        uni.showToast({
            icon: 'none',
            title: err.msg
        });
    }
}

const emits = defineEmits<{
    (e: 'confirm', payload: Form): void;
}>();

defineExpose({
    open,
    close
});
</script>

<template>
    <zd-popup
        ref="zdPopupRef"
        type="center"
    >
        <view class="content">
            <view class="header"> 退款支付宝收款账户 </view>
            <view class="form">
                <view class="form-item">
                    <uni-easyinput
                        v-model="form.fastRefundAccount"
                        :input-border="false"
                        placeholder="请输入手机号/邮箱"
                    ></uni-easyinput>
                </view>
                <view class="form-item">
                    <uni-easyinput
                        v-model="form.fastRefundAccountName"
                        :input-border="false"
                        placeholder="请输入对应支付宝账号认证的真实姓名"
                    ></uni-easyinput>
                </view>
            </view>
            <view class="footer-btn">
                <zd-button
                    type="outline"
                    :button-style="{
                        width: '240rpx',
                        borderColor: '#8A9399',
                        color: '#8A9399',
                        fontSize: '32rpx'
                    }"
                    @tap="close"
                >
                    取消
                </zd-button>
                <zd-button
                    type="primary"
                    :button-style="{
                        width: '240rpx',
                        fontSize: '28rpx'
                    }"
                    @tap="confirm"
                >
                    提交
                </zd-button>
            </view>
        </view>
    </zd-popup>
</template>

<style scoped lang="scss">
.content {
    z-index: 200;
    width: 582rpx;
    height: 448rpx;
    padding: 40rpx;
    border-radius: 32rpx;
    background-color: #fff;
    box-sizing: border-box;
}
.header {
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
}
.form {
    margin: 36rpx 0;
}
.form-item {
    display: flex;
    align-items: center;
    overflow: hidden;
    margin: 12rpx 0;
    border: 2rpx solid #edf0f2;
    border-radius: 12rpx;

    .label {
        height: 70rpx;
        padding-left: 20rpx;
        font-size: 28rpx;
        flex: 1;
        line-height: 70rpx;
        .placeholder {
            color: $uni-text-color-placeholder;
            font-size: 24rpx;
        }
    }
    .icon {
        padding-right: 20rpx;
        color: rgba($color: #000000, $alpha: 0.5);
    }
}
.footer-btn {
    display: flex;
    justify-content: space-between;
}
</style>
