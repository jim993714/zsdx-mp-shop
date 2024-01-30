<script setup lang="ts">
import { ref } from 'vue';

import { checkRedPack, getRedPack } from '../../api/order-confirm';
import type { PreviewParam } from '../../api/order-confirm/types';
import type { Coupon, RedPacket } from '../types';
import couponItem from './coupon-item.vue';

const props = defineProps<{
    previewParam: PreviewParam;
}>();
const init = ref(false);
const tabs = ref<any[]>([
    {
        label: '可用红包',
        key: 'valid',
        value: 0,
        list: []
    },
    {
        label: '不可用',
        value: 1,
        key: 'invalid',
        list: []
    }
]);
const emit = defineEmits(['change', 'changeSelected']);
const drawerRef = ref();
const checked = ref<string[]>([]);
const curIndex = ref(0);

const open = () => {
    checked.value = JSON.parse(JSON.stringify(props.previewParam.studentPacketNos)) || [];
    fnCheckRemainStatus();
    drawerRef.value.open();
};
const close = () => {
    drawerRef.value.close();
};
const fnStop = (e: any) => {
    e && e.stopPropagation();
};
const getSelected = () => {
    let money = 0;
    let list: RedPacket[] = [];

    tabs.value[0].list.forEach((_item: RedPacket) => {
        if (
            props.previewParam.studentPacketNos &&
            props.previewParam.studentPacketNos.indexOf(_item.studentPacketNo) >= 0
        ) {
            money += +_item.discountNum;
            list.push(_item);
        }
    });

    const result = {
        discountMoney: money,
        selected: tabs.value[0].list.length > 0 ? list : undefined
    };
    emit('changeSelected', result);
};
const fnInitList = async () => {
    let result = await getRedPack(props.previewParam);

    tabs.value[0].label = `可用红包(${result.validList.length})`;
    tabs.value[0].list = result.validList;
    tabs.value[1].label = `不可用红包(${result.invalidList?.length})`;
    tabs.value[1].list = result.invalidList;
    // 初始化是否可用
};
const fnCheck = (item: RedPacket) => {
    if (checked.value.indexOf(item.studentPacketNo) >= 0) {
        checked.value.splice(checked.value.indexOf(item.studentPacketNo), 1);
    } else if (+item.combineType === 1) {
        checked.value.push(item.studentPacketNo);
    }
    fnCheckRemainStatus();
};
const fnCheckRemainStatus = async () => {
    const unchecked = tabs.value[0].list.reduce((result: string[], item: RedPacket) => {
        if (checked.value.indexOf(item.studentPacketNo) === -1) {
            result.push(item.studentPacketNo);
        }
        return result;
    }, []);
    const result = await checkRedPack({
        orderItemList: props.previewParam.orderItemList,
        buyType: props.previewParam.buyType,
        addressId: props.previewParam.addressId,
        studentPacketNos: checked.value,
        studentPacketIds: props.previewParam.studentPacketIds,
        studentCouponNos: props.previewParam.studentCouponNos,
        studentAllowanceId: props.previewParam.studentAllowanceId,
        checkStudentPacketNos: unchecked
    });

    tabs.value[0].list.forEach((item: any) => {
        if (result.indexOf(item.studentPacketNo) > -1) {
            item.combineType = 1;
        } else {
            item.combineType = 0;
        }
    });
    result.reduce;
};
const fnSubmit = () => {
    emit('change', checked.value);
    close();
};
defineExpose({
    open
});
onMounted(() => {
    watch(
        () => props.previewParam.studentPacketNos,
        () => {
            getSelected();
        }
    );
    watch(
        () => tabs.value[0].list,
        () => {
            getSelected();
        }
    );
    fnInitList();
    uni.$on('OrderConfirmReload', fnInitList);
});
</script>
<template>
    <zd-drawer-bottom
        ref="drawerRef"
        class="drawer-pop"
        header-text="红包"
        @touchmove.prevent.stop="fnStop"
    >
        <zd-tabbar
            v-model="curIndex"
            :items="tabs"
            :scroll="false"
            :is-action="false"
        >
            <template #default="{ item }">
                <scroll-view
                    scroll-y
                    class="drawer-main"
                >
                    <zd-empty
                        v-if="item.list.length === 0"
                        :top="0"
                        image="https://cdn.zsdx.cn/mp-cs/images/empty/empty_coupon.png"
                        :image-width="450"
                        :image-height="250"
                        description="暂无红包哦~"
                    ></zd-empty>
                    <couponItem
                        v-for="(coupon, cIndex) in item.list"
                        :key="cIndex"
                        :item="coupon"
                        :checked="checked"
                        :disabled="item.key == 'invalid'"
                        key-name="studentPacketNo"
                        type="redPacket"
                        @check="fnCheck(coupon)"
                    ></couponItem>
                </scroll-view>
            </template>
        </zd-tabbar>
        <view class="pop-footer savepadding">
            <zd-button
                type="primary"
                :button-style="{
                    width: '670rpx',
                    height: '80rpx',
                    fontSize: '32rpx'
                }"
                @tap="fnSubmit()"
            >
                确定
            </zd-button>
        </view>
    </zd-drawer-bottom>
</template>
<style lang="scss" scoped>
.drawer-pop {
    position: relative;
    z-index: 800;
}
.pop-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 120rpx;
    background: #ffffff;
    flex-direction: row;
}
.drawer-main {
    overflow-y: auto;
    width: 750rpx;
    height: 100%;
    background-color: rgba(245, 248, 250, 1);
}
</style>
