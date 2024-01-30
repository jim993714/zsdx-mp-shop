<script setup lang="ts">
import { ref } from 'vue';

import { fetchOrderDetail } from '../../api/order/index';
import type { OrderDetailResp, OrderItem } from '../../api/order/types';
import { fetchOrderPreInfo } from '../../api/order-after';
import { formKey } from '../constants';

const props = withDefaults(
    defineProps<{
        /** 是否现实 foote */
        showFooter?: boolean;

        showStatus?: boolean;

        /** 订单编号 */
        orderNo?: string;

        /** 子订单编号 */
        index?: string[];

        /** 禁止组件内自动请求 */
        forbidReq?: boolean;
        /** 外部数据, 当作为列表时使用，使用前请打开禁止组件内自动请求 */
        item: OrderItem;

        /** 发货状态 */
        status?: number;

        /** 检测是否需要极速退款 */
        fastCheck?: boolean;
    }>(),
    {
        showFooter: false,
        showStatus: false
    }
);

const form = inject(formKey) ?? null;

const orderDetail = ref<OrderDetailResp>();
const goodsDetail = computed(() => {
    if (props.item) return props.item;

    const goodsItem =
        props.index?.length === 0
            ? orderDetail.value?.buyStudentList?.[0].orderItemList?.[0]
            : orderDetail.value?.buyStudentList?.[0].orderItemList?.find(
                  i => i.index === props.index?.[0] * 1
              );
    if (form) {
        console.log('?????', goodsItem);

        form.money = goodsItem?.canCancelApplyMoney;
        form._goodsNo = goodsItem?.goodsInfo?.goodsNo;
        form._shopNo = orderDetail?.value?.shopNo;
        form._studentShopId = orderDetail?.value?.studentShopId;
    }
    if (props.fastCheck) {
        getFastRefundInfo(
            goodsItem?.goodsInfo?.goodsNo ?? '',
            orderDetail.value?.shopNo ?? '',
            orderDetail.value?.studentShopId ?? ''
        );
    }
    return goodsItem;
});

const fastRefundInfo = ref<any>();

watch(goodsDetail, newVal => {
    if (form) {
        form._price = newVal?.canCancelApplyMoney;
        form.num = newVal?.num;
    }
});

onMounted(() => {
    if (!props.forbidReq && props.orderNo) {
        getDetail();
    }
});

async function getDetail() {
    const resp = await fetchOrderDetail({ orderNo: props.orderNo! });
    orderDetail.value = resp!;
}

function numInput(input: number) {
    form!.num = input;
    form!.money = parseFloat(
        (input / (goodsDetail.value?.num ?? 1)) * (goodsDetail.value?.money ?? 0) + ''
    ).toFixed(4);
}

/** 获取先快速退款信息 */
async function getFastRefundInfo(goodsNo: string, shopNo: string, studentShopId: string) {
    if (!goodsNo || !shopNo) return;
    const resp = await fetchOrderPreInfo({
        goodsNo,
        shopNo,
        studentShopId
    });
    fastRefundInfo.value = resp;
    if (resp && form) {
        form.fastRefundAccount = resp.fastRefundAccount || '';
        form.fastRefundAccountName = resp.fastRefundAccountName || '';

        if (form._price * 1 <= resp.amount * 1) {
            /**
             * 先退款后退货的条件
             * 1，该商品允许先退款后退货
             * 2，校园代理的可退款后退货额度，大于当前的商品要退货的金额
             * */
            form._canUseQuickRefund = resp.showRefundBeforeReturn ? true : false;
            form._forbidQuickRefund = resp.showRefundBeforeReturn ? false : true;
        } else {
            form._canUseQuickRefund = false;
        }
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
    <view class="content">
        <image
            class="goods-image"
            :src="goodsDetail?.goodsInfo?.thumbPic"
            mode="aspectFill"
        />
        <view class="goods-info">
            <view class="title ellipsis2"> {{ goodsDetail?.goodsInfo?.title }} </view>
            <view class="property">
                <template
                    v-for="(item, index) in goodsDetail?.goodsProductInfo?.goodsSpecs"
                    :key="index"
                >
                    {{ item.name + ',' + item.value }}
                </template>
            </view>
            <view class="price-wrapper">
                <view class="price">
                    <zd-price
                        :font-size-large="32"
                        :font-size-small="24"
                        color="#292F33"
                        :value="goodsDetail?.price"
                    />
                    <text class="amount"
                        ><text>x</text>{{ goodsDetail?.cancelApplyNum || goodsDetail?.num }}</text
                    >
                </view>
                <view
                    v-if="props.showStatus"
                    class="status"
                >
                    {{
                        { 0: '待支付', 1: '待成团', 2: '待发货', 3: '待收货', 4: '已完成' }[
                            props.status ?? 2
                        ]
                    }}
                </view>
            </view>
        </view>
    </view>
    <view
        v-if="props.showFooter"
        class="footer"
    >
        <view>申请数量</view>
        <zd-number-box
            v-model="form!.num"
            class="number-box"
            :max="goodsDetail?.num"
            :min="1"
            :disabled="false"
            @change="numInput"
        ></zd-number-box>
    </view>
    <template v-if="$slots.footer">
        <slot name="footer" />
    </template>
</template>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .goods-image {
        width: 180rpx;
        height: 180rpx;
        margin-right: 20rpx;
        border-radius: 8rpx;
    }
    .goods-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
        .title {
            line-height: 40rpx;
            color: $uni-color-title;
        }
        .property {
            color: $uni-color-paragraph;
            font-size: 24rpx;
        }
        .price-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .price {
                display: flex;
                align-items: flex-end;
                font-size: 32rpx;
                .amount {
                    margin-left: 10rpx;
                    color: $uni-color-paragraph;
                    font-size: 24rpx;
                    line-height: 24rpx;
                }
            }
            .status {
                color: $zd-main-color;
                font-size: 24rpx;
            }
        }
    }
}
.number-box {
    :deep(.uni-numbox__minus) {
        background-color: none;
    }
}
.footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 36rpx;
}
</style>
