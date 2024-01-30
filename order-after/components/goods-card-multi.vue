<script setup lang="ts">
import { ref } from 'vue';

import { fetchOrderDetail } from '../../api/order/index';
import type { OrderDetailResp } from '../../api/order/types';
import { fetchOrderPreInfo } from '../../api/order-after';
import type { OrderItem } from '../../api/order-after/types/order-after-list';
import { formKey } from '../constants';

const props = withDefaults(
    defineProps<{
        /** 订单编号 */
        orderNo?: string;

        /** 子订单编号 */
        index?: string[];

        /** 禁止组件内自动请求 */
        forbidReq?: boolean;
        /** 外部数据, 当作为列表时使用，使用前请打开禁止组件内自动请求 */
        item?: OrderItem[];

        /** 检测是否需要极速退款 */
        fastCheck?: boolean;
    }>(),
    {}
);

const form = inject(formKey);
const orderDetail = ref<OrderDetailResp>();
const goodsList = computed(() => {
    if (props.forbidReq) return props.item;

    const goodsList = orderDetail.value?.buyStudentList?.[0].orderItemList?.filter(item => {
        return props.index?.some(i => parseInt(i) === item.index);
    });

    if (props.fastCheck) {
        getFastRefundInfo(
            goodsList?.map(i => i.goodsInfo?.goodsNo ?? '').join(',') ?? '',
            orderDetail.value?.shopNo ?? '',
            orderDetail.value?.studentShopId ?? ''
        );
    }
    if (form) {
        form._goodsNo = goodsList?.map(i => i.goodsInfo?.goodsNo ?? '').join(',');
        form._shopNo = orderDetail?.value?.shopNo;
        form._studentShopId = orderDetail?.value?.studentShopId;
    }

    return goodsList;
});

onMounted(() => {
    if (!props.forbidReq && props.orderNo) {
        getDetail();
    }
});

async function getDetail() {
    const resp = await fetchOrderDetail({ orderNo: props.orderNo ?? '' });
    orderDetail.value = resp!;

    if (form) {
        let money = 0;
        orderDetail.value?.buyStudentList?.[0].orderItemList
            ?.filter(item => {
                return props.index?.some(i => parseInt(i) === item.index);
            })
            .forEach(item => {
                money += parseFloat(item.canCancelApplyMoney!);
            });

        form.money = money.toFixed(2);
        form._price = money.toFixed(2);
    }
}

/** 获取先快速退款信息 */
async function getFastRefundInfo(goodsNo: string, shopNo: string, studentShopId: string) {
    if (!goodsNo || !shopNo) return;
    const resp = await fetchOrderPreInfo({
        goodsNo,
        shopNo,
        studentShopId
    });

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

<template>
    <scroll-view scroll-x>
        <view class="scroll-container">
            <view
                v-for="(item, index) in goodsList"
                :key="index"
                class="goods-item"
            >
                <image
                    :src="item.goodsInfo?.thumbPic"
                    mode="aspectFill"
                />
                <view class="price">
                    <zd-price
                        :value="item.price"
                        color="#fff"
                        :font-size-large="28"
                        :font-size-small="28"
                        :font-size-unit="26"
                    ></zd-price>
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<style scoped lang="scss">
.scroll-container {
    display: flex;
    width: max-content;
    .goods-item {
        position: relative;
        width: 200rpx;
        height: 200rpx;
        margin-right: 10rpx;
        image {
            width: 200rpx;
            height: 200rpx;
            border-radius: 8rpx;
        }
        .price {
            position: absolute;
            bottom: 0;
            width: 200rpx;
            height: 48rpx;
            border-radius: 0rpx 0rpx 8rpx 8rpx;
            text-align: center;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(1px);
        }
    }
}
</style>
