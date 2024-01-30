<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';

import { getAllowance } from '../../api/order-confirm';
import type { PreviewParam } from '../../api/order-confirm/types';
import type { Allowance } from '../types';

const props = defineProps<{
    selected?: string;
    previewParam: PreviewParam;
}>();
const list = ref<Allowance[]>([]);
const emit = defineEmits(['change', 'changeSelected']);
const drawerRef = ref();
const checked = ref<string>('');

const open = () => {
    checked.value = props.selected || '';
    drawerRef?.value?.open();
};

const close = () => {
    drawerRef?.value?.close();
};
const getSelected = () => {
    let money = 0;
    let resultList: Allowance[] = [];

    list.value.forEach((_item: Allowance) => {
        if (props.selected === _item.studentAllowanceId) {
            resultList.push(_item);
        }
    });

    const result = {
        discountMoney: 0,
        selected: list.value.length > 0 ? resultList : undefined
    };

    emit('changeSelected', result);
};
const fnCheck = (item: Allowance) => {
    if (checked.value === item.studentAllowanceId) {
        checked.value = '';
    } else {
        checked.value = item.studentAllowanceId;
    }
};

const filterLimit = (limit: number, limitType: number) => {
    switch (limitType) {
        case 0:
            return '无门槛';
        case 1:
            return `满${limit}元可用`;
        case 2:
            return `满${limit}件可用`;
        default:
            return '';
    }
};
const filterTime = (time: number) => {
    return dayjs(time).format('YYYY.MM.DD');
};
const fnSubmit = () => {
    emit('change', checked.value);
    close();
};
const fnStop = (e: any) => {
    e && e.stopPropagation();
};
const getList = async () => {
    list.value = (await getAllowance(props.previewParam))?.validList || [];
};
defineExpose({
    open
});
onMounted(async () => {
    watch(
        () => props.selected,
        () => {
            getSelected();
        }
    );
    watch(
        () => list.value,
        () => {
            getSelected();
        }
    );
    getList();
    uni.$on('OrderConfirmReload', getList);
});
</script>
<template>
    <zd-drawer-bottom
        ref="drawerRef"
        class="drawer-pop"
        header-text="购物津贴"
        @touchmove.prevent.stop="fnStop"
    >
        <scroll-view
            scroll-y
            class="drawer-main"
        >
            <zd-empty
                v-if="list.length === 0"
                :top="0"
                image="https://cdn.zsdx.cn/mp-cs/images/empty/empty_coupon.png"
                :image-width="450"
                :image-height="250"
                description="暂无津贴哦~"
            ></zd-empty>
            <view
                v-for="item in list"
                :key="item.studentAllowanceId"
                class="allowance-item"
                @tap="fnCheck(item)"
            >
                <view class="allowance-head">
                    <view class="allowance-money">
                        <view class="bebas-neue-regular allowance-money-unit">¥</view>
                        <view class="bebas-neue-regular allowance-money-number">{{
                            item.availableTotalAllowanceMoney
                        }}</view>
                    </view>
                    <view class="allowance-limit">{{
                        filterLimit(item.discountLimit, item.discountLimitType)
                    }}</view>
                    <view class="allowance-type">津贴</view>
                </view>
                <view class="allowance-main">
                    <view class="allowance-title ellipsis">{{ item.title }}</view>
                    <view class="allowance-time ellipsis"
                        >有效期: {{ filterTime(item.useStartTime) }}
                        -
                        {{ filterTime(item.useEndTime) }}</view
                    >
                    <zd-icon
                        v-if="checked !== item.studentAllowanceId"
                        class="allowance-checkbox"
                        type="zdmp-weigouxuanbeifen"
                        :size="40"
                        color="rgba(207, 207, 207, 1)"
                    />
                    <zd-icon
                        v-else
                        class="allowance-checkbox"
                        type="zdmp-yigouxuan1"
                        :size="40"
                        color="rgba(25, 159, 255, 1)"
                    />
                </view>
            </view>
        </scroll-view>
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
    background-color: rgba(245, 248, 250, 1);
    flex: 1;
}

.allowance-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 710rpx;
    height: 176rpx;
    margin: 20rpx 20rpx 0;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    flex-direction: row;
    background-image: url(http://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/allowance-bg.png);
}
.allowance-head {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 154rpx;
    height: 100%;
    margin-right: 20rpx;
    flex-direction: column;
}
.allowance-money {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: row;
    color: purple;
    &-unit {
        font-size: 32rpx;
        line-height: 32rpx;
    }
    &-number {
        font-size: 64rpx;
        line-height: 50rpx;
    }
}
.allowance-limit {
    margin-top: 10rpx;
    color: #7f66ff;
    font-size: 20rpx;
    font-weight: 400;
    line-height: 28rpx;
}
.allowance-type {
    height: 32rpx;
    margin-top: 10rpx;
    padding: 0 30rpx;
    border-radius: 16rpx;
    color: rgba(255, 255, 255, 0.9);
    font-size: 20rpx;
    background: #7f66ff;
    line-height: 32rpx;
}

.allowance-main {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    flex: 1;
    .allowance-title {
        color: #292f33;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
    }
    .allowance-time {
        margin-top: 24rpx;
        color: #8a9399;
        font-size: 24rpx;
        line-height: 28rpx;
    }
    .allowance-checkbox {
        position: absolute;
        top: 50%;
        right: 40rpx;
        transform: translateY(-50%);
    }
}
</style>
