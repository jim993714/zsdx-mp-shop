<script setup lang="ts">
import ZdPopup from '@zsdx/mp-material/dist/lib/components/zd-popup/index.vue';
import { ref } from 'vue';

import LogisticsSelect from '@/components/logistics-select/index.vue';

import { getByTrackingNo } from '../../api/order-after';
import type { LogisticsItem } from '../../api/order-after/types/order-after-list';

const props = withDefaults(
    defineProps<{
        logisticsNo: string;
        logisticsName: string;
        trackingNo: string;
    }>(),
    {
        logisticsNo: '',
        logisticsName: '',
        trackingNo: ''
    }
);

const zdPopupRef = ref<InstanceType<typeof ZdPopup> | null>(null);
const logisticsSelectRef = ref<InstanceType<typeof LogisticsSelect>>();
const timer = ref<any>(null);

const form = reactive<{
    logisticsNo: string;
    logisticsName: string;
    trackingNo: string;
}>({ ...props });

watch(props, val => {
    form.logisticsName = val.logisticsName;
    form.logisticsNo = val.logisticsNo;
    form.trackingNo = val.trackingNo;
});

watch(
    () => form.trackingNo,
    newVal => {
        clearTimeout(timer.value);
        timer.value = setTimeout(async () => {
            await checkTracking(newVal);
        }, 100);
    }
);

async function checkTracking(val: string) {
    const resp = await getByTrackingNo({ trackingNo: val });
    form.logisticsNo = resp.logisticsNo;
    form.logisticsName = resp.logisticsName;
}

function open() {
    zdPopupRef.value?.open();
}

function close() {
    zdPopupRef.value?.close();
}

function handleOnChange(item: LogisticsItem) {
    console.log('fasdfa', item);
    form.logisticsName = item.name;
    form.logisticsNo = item.logisticsNo;
}

function scanBarCode() {
    uni.scanCode({
        onlyFromCamera: true,
        scanType: ['barCode', 'qrCode'],
        success(res) {
            form.trackingNo = res.result;
        }
    });
}

async function confirm() {
    let title = '';
    // 提交前检测一遍
    await checkTracking(form.trackingNo);
    // if (!form.logisticsNo) title = '请选择快递公司';
    if (!form.trackingNo) title = '请填写物流单号';
    if (title) {
        return uni.showToast({
            title,
            icon: 'none'
        });
    }
    emits('confirm', {
        logisticsNo: form.logisticsNo,
        trackingNo: form.trackingNo
    });
    close();
}

const emits = defineEmits<{
    (
        e: 'confirm',
        payload: {
            logisticsNo: string;
            trackingNo: string;
        }
    ): void;
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
            <view class="header"> 填写退货快递单号 </view>
            <view class="form">
                <!-- <view
                    class="form-item"
                    @tap="logisticsSelectRef?.open()"
                >
                    <view class="label">
                        <text v-if="form.logisticsName">{{ form.logisticsName }}</text>
                        <text
                            v-else
                            class="placeholder"
                        >
                            选择快递公司
                        </text>
                    </view>
                    <zd-icon
                        class="icon"
                        type="zdmp-qianwang"
                        :size="36"
                    ></zd-icon>
                </view> -->
                <view class="form-item">
                    <uni-easyinput
                        v-model="form.trackingNo"
                        :input-border="false"
                        placeholder="输入物流单号"
                    ></uni-easyinput>
                    <zd-icon
                        class="icon"
                        type="zdmp-xiangji"
                        :size="36"
                        @tap.stop="scanBarCode"
                    />
                </view>
                <view class="form-item form-item-extra"> {{ form.logisticsName }} </view>
            </view>
            <view class="footer-btn">
                <zd-button
                    type="outline"
                    :button-style="{
                        width: '240rpx',
                        borderColor: '#8A9399',
                        color: '#8A9399',
                        fontSize: '28rpx'
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
    <logistics-select
        ref="logisticsSelectRef"
        @change="handleOnChange"
    />
</template>

<style scoped lang="scss">
.content {
    z-index: 200;
    width: 582rpx;

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
    &-extra {
        margin: 10rpx 0;
        border: none;
        color: $zd-main-color;
        font-size: 28rpx;
    }
}
.footer-btn {
    display: flex;
    justify-content: space-between;
}
</style>
