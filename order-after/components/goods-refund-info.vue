<script setup lang="ts">
import type ZdDrewerBottom from '@zsdx/mp-material/dist/lib/components/zd-drawer-bottom/index.vue';

import debounce from '@/utils/tools/debounce';

import { fetchOrderPreInfo, getReasonList } from '../../api/order-after';
import { EnumOrderAfterType } from '../../api/order-after/types/constants';
import type { CancelApplyReq, ReasonItem } from '../../api/order-after/types/order-after-list';
import { formKey, RECEIVE_STATUS_LIST, RESULT_STATUS_LIST } from '../constants';
import BaseCard from './base-card.vue';

const props = defineProps<{
    /** 售后类型 */
    type: EnumOrderAfterType;
}>();

const zdDrawerRef1 = ref<InstanceType<typeof ZdDrewerBottom> | null>(null);
const zdDrawerRef2 = ref<InstanceType<typeof ZdDrewerBottom> | null>(null);
const tooltipRef = ref();

const form = inject(formKey) as CancelApplyReq;
/** 是否收获 */
const isReceive = ref<string>('');
/** 原因 */
const reason = ref<string>('');

/** 是否收获列表 */
const isReceiveStatusList = ref(RECEIVE_STATUS_LIST);
/** 原因列表 */
const reasonList = ref<ReasonItem[]>([]);
/** 强制刷新 */
const refresh = ref(true);

onMounted(() => {
    if (props.type === EnumOrderAfterType.REFUND) {
        selectIsReceive(0);
    }
});

function selectReason(item: ReasonItem) {
    reason.value = item.content;
    form.reason = item.content;
    form.reasonId = item.id + '';
    zdDrawerRef2.value?.close();
}

function selectIsReceive(item: number) {
    isReceive.value = isReceiveStatusList.value[item].label;
    form.receiveGoods = item;
    zdDrawerRef1.value?.close();

    getReasonList_(item === 0 ? 2 : 1);
}

/** money 重置 */
const resetMoney = debounce(() => {
    refresh.value = false;
    form.money = parseFloat(form?._price ?? '0').toFixed(2);
    setTimeout(() => {
        refresh.value = true;
    }, 10);
}, 500);

/** num 输入以及校验 */
function numInput(str: string) {
    if (isNaN(parseFloat(str))) {
        if (str) {
            resetMoney();
            return uni.showToast({
                title: '金额输入有误',
                icon: 'none'
            });
        }
    }
    if (parseFloat(str) > (form?._price ?? '0') * 1) {
        resetMoney();
        uni.showToast({
            title: '退款金额超过最大可退金额',
            icon: 'none'
        });
    } else {
        form.money = str;
    }
    getFastRefundInfo(form._goodsNo ?? '', parseFloat(form.money ?? ''));
}

/** 获取先快速退款信息 */
async function getFastRefundInfo(goodsNo: string, price: number) {
    const resp = await fetchOrderPreInfo({
        goodsNo,
        shopNo: form._shopNo ?? '',
        studentShopId: form._studentShopId ?? ''
    });
    if (resp && form) {
        form.fastRefundAccount = resp.fastRefundAccount || '';
        form.fastRefundAccountName = resp.fastRefundAccountName || '';

        if (price * 1 <= resp.amount * 1) {
            form._canUseQuickRefund = resp.showRefundBeforeReturn ? true : false;
            form._forbidQuickRefund = resp.showRefundBeforeReturn ? false : true;
        } else {
            form._canUseQuickRefund = false;
        }
    }
}

/** 获取缘由列表 */
async function getReasonList_(status: number) {
    const resp = await getReasonList({
        orderStatus: status ?? 0
    });
    reasonList.value = resp;
}
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
        header-text="退款信息"
        class="goods-refund-info"
    >
        <uni-list :border="false">
            <uni-list-item
                class="list-item"
                :show-arrow="props.type !== EnumOrderAfterType.REFUND"
                :right-text="isReceive || '请选择'"
                @tap="props.type !== EnumOrderAfterType.REFUND ? zdDrawerRef1?.open() : () => {}"
            >
                <template #header>
                    <text class="label"> <text style="color: red">*</text>是否收到货 </text>
                </template>
            </uni-list-item>
            <uni-list-item
                :right-text="reason || '请选择'"
                show-arrow
                @tap="zdDrawerRef2?.open()"
            >
                <template #header>
                    <text class="label"> <text style="color: red">*</text>退款原因 </text>
                </template>
            </uni-list-item>
            <template v-if="props.type !== EnumOrderAfterType.EXCHANGE">
                <uni-list-item class="list-item">
                    <template #header>
                        <view
                            class="label-wrapper"
                            style="width: 400rpx"
                        >
                            <view class="label"> 退款金额 </view>
                            <template
                                v-if="
                                    props.type === EnumOrderAfterType.REFUND_RETURN &&
                                    form._canUseQuickRefund &&
                                    !form._forbidQuickRefund
                                "
                            >
                                <view class="label-tag">先退款后退货</view>
                                <zd-icon
                                    :size="32"
                                    type="zdmp-jieshi"
                                    color="#199FFF"
                                    @tap="tooltipRef?.open?.()"
                                />
                            </template>
                        </view>
                    </template>
                    <template #footer>
                        <uni-easyinput
                            v-if="refresh"
                            :value="form.money"
                            error-message
                            :input-border="false"
                            :clearable="false"
                            type="number"
                            :placeholder="form._price || '请输入内容'"
                            @input="numInput"
                        ></uni-easyinput>
                    </template>
                </uni-list-item>
                <view class="extra">
                    可修改，最多
                    <zd-price
                        :font-size-large="32"
                        :font-size-small="32"
                        :font-size-unit="24"
                        color="#292F33"
                        :value="form._price"
                    />
                </view>
                <view
                    v-if="
                        props.type === EnumOrderAfterType.REFUND_RETURN && form._canUseQuickRefund
                    "
                    class="extra"
                    style="margin-top: 42rpx; font-size: 24rpx"
                >
                    <zd-checkbox v-model="form._forbidQuickRefund"></zd-checkbox>

                    <text style="margin-left: 10rpx">不使用先退款后退货</text>
                </view>
            </template>
        </uni-list>
    </base-card>

    <zd-drawer-bottom
        ref="zdDrawerRef1"
        header-text="是否收到货"
    >
        <view
            v-for="(item, index) in isReceiveStatusList"
            :key="index"
            class="reason-item"
            @tap="selectIsReceive(item.value)"
        >
            <view> {{ item.label }} </view>
            <view class="radio">
                <zd-icon
                    v-if="form?.receiveGoods === item.value"
                    type="zdmp-yigouxuan1"
                    :size="32"
                    color="#20A0FF"
                />
            </view>
        </view>
    </zd-drawer-bottom>
    <zd-drawer-bottom
        ref="zdDrawerRef2"
        header-text="退款原因"
    >
        <view
            v-for="(item, index) in reasonList"
            :key="index"
            class="reason-item"
            @tap="selectReason(item)"
        >
            <view> {{ item?.content }} </view>
            <view class="radio">
                <zd-icon
                    v-if="form?.reason === item.content"
                    type="zdmp-yigouxuan1"
                    :size="28"
                    color="#20A0FF"
                />
            </view>
        </view>
    </zd-drawer-bottom>
    <uni-popup
        ref="tooltipRef"
        type="center"
    >
        <view class="tooltip">
            校园代理审核通过后您将享受先退款后退货服务，相应退款将打入您填写的支付宝账号中
        </view>
    </uni-popup>
</template>

<style scoped lang="scss">
.goods-refund-info {
    :deep(.uni-list-item) {
        border: none;
    }
    :deep(.uni-list-item__container) {
        padding-left: 0;
    }

    :deep(input) {
        height: 40rpx;
        text-align: right;
        font-family: 'Bebas Neue' !important;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .list-item {
        min-height: 100rpx;
        .label-wrapper {
            display: flex;
            align-items: center;
            .label {
                color: $uni-color-title;
                font-size: 28rpx;
            }
            .label-tag {
                height: 32rpx;
                margin: 0 10rpx;
                padding: 0 8rpx;
                border: 2rpx solid $zd-main-color;
                border-radius: 6rpx;
                color: $zd-main-color;
                font-size: 20rpx;
                line-height: 32rpx;
            }
        }
        :deep(.uni-list-item__content-title) {
            font-weight: bold;
        }
        :deep(.uni-list-item__extra-text) {
            display: block;
            overflow: hidden;
            max-width: 400rpx;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 28rpx;
        }
    }
    .extra {
        display: flex;
        align-items: flex-end;
        color: $uni-color-paragraph;
        font-size: 24rpx;
        line-height: 24rpx;
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

.tooltip {
    width: 80vw;
    box-sizing: border-box;
    padding: 40rpx;
    border-radius: 20rpx;
    text-align: center;
    background-color: #fff;
}
</style>
