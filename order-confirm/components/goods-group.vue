<script setup lang="ts">
import type { DiscountInfo, Order, OrderItem } from '../../api/order-confirm/types';
import studentAuthPop from '../../components/student-auth-pop/index.vue';
import goodsItem from './goods-item.vue';

const props = defineProps<{
    info: Order;
    remark: string;
    buyType?: number;
}>();
const emit = defineEmits(['update:remark', 'update:order', 'changeCount', 'showAgentPop']);
const orderRemark = computed({
    get: () => {
        return props.remark;
    },
    set: (value: string) => {
        emit('update:remark', value);
    }
});
const studentAuth = ref();
const order = computed({
    get: () => {
        return props.info;
    },
    set: (value: Order) => {
        emit('update:order', value);
    }
});
const fnShowDiscountDetail = (discount: DiscountInfo) => {
    switch (discount.type) {
        case 1:
            break;
        default:
            break;
    }
};
const fnChangeCount = (count: number, orderItem: OrderItem) => {
    uni.showLoading({
        title: '',
        mask: true
    });
    emit('changeCount', {
        productNo: orderItem.goodsProductInfo.productNo,
        count: count
    });
};
const fnChangeChecked = (e: any) => {
    order.value.collectionBySchoolAgent.enable = e.detail.value ? 1 : 0;
};
const fnShowAgentTip = async (checkAgent: boolean) => {
    if (checkAgent) {
        const auth = await studentAuth.value.validate();

        if (!auth) return;
    }
    emit('showAgentPop', {
        type: 2,
        config: order.value.collectionBySchoolAgent
    });
};
</script>
<template>
    <view class="container">
        <view class="group-head">
            <zd-icon
                type="zdmp-dianpu"
                :size="32"
                color="rgba(41, 47, 51, 1)"
            ></zd-icon>
            <view class="group-head-title ellipsis">{{
                order.studentShopName || order.shopTitle
            }}</view>
        </view>
        <goodsItem
            v-for="(goods, oIndex) in order.orderItemList"
            :key="oIndex"
            :goods="goods"
            :buy-type="buyType"
            @change-count="fnChangeCount($event, goods)"
        />
        <view class="group-line">
            <view class="line-title grey">运费</view>
            <view class="line-value grey">¥{{ order.freight }}</view>
        </view>
        <view
            v-for="(discount, dIndex) in order.discountInfo"
            :key="dIndex"
            class="group-line"
            @tap="fnShowDiscountDetail(discount)"
        >
            <view class="line-title">{{ discount.desc }}</view>
            <zd-price
                :value="discount.discountMoney"
                color="#FF4734"
                :font-size-large="40"
                :font-size-small="28"
                :font-size-unit="20"
            />
        </view>
        <view class="group-line">
            <view class="line-title">订单备注</view>
            <input
                v-model="orderRemark"
                class="input-line-input"
                type="text"
                placeholder="选填，填写前请和商家客服协商一致"
            />
        </view>
        <view class="group-summary">
            <view class="sub-subtitle">共{{ order.num }}件商品</view>
            <view class="summary-title">合计: </view>
            <zd-price
                :value="order.moneyForShop"
                color="#FF4734"
                :font-size-large="40"
                :font-size-small="28"
                :font-size-unit="20"
            />
        </view>
        <view
            v-if="order.virtualBuyInfo && order.virtualBuyInfo.length > 0"
            class="vertical-info"
        >
            <view class="vertical-title">其他收件信息</view>
            <view
                v-for="(line, lIndex) in order.virtualBuyInfo"
                :key="lIndex"
                class="group-line"
            >
                <view class="line-title">{{ line.title }}</view>
                <input
                    v-model="line.value"
                    class="input-line-input right"
                    type="text"
                    :placeholder="'请输入' + line.title"
                />
            </view>
        </view>
    </view>
    <view
        v-if="!order.shipAble"
        class="group-tail"
    >
        商品暂不支持配送到该地区
    </view>
    <student-auth-pop ref="studentAuth"></student-auth-pop>
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    z-index: 2;
    width: 710rpx;
    margin-top: 20rpx;
    padding: 30rpx 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
}
.group-head {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20rpx;
    .group-head-title {
        margin-right: 10rpx;
        margin-left: 10rpx;
        color: $uni-text-color;
        font-size: 32rpx;
        font-weight: 500;
        line-height: 40rpx;
        flex: 1;
    }
    .group-head-agent-title {
        margin-right: 20rpx;
        margin-left: 10rpx;
        color: $uni-text-color;
        font-size: 28rpx;
        line-height: 32rpx;
    }
    .operate-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: row;
    }
}
.group-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-top: 20rpx;
    .line-title {
        color: #292f33;
        font-size: 24rpx;
        line-height: 40rpx;
        &.grey {
            color: $uni-text-color-grey;
            font-size: 24rpx;
            line-height: 40rpx;
        }
    }
    .line-value {
        color: $uni-text-color-grey;
        font-size: 24rpx;
        line-height: 40rpx;
    }
    .input-line-input {
        text-align: right;
        color: $uni-text-color;
        flex: 1;
        font-size: 24rpx;
        line-height: 40rpx;
        &.right {
            text-align: right;
        }
    }
}
.group-summary {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction: row;
    height: 40rpx;
    margin-top: 20rpx;
    .sub-subtitle {
        color: #8a9399;
        font-size: 24rpx;
        line-height: 24rpx;
    }
    .summary-title {
        margin: 0 8rpx 0 20rpx;
        color: #292f33;
        font-size: 24rpx;
        line-height: 24rpx;
    }
}

.group-tail {
    position: relative;
    z-index: 0;
    width: 710rpx;
    margin-top: -16rpx;
    padding: 36rpx 20rpx 20rpx;
    border-radius: 0px 0px 16rpx 16rpx;
    color: #fff;
    font-size: 24rpx;
    background: $uni-color-primary;
    line-height: 24rpx;
    box-sizing: border-box;
}
.vertical-info {
    margin-top: 20rpx;
}
.vertical-title {
    color: $uni-text-color;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 40rpx;
    &::before {
        content: '*';
        color: $zd-color-red;
    }
}
</style>
