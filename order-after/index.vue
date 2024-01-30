<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import { getDefaultAddress } from '@/api/order-confirm';
import defintPageProps from '@/utils/definePageProps/index';

import type { AddressItem } from '../api/address/types';
import {
    addOrderCancelApply,
    fetchOrderCancelApplyDetail,
    fetchOrderPreInfo
} from '../api/order-after/index';
import { EnumOrderAfterType, STATUS_MAP } from '../api/order-after/types/constants';
import type { CancelApplyReq } from '../api/order-after/types/order-after-list';
import AlipayForm from './components/alipay-form.vue';
import BaseCard from './components/base-card.vue';
import GoodsCard from './components/goods-card.vue';
import GoodsExchangeInfo from './components/goods-exchage-info.vue';
import GoodsRefundInfo from './components/goods-refund-info.vue';
import RefundInfoVoucher from './components/refund-info-voucher.vue';
import { formKey } from './constants';

defintPageProps<{
    type: EnumOrderAfterType;
}>();

const options = ref<{
    type: EnumOrderAfterType;
    orderNo: '';
    index: string[];
    mode?: 'add' | 'edit';
    applyNo?: string;
    multi?: string;
}>({
    type: 1,
    orderNo: '',
    index: [],
    mode: 'add',
    multi: ''
});

const goodsRefundInfoRef = ref<InstanceType<typeof GoodsRefundInfo>>();
const goodsExchangeInfoRef = ref<InstanceType<typeof GoodsExchangeInfo>>();
const exchangeAddress = ref<AddressItem>();
const form = reactive<CancelApplyReq>({
    orderNo: '',
    index: [],
    type: options.value?.type ?? 1,
    num: 0,
    money: '',
    receiveGoods: -1,
    reason: '',
    remark: '',
    evidence: [],
    addressId: 0,
    reasonId: '0',
    fastRefund: 0,
    fastRefundAccount: '',
    fastRefundAccountName: '',
    _useQuickRefund: false,
    _price: 0,
    _shopNo: '',
    _studentShopId: ''
});

provide(formKey, form);

defintPageProps<{
    type: number;
    orderNo: '';
    index: string;
    mode?: 'add' | 'edit';
    applyNo?: string;
    multi?: string;
}>(options_ => {
    options.value.type = options_?.type * 1;
    options.value.orderNo = options_?.orderNo ?? 'go_a0bbda27267b2a6d606fe';
    options.value.index = options_?.index.split(',')?.filter?.((item: string) => item);
    options.value.mode = options_?.mode;
    options.value.applyNo = options_?.applyNo;
    options.value.multi = options_?.multi;

    form.orderNo = options.value.orderNo;
    form.index = options.value.index;
    form.type = options.value.type;
    updateTitle(options_);
    eventListen();
    if (options.value.mode === 'edit') {
        getOrderDeatil();
    }
    if (options.value.type === EnumOrderAfterType.EXCHANGE) {
        getDefaultAddress_();
    }
});

/** 地址选择回调事件监听 */
function eventListen() {
    uni.$on('address-selected', (address: AddressItem) => {
        console.log('地址选择', address);
        exchangeAddress.value = address;
        form.addressId = address.id;
    });
}

/** 在进入页面后，根据用户选择的售后模式更新标题 */
function updateTitle(options: AnyObject | undefined) {
    uni.setNavigationBarTitle({
        title: STATUS_MAP[options?.type].title
    });
}

/** 重新选择售后类型 */
function reselect() {
    router.redirect('orderAfterSelectGoods', {
        orderNo: options.value.orderNo,
        index: options.value.index.join(','),
        from: 'orderAfter',
        type: options.value.type
    });
}

/**跳转选择地址 */
function toSelectAddress() {
    router.push('myAddress', {
        select: 0
    });
}

/** 表单校验 */
function validate() {
    if ((form.receiveGoods ?? -1) < 0) return '请选择是否收到货物';
    if (!form?.reason) return '请选择退款原因';
    if (options.value.type !== EnumOrderAfterType.EXCHANGE && !form?.money) return '请填写退款金额';

    if (options.value.type === EnumOrderAfterType.EXCHANGE) {
        if (!form.addressId) return '地址不能为空';
    }

    if (
        !form._forbidQuickRefund &&
        form._canUseQuickRefund &&
        options.value.type === EnumOrderAfterType.REFUND_RETURN
    ) {
        // 当能使用极速退款，且没有被禁止的时候，添加教研
        if (!form.fastRefundAccount) return '支付宝账号不能为空';
        if (!form.fastRefundAccountName) return '支付宝真实姓名不能为空';
        if (!form.remark) return '退款说明不能为空';
        // if (!form.evidence || form.evidence?.length < 6) return '凭证数量不能小于6张';
    }

    return '';
}

/**
 * 获取订单详情
 */
async function getOrderDeatil() {
    const resp = await fetchOrderCancelApplyDetail({
        applyNo: options.value?.applyNo
    });
    form.reason = resp.reason;
    form.evidence = resp.evidenceList;
    form.index = resp.orderItemList?.map(item => item.index + '');
    form.remark = resp.remark;
    form.money = resp.money + '';
}

/**
 * 获取默认地址
 */
async function getDefaultAddress_() {
    const resp = await getDefaultAddress({
        type: 0
    });
    exchangeAddress.value = resp;
    form.addressId = resp.id;
}

async function submit() {
    const resResult = validate();
    if (resResult) {
        return uni.showToast({
            title: resResult,
            icon: 'none'
        });
    }
    try {
        /** 是否支持极速退款 */
        form.fastRefund =
            form._canUseQuickRefund && options.value.type === EnumOrderAfterType.REFUND_RETURN
                ? form._forbidQuickRefund
                    ? 0
                    : 1
                : 0;

        await addOrderCancelApply(form);
        router.redirect('orderAfterStatus', {
            info:
                form.type !== EnumOrderAfterType.REFUND
                    ? '一旦审核通过，我们将会把商家的收获地址短信通知你，你也可以回到订单页面进行查看。请根据此地址尽快寄回已购商品～'
                    : '一旦审核通过后将会短信通知你'
        });
    } catch (err) {
        uni.showToast({
            title: (err as any).msg,
            icon: 'none'
        });
    }
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
    <view class="container">
        <base-card :header-text="STATUS_MAP[options.type].cardHeader">
            <goods-card
                :order-no="options.orderNo"
                :index="options.index"
                :show-footer="options?.type * 1 === EnumOrderAfterType.EXCHANGE"
                fast-check
            />
            <template #right>
                <view
                    v-if="options.index.length > 1 || options.multi"
                    class="reselect"
                    @tap="reselect"
                >
                    重新选择 >
                </view>
            </template>
        </base-card>
        <goods-refund-info
            v-if="options?.type !== EnumOrderAfterType.EXCHANGE"
            ref="goodsRefundInfoRef"
            default-price=""
            :type="options?.type"
        />
        <alipay-form
            v-if="
                form._canUseQuickRefund &&
                !form._forbidQuickRefund &&
                options.type === EnumOrderAfterType.REFUND_RETURN
            "
        ></alipay-form>
        <goods-exchange-info
            v-if="options?.type === EnumOrderAfterType.EXCHANGE"
            ref="goodsExchangeInfoRef"
        />
        <base-card
            v-if="options.type === EnumOrderAfterType.REFUND_RETURN"
            header-text="商品返回方式"
        >
            <template #right>
                <view class="backway-right">快递至卖家</view>
            </template>
            <view class="backway-tips">
                商品寄回地址将在该申请通过后以短信告知，或在申请记录中查看
            </view>
        </base-card>
        <refund-info-voucher />
        <base-card
            v-if="options.type === EnumOrderAfterType.EXCHANGE"
            header-text="收货地址"
        >
            <uni-list :border="false">
                <uni-list-item
                    show-arrow
                    :right-text="exchangeAddress?.id ? '' : '请选择'"
                    class="list-item"
                    @tap="toSelectAddress"
                >
                    <template #header>
                        <text class="label">
                            <template v-if="exchangeAddress?.id">
                                {{ exchangeAddress.userName }}
                                {{ exchangeAddress.phone }}
                            </template>
                            <template v-else>选择地址</template>
                        </text>
                    </template>
                </uni-list-item>
                <view class="address-extra">
                    {{ exchangeAddress?.provinceName }}
                    {{ exchangeAddress?.cityName }}
                    {{ exchangeAddress?.countyName }}
                    {{ exchangeAddress?.detailInfo }}
                </view>
            </uni-list>
        </base-card>
    </view>
    <view class="footers">
        <zd-button
            type="primary"
            class="confirm-btn"
            @tap="submit"
        >
            提交
        </zd-button>
    </view>
</template>

<style lang="scss" scoped>
.container {
    width: 750rpx;
    padding: 20rpx;
    background-color: #f5f8fa;
    box-sizing: border-box;
}
.backway {
    &-right {
        color: $zd-main-color;
        font-size: 28rpx;
        font-weight: 400;
    }
    &-tips {
        color: $uni-color-paragraph;
        line-height: 34rpx;
        font-size: 24rpx;
    }
}
.reselect {
    color: $zd-main-color;
    font-size: 28rpx;
    font-weight: 400;
}
.label {
    color: #333333;
    font-size: 32rpx;
    font-weight: bold;
}
.address-extra {
    color: #666;
    font-size: 28rpx;
}
.footers {
    bottom: 0;
    width: 750rpx;
    padding-bottom: 44rpx;
    box-sizing: border-box;
    background-color: #fff;
    .confirm-btn {
        box-sizing: border-box;
        height: 80rpx;
        margin: 20rpx 40rpx;
        :deep(button) {
            width: 670rpx;
            font-size: 32rpx;
            font-weight: bold;
        }
    }
}
.list-item {
    :deep(.uni-list-item__container) {
        padding-left: 0;
    }
}
</style>
