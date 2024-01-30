<script setup lang="ts">
import ZdImagePicker from '@zsdx/mp-material/dist/lib/components/zd-image-picker/index.vue';
import ZdSkuPop from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/index.vue';

import { uploadImage } from '@/api/common';

import type { GoodsDetail } from '../../api/goods-detail/types.ts';
import type { GoodReportReq } from '../../api/price-break/types';
import GoodsCard from './goods-card.vue';

const props = defineProps<{
    goodsDetail: GoodsDetail;
    specList: any;
}>();

const zdImagePickerRef = ref<InstanceType<typeof ZdImagePicker>>();
const zdSkuPopRef = ref<InstanceType<typeof ZdSkuPop>>();
const imageList = ref<[string, string, string]>(['', '', '']);
const currentIndex = ref(0);
const currentSku = ref();

const form = reactive<GoodReportReq>({
    productNo: '',
    reportPrice: '',
    url: '',
    imageUrls: ['', '', ''],
    spec: []
});

function priceInput(val: string) {
    console.log('===', parseFloat(val));
    form.reportPrice = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
}

function selectImage(currentIdx: number) {
    currentIndex.value = currentIdx;
    zdImagePickerRef.value?.open();
}

async function imageChange(images: any[], index: number) {
    const { url } = (await uploadImage(images[0].tempFilePath, images[0].size)) as any;

    form.imageUrls[index] = url;
    imageList.value[index] = url;
}

function formvalidate(): string {
    if (!form.reportPrice) return '同款低价不能为空';

    if (!form.url) return '同款链接不能为空';
    if (
        !/^(?:(http|https|ftp):\/\/)?((|[\w-]+\.)+[a-z0-9]+)(?:(\/[^/?#]+)*)?(\?[^#]+)?(#.+)?$/i.test(
            form.url
        )
    )
        return '请填入正确的链接';

    if (form.imageUrls.some(item => !item)) return '照片不能为空';
    return '';
}

function skuChange(item: any) {
    const product = props.specList.find((spec: any) => spec.productNo === item.productNo);
    form.productNo = item.productNo;
    form.spec = product['specList'].map((item: any) => ({
        ...item,
        name: item.name ?? ''
    }));
    console.log('sku', product);
    currentSku.value = product;
}

defineExpose({
    formvalidate,
    form
});
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <uni-list
        :border="false"
        class="list-container"
    >
        <view
            v-if="currentSku"
            class="goods-wrapper"
            @tap="zdSkuPopRef?.open()"
        >
            <goods-card
                :goods-detail="{
                    goodsUrl: currentSku.productImage,
                    goodsTitle: currentSku.goodsTitle,
                    spec: currentSku.specList,
                    price: currentSku.productPrice
                }"
            />
        </view>
        <template v-else>
            <uni-list-item
                class="list-item"
                title="商品规格"
                show-arrow
                :border="false"
                :right-text="'选择举报的商品规格'"
                @tap="zdSkuPopRef?.open()"
            >
            </uni-list-item>
            <view class="divider"></view>
        </template>

        <uni-list-item
            class="list-item"
            title="同款低价"
            :border="false"
        >
            <template #footer>
                <uni-easyinput
                    :value="form.reportPrice"
                    trim="all"
                    :input-border="false"
                    :clearable="false"
                    placeholder="填写其他平台旗舰店同款商品单价"
                    type="digit"
                    maxlength="7"
                    @input="priceInput"
                ></uni-easyinput>
            </template>
        </uni-list-item>
        <view class="divider"></view>
        <uni-list-item
            class="list-item"
            title="同款链接"
            :border="false"
        />
        <uni-easyinput
            v-model="form.url"
            trim="all"
            type="textarea"
            placeholder="填写其它平台旗舰店同款商品详情链接"
        ></uni-easyinput>
        <uni-list-item
            class="list-item"
            title="同款截图"
            :border="false"
        />
        <view class="image-wrapper">
            <view
                class="upload-card"
                @tap="selectImage(0)"
            >
                <image
                    v-if="form.imageUrls?.[0]"
                    :src="imageList[0]"
                    mode="widthFix"
                />
                <view
                    v-else
                    class="content"
                >
                    <zd-icon
                        type="zdmp-xiangce"
                        :size="50"
                        color="#8A9399"
                    />
                    <view class="upload-text">商品主图</view>
                </view>
            </view>
            <view
                class="upload-card"
                @tap="selectImage(1)"
            >
                <image
                    v-if="form.imageUrls?.[1]"
                    :src="imageList[1]"
                    mode="widthFix"
                />
                <view
                    v-else
                    class="content"
                >
                    <zd-icon
                        type="zdmp-xiangce"
                        :size="50"
                        color="#8A9399"
                    />
                    <view class="upload-text">规格截图</view>
                </view>
            </view>
            <view
                class="upload-card"
                @tap="selectImage(2)"
            >
                <image
                    v-if="form.imageUrls?.[2]"
                    :src="imageList[2]"
                    mode="widthFix"
                />
                <view
                    v-else
                    class="content"
                >
                    <zd-icon
                        type="zdmp-xiangce"
                        :size="50"
                        color="#8A9399"
                    />
                    <view class="upload-text"><view>确认订单页</view> <view>截图</view></view>
                </view>
            </view>
        </view>
    </uni-list>
    <zd-image-picker
        ref="zdImagePickerRef"
        header-text="选择图片"
        @change="(images:any[])=>imageChange(images, currentIndex)"
    >
    </zd-image-picker>
    <zd-sku-pop
        ref="zdSkuPopRef"
        :info="goodsDetail"
        :product-list="goodsDetail.productList"
        :spec-list="goodsDetail.specList"
        @submit="skuChange"
        @go-discount="skuChange"
    />
</template>

<style scoped lang="scss">
.list-container {
    width: 100%;
    :deep(.uni-list) {
        display: flex;
        align-items: flex-end;
        width: 100%;
        flex-direction: column;
    }
    .list-item {
        width: 100%;
        height: 84rpx;
        :deep(.uni-list-item) {
            height: 84rpx;
        }

        :deep(.uni-easyinput__content) {
            flex: 2;
            min-width: 500rpx;
        }
        :deep(.uni-list-item__container) {
            display: flex;
            align-items: center;
            padding: 0rpx !important;
        }
        :deep(.uni-icon-wrapper) {
            padding-right: 0;
        }
        :deep(input) {
            text-align: right;
            font-size: 28rpx;
        }
        :deep(.uni-list-item__content-title) {
            font-weight: bold;
        }
        :deep(.uni-list-item__extra-text) {
            display: block;
            overflow: hidden;
            max-width: 500rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
        }
    }
    :deep(.is-textarea) {
        width: 630rpx;
        box-sizing: border-box;
        font-size: 28rpx;
    }
    .divider {
        width: 475rpx;
        height: 2rpx;
        background-color: #f5f6f8;
    }
    .goods-wrapper {
        width: 100%;
        margin: 0;
        padding: 24rpx;
        border-radius: 12rpx;
        background-color: #f5f8fa;
        box-sizing: border-box;
    }
}

.image-wrapper {
    display: flex;
    justify-content: space-between;
    width: 630rpx;
    .upload-card {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 198rpx;
        height: 198rpx;
        border: 2rpx dashed rgba(138, 147, 153, 0.3);
        border-radius: 12rpx;
        background: rgba($color: #8a9399, $alpha: 0.1);
        box-sizing: border-box;
        .content {
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-top: 56rpx;
        }
        image {
            width: 198rpx;
            height: 198rpx;
        }
        .upload-text {
            padding: 0 10rpx;
            text-align: center;
            color: #999;
            font-size: 24rpx;
        }
    }
}
</style>
