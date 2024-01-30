<script setup lang="ts">
import ZdImagePicker from '@zsdx/mp-material/dist/lib/components/zd-image-picker/index.vue';

import { uploadImage } from '@/api/common';

import { EnumOrderAfterType } from '../../api/order-after/types/constants';
import { formKey } from '../constants';
import BaseCard from './base-card.vue';

interface Image {
    fileType: string;
    tempFilePath: string;
    size: number;
}

const zdImagePickerRef = ref<InstanceType<typeof ZdImagePicker>>();

const form = inject(formKey);

async function handleImageSelect(images: Image[]) {
    const resp = await Promise.all(images.map(item => uploadImage(item.tempFilePath, item.size)));

    if (form) {
        form.evidence = [...form.evidence!, ...resp.map(item => item.url)];
    }
}

function deleteImg(index: number) {
    form?.evidence?.splice(index, 1);
}

function preview(i: number) {
    uni.previewImage({
        current: i,
        urls: form?.evidence ?? []
    });
}
</script>

<template>
    <base-card
        :header-text="
            form?.type === EnumOrderAfterType.EXCHANGE ? '换货说明和凭证' : '退款说明和凭证'
        "
    >
        <view class="input-wrapper">
            <uni-easyinput
                v-model="form!.remark"
                type="textarea"
                :maxlength="300"
                placeholder="补充说明，有助于商家售后"
            ></uni-easyinput>
            <view class="num">{{ form!.remark?.length }}/300</view>
        </view>
        <view class="image-list">
            <view
                v-for="(item, index) in form?.evidence"
                :key="index"
                class="item img"
                :style="{
                    marginRight: (index + 1) % 3 === 0 ? 0 : '32rpx'
                }"
                @tap="preview(index)"
            >
                <image
                    class="img"
                    :src="item"
                    mode="aspectFill"
                />
                <view
                    class="close"
                    @tap.stop="deleteImg(index)"
                >
                    <zd-icon
                        style="height: 36rpx"
                        type="zdmp-guanbidefuben"
                        :size="24"
                        color="#fff"
                    />
                </view>
            </view>
            <zd-image-picker
                ref="zdImagePickerRef"
                :count="6 - (form?.evidence?.length ?? 0)"
                @change="handleImageSelect"
            >
                <view
                    v-if="(form?.evidence?.length ?? 0) < 6"
                    class="item upload"
                    @tap="zdImagePickerRef?.open()"
                >
                    <zd-icon
                        :size="40"
                        type="zdmp-xiangji"
                        color="#88909C"
                    />
                    <view class="text">上传凭证</view>
                </view>
            </zd-image-picker>
        </view>
    </base-card>
</template>

<style scoped lang="scss">
.input-wrapper {
    position: relative;
    .num {
        position: absolute;
        right: 16rpx;
        bottom: 16rpx;
        color: $uni-text-color-placeholder;
        font-size: 24rpx;
    }
}
.image-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .item {
        width: 198rpx;
        height: 198rpx;
        margin-top: 48rpx;
        border-radius: 12rpx;
        background-color: #f5f8fa;
    }
    .img {
        position: relative;
        width: 198rpx;
        height: 198rpx;
        border-radius: 12rpx;
        .close {
            position: absolute;
            top: -18rpx;
            right: -18rpx;
            width: 36rpx;
            height: 36rpx;
            border-radius: 18rpx;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.6);
            line-height: 36rpx;
        }
    }
    .upload {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0;
        border: 2rpx dashed rgba(138, 147, 153, 0.3);
        flex-direction: column;
        .text {
            margin-top: 16rpx;
            color: #88909c;
            font-size: 24rpx;
        }
    }
}
</style>
