<script setup lang="ts">
import { router } from '@zsdx/mp-utils';
import dayjs from 'dayjs';

import { fetchOrderCancelApplyDetail, setTrack } from '../api/order-after';
import { EnumOrderAfterType, ORDER_STATUS_MAP } from '../api/order-after/types/constants';
import type { OrderCancelApplyDetailResp } from '../api/order-after/types/order-after-details';
import BaseCard from '../order-after/components/base-card.vue';
import AlipayCard from './components/alipay-card.vue';
import GoodsInfo from './components/goods-info.vue';
import GoodsInfoExchange from './components/goods-info-exchange.vue';
import LocationInfo from './components/location-info.vue';
import PageFooter from './components/page-footer.vue';
import PageHeader from './components/page-header.vue';
import ProcessInfo from './components/process-info.vue';

interface Options {
    applyNo: string;
}
const options = ref<Options>({
    applyNo: ''
});
onLoad(options_ => {
    options.value = options_ as Options;
    getDetail();
    uni.$on('updateOrderAfterDetail', () => {
        setTimeout(() => {
            getDetail();
        }, 200);
    });
});

onShow(() => {
    getDetail();
});

const detail = ref<OrderCancelApplyDetailResp>({} as any);

async function getDetail() {
    const resp = await fetchOrderCancelApplyDetail({
        applyNo: options.value?.applyNo
    });
    // console.log('售后详情', resp);
    // resp.type = EnumOrderAfterType.REFUND_RETURN;
    // resp.status = 101;
    // resp.fastRefund = 1;
    // resp.fastRefundAccount = '4234324234';
    // resp.fastRefundAccountName = '范德萨发';
    // resp.fastRefundAuditContactInfo = {
    //     wechatQrcode:
    //         'https://ts1.cn.mm.bing.net/th/id/R-C.6f9d43bfa9d53235a7b6bc310fb5448b?rik=xUE6OknSO1WYUg&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f2%2fQR-Code-PNG-Images.png&ehk=HPmT%2bF4%2ftU1Kn0R5oF8b%2ffA4ks46kTqApdr3kn7DzIg%3d&risl=&pid=ImgRaw&r=0',
    //     phone: '16600000000'
    // };
    // // 	"fastRefundAccount": "",
    // // "fastRefundAccountName": "",
    // // "fastRefundAuditContactInfo": {
    // // 	"wechatQrcode": "",
    // // 	"phone": ""
    // // }

    detail.value = resp;
}

function toHistory() {
    router.push('orderAfterHistory', {
        applyNo: options.value.applyNo
    });
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
    <page-header
        :detail="detail"
        :apply-no="options.applyNo"
    />
    <view class="container">
        <process-info
            class="process-info"
            :detail="detail!"
        />
        <base-card
            :header-style="{
                marginBottom: '6rpx'
            }"
            header-text="协商历史"
            @tap="toHistory"
        >
            <template #right>
                <zd-icon type="zdmp-qianwang" />
            </template>
        </base-card>
        <alipay-card
            v-if="
                detail.type === EnumOrderAfterType.REFUND_RETURN &&
                ([102, 104, 105].includes(detail.status) ||
                    (detail.status === 2 && detail.fastRefund === 1) ||
                    true)
            "
            :detail="detail"
            :apply-no="options.applyNo"
            @confirm="getDetail"
        />
        <location-info
            v-if="
                detail.type !== 1 &&
                [11, 12, 13, 2, 3, 102].includes(detail.status) &&
                !([13, 14, 2].includes(detail.status) && !detail.rejectAddressInfo?.userName)
            "
            :detail="detail!"
        />
        <goods-info
            v-if="detail.type !== EnumOrderAfterType.EXCHANGE"
            :detail="detail!"
            :apply-no="options.applyNo"
        />
        <goods-info-exchange
            v-else
            :detail="detail!"
            :apply-no="options.applyNo"
        />
    </view>
    <page-footer
        :detail="detail"
        :apply-no="options.applyNo"
        @complate="getDetail()"
    />
</template>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 1;
}

.container {
    display: flex;
    width: 750rpx;
    min-height: calc(80%);
    padding: 20rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 96rpx);
    background-color: #f5f8fa;
    flex-direction: column;
    box-sizing: border-box;
}
.process-info {
    margin-top: -106rpx;
}
</style>
