<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { CDN_BASE_URL } from '@/base/constants';

import useStudentAuth from './useStudentAuth';

const props = withDefaults(
    defineProps<{
        content: string;
    }>(),
    {
        content: '完成学生认证后可使用校内员工送货到寝服务'
    }
);

const popup = ref();

const { getAuthStatus, validate, toStudentAuth } = useStudentAuth(popup);

const emits = defineEmits<{
    (event: 'cancel'): void;
}>();

onBeforeMount(() => {
    console.log('studentAuth');
    // TODO 确定是否每次都要获取最新认证信息?
    getAuthStatus();
});

function cancel() {
    emits('cancel');
    popup.value.close();
}

defineExpose({
    validate,
    toStudentAuth,
    open: () => popup.value.open(),
    close: () => popup.value.close()
});
</script>

<template>
    <zd-popup
        ref="popup"
        :is-mask-click="false"
        type="center"
    >
        <view class="student-dialog">
            <image :src="CDN_BASE_URL + '/mp-cs/images/ucenter/student-verify-banner.png'" />
            <text class="student-dialog-title">请先完成学生认证</text>
            <text class="student-dialog-tips">{{ props.content }}</text>
            <view class="student-dialog-footer">
                <zd-button @tap="cancel">取消</zd-button>
                <zd-button
                    type="primary"
                    @tap="toStudentAuth"
                >
                    前往认证
                </zd-button>
            </view>
            <view
                class="student-dialog-close"
                @tap="cancel"
            >
                <zd-icon
                    type="zdmp-guanbidefuben"
                    :size="32"
                    color="#fff"
                />
            </view>
        </view>
    </zd-popup>
</template>

<style scoped lang="scss">
.student-dialog {
    position: relative;
    display: flex;
    align-items: center;
    width: 582rpx;
    height: 640rpx;
    border-radius: 32rpx;
    background: #ffffff;
    flex-direction: column;
    gap: 40rpx;

    > image {
        width: 100%;
        height: 248rpx;
    }

    &-title {
        color: $uni-color-title;
        font-size: 36rpx;
        font-weight: 500;
        line-height: 36rpx;
    }

    &-tips {
        width: 502rpx;
        text-align: center;
        color: $uni-color-paragraph;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 44rpx;
    }

    &-footer {
        display: flex;
        align-items: center;
        gap: 42rpx;

        > zd-button {
            width: 230rpx;
        }
    }

    &-close {
        position: absolute;
        top: 24rpx;
        right: 24rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40rpx;
        height: 40rpx;
        border: 4rpx solid #fff;
        border-radius: 24rpx;
    }
}
</style>
