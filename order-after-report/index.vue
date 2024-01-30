<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import type ZdDrewerBottom from '@zsdx/mp-material/dist/lib/components/zd-drawer-bottom/index.vue';
import { router } from '@zsdx/mp-utils';

import { uploadImage } from '@/api/common';

import { addDispute, fetchOrderCancelApplyDetail, getDisputeReasion } from '../api/order-after';
import type { Reason, ReasonDetail } from '../api/order-after/types/dispute';
import type { OrderCancelApplyDetailResp } from '../api/order-after/types/order-after-details';

const content = ref('');

const zdPopupRef1 = ref<InstanceType<typeof ZdDrewerBottom> | null>(null);
const zdPopupRef2 = ref<InstanceType<typeof ZdDrewerBottom> | null>(null);
const imagePreviewRef = ref<InstanceType<typeof ZdDrewerBottom> | null>(null);

const reasonList = ref<Reason[]>([]);
const typeList = ref<ReasonDetail[]>([]);
const reason = ref<Reason>();
const type = ref<ReasonDetail>();

let uploadImages = ref<string[]>([]);
let applyNo = '';
const detail = ref<OrderCancelApplyDetailResp>({} as any);
const currentImage = ref<string>('');

function chooseImage() {
    uni.chooseImage({
        count: 5 - uploadImages.value.length,
        sourceType: ['album', 'camera'],
        sizeType: ['original', 'compressed'],
        success: async res => {
            const list = (
                Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles]
            ) as UniApp.ChooseImageSuccessCallbackResultFile[];

            const data = (
                await Promise.all(list.map(image => uploadImage(image.path, image.size)))
            ).map(item => item.url);

            uploadImages.value = [...uploadImages.value, ...data];
        }
    });
}

function deleteImage(i: number) {
    uploadImages.value.splice(i, 1);
}

async function getDetail() {
    const resp = await fetchOrderCancelApplyDetail({
        applyNo: applyNo
    });
    console.log('商品详情', resp);
    detail.value = resp;
}

function selectReason(item: Reason) {
    reason.value = item;
    typeList.value = item.reasonDetailList ?? [];
    zdPopupRef1.value?.close();
}

function selectType(item: ReasonDetail) {
    type.value = item;
    zdPopupRef2.value?.close();
}

/**
 * 获取纠纷原因
 */
async function getDisputeList() {
    const resp = await getDisputeReasion();
    reasonList.value = resp;
}

function preview(i: number) {
    uni.previewImage({
        current: i,
        urls: uploadImages.value ?? []
    });
}

/**
 * 表单验证
 */
function validate(): string {
    if (!reason.value) return '请选择投诉原因';
    if (!type.value?.reasonDetail) return '请选择投诉类型';
    if (!content.value) return '请填写投诉说明';
    if (uploadImages.value.length <= 0) return '凭证不能为空';
    return '';
}

async function submit() {
    const resp = validate();
    if (resp) {
        return uni.showToast({
            title: resp,
            icon: 'none'
        });
    }
    try {
        const resp = await addDispute({
            applyNo: applyNo,
            evidence: uploadImages.value.join(','),
            reason: reason.value?.reason,
            reasonDetail: type.value?.reasonDetail,
            desc: content.value
        });
        uni.showToast({
            title: '申请成功',
            icon: 'success',
            success: () => {
                router.redirect('orderAfterReportDetail', {
                    disputeNo: resp
                });
            }
        });
    } catch (err) {
        return uni.showToast({
            title: (err as any).msg,
            icon: 'none'
        });
    }
}

onLoad(options => {
    applyNo = options?.applyNo;
    getDetail();
    getDisputeList();
});
</script>

<template>
    <view class="report">
        <view class="report-card"> 商家拒绝原因:{{ detail.refuseReason }} </view>
        <view class="report-card">
            <ui-list :border="false">
                <uni-list-item
                    show-arrow
                    class="list-item"
                    :right-text="reason?.reason ?? '请选择'"
                    :border="false"
                    @tap="zdPopupRef1?.open()"
                >
                    <template #header>
                        <text class="label"> <text style="color: red">*</text>投诉原因 </text>
                    </template>
                </uni-list-item>
                <uni-list-item
                    show-arrow
                    class="list-item"
                    :right-text="type?.reasonDetail ?? '请选择'"
                    @tap="zdPopupRef2?.open()"
                >
                    <template #header>
                        <text class="label"> <text style="color: red">*</text>选择投诉类型 </text>
                    </template>
                </uni-list-item>
            </ui-list>
        </view>
        <view class="report-card">
            <text class="label"> <text style="color: red">*</text>投诉说明 </text>
            <textarea
                v-model="content"
                class="report-textarea"
                placeholder="请输入投诉说明"
                placeholder-class="textarea-placeholder"
            />
        </view>
        <view class="report-upload">
            <view class="report-upload-tips">
                <text class="label">
                    <text style="color: red">*</text>
                    上传凭证（最多可上传五张）
                </text>
            </view>
            <view class="report-upload-content">
                <template
                    v-for="(image, i) in uploadImages"
                    :key="image"
                >
                    <view class="report-upload-content-wrapper">
                        <image
                            class="report-upload-content-wrapper-image"
                            :src="image"
                            @tap="preview(i)"
                        />
                        <view
                            class="report-upload-content-wrapper-close"
                            @tap="deleteImage(i)"
                        >
                            <zd-icon
                                type="zdmp-guanbidefuben"
                                :size="24"
                            />
                        </view>
                    </view>
                </template>
                <view
                    v-if="uploadImages.length < 5"
                    class="report-upload-content-btn"
                    @tap="chooseImage"
                >
                    <zd-icon
                        type="zdmp-xiangji"
                        :size="32"
                    />
                    上传凭证
                </view>
            </view>
        </view>
        <view class="report-submit">
            <zd-button
                style="width: 670rpx"
                type="primary"
                @tap="submit"
                >提交</zd-button
            >
        </view>
    </view>
    <zd-drawer-bottom
        ref="zdPopupRef1"
        type="bottom"
        header-text="投诉原因"
    >
        <view
            v-for="(item, index) in reasonList"
            :key="index"
            class="reason-item"
            @tap="selectReason(item)"
        >
            <view> {{ item.reason }} </view>
            <view class="radio">
                <zd-icon
                    v-if="reason?.reason === (item.reason || item)"
                    type="zdmp-yigouxuan1"
                    :size="32"
                    color="#20A0FF"
                />
            </view>
        </view>
    </zd-drawer-bottom>
    <zd-drawer-bottom
        ref="zdPopupRef2"
        type="bottom"
        header-text="投诉类型"
    >
        <view
            v-for="(item, index) in typeList"
            :key="index"
            class="reason-item"
            @tap="selectType(item)"
        >
            <view> {{ item.reasonDetail }} </view>
            <view class="radio">
                <zd-icon
                    v-if="type?.reasonDetail === (item.reasonDetail || item)"
                    type="zdmp-yigouxuan1"
                    :size="32"
                    color="#20A0FF"
                />
            </view>
        </view>
    </zd-drawer-bottom>
    <zd-popup
        ref="imagePreviewRef"
        type="center"
    >
        <image
            class="report-upload-content-wrapper-image"
            :src="currentImage"
            style="width: 600rpx"
            mode="widthFix"
        />
    </zd-popup>
</template>

<style scoped lang="scss">
.report {
    display: flex;
    width: 100%;
    min-height: 100vh;
    padding-bottom: 120rpx;
    background: #f5f8fa;
    flex-direction: column;
    gap: 20rpx;

    &-card {
        padding: 24rpx 30rpx;
        font-size: 28rpx;
        background-color: #fff;
        .list-item {
            :deep(.uni-list-item) {
                border: none;
            }
            :deep(.uni-list-item__container) {
                padding-left: 0;
            }
        }
        .label {
            font-size: 28rpx;
        }
    }

    &-textarea {
        width: 100%;
        height: 230rpx;
        margin-top: 20rpx;
        padding: 24rpx 0rpx;
        color: $uni-text-color;
        font-size: 28rpx;
        background: #fff;
        box-sizing: border-box;
    }

    :deep(.textarea-placeholder) {
        color: #8a9399;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 40rpx;
    }

    &-upload {
        display: flex;
        width: 100%;
        padding: 36rpx 30rpx;
        flex-direction: column;
        gap: 40rpx;
        box-sizing: border-box;
        background: #fff;

        &-tips {
            display: flex;
            align-items: center;
            color: $uni-text-color;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 32rpx;

            > text:last-of-type {
                color: $uni-color-paragraph;
                font-size: 24rpx;
                font-weight: 500;
                line-height: 32rpx;
            }
        }

        &-content {
            display: flex;
            align-items: center;
            gap: 20rpx;
            flex-wrap: wrap;
            &-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 198rpx;
                height: 198rpx;
                border: 2rpx solid rgba(138, 147, 153, 0.3);
                border-radius: 12rpx;
                color: #88909c;
                font-size: 24rpx;
                font-weight: 400;
                background: $uni-text-color-inverse;
                line-height: 24rpx;
                flex-direction: column;
                gap: 16rpx;
            }

            &-wrapper {
                position: relative;
                &-image {
                    display: block;
                    width: 198rpx;
                    height: 198rpx;
                    border-radius: 12rpx;
                }

                &-close {
                    position: absolute;
                    top: 10rpx;
                    right: 10rpx;
                }
            }
        }
    }

    &-submit {
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 120rpx;
        padding-bottom: calc(env(safe-area-inset-bottom));
        background: #fff;
    }
}

.reason-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 96rpx;
    padding: 0 40rpx;
    color: #333;
    line-height: 96rpx;
    .radio {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28rpx;
        height: 28rpx;
        border: 1px solid #d8d8d8;
        border-radius: 14rpx;
    }
}
</style>
