<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

import type { ResponseOrder8 } from '../../api/order/types';
import { getDefaultAddress } from '../../api/order-confirm/index';
import agentAddressModule from '../../components/order/agent-address.vue';
import studentAuthPop from '../../components/student-auth-pop/index.vue';
import type { Address } from '../types';

const props = defineProps<{
    /**
     * 是否可代收
     */
    collectionBySchoolAgent?: number;
    addressId?: number;
    dormitoryAddressId?: number;
    deliveryTimeStr?: string;
    addressInfo?: ResponseOrder8;
}>();
const emit = defineEmits([
    'change',
    'update:collectionBySchoolAgent',
    'update:addressId',
    'update:dormitoryAddressId',
    'update:agentAddress',
    'showAgentPop'
]);
const address = ref<Address>();
const studentAuth = ref();
const agentAddress = ref<Address>();
const addressInit = async () => {
    address.value = await getDefaultAddress({ type: 0 });
    emit('update:addressId', address.value?.id);
    agentAddress.value = await getDefaultAddress({ type: 1 });
    emit('update:dormitoryAddressId', agentAddress.value?.id);
    emit('change', {
        address: address.value,
        agentAddress: agentAddress.value
    });
};
const fnChangeAgent = (e: any) => {
    emit('update:collectionBySchoolAgent', e?.detail?.value ? 1 : 0);
    emit('change', {
        address: address.value,
        agentAddress: agentAddress.value
    });
};
const goAddressAdd = (type: number) => {
    router.push('addAddress', {
        select: 'orderConfirmChooseAddress',
        type: type
    });
};
const goAddressSelect = (type: number) => {
    router.push('myAddress', {
        select: type
    });
};
const fnAuth = async () => {
    const result = await studentAuth.value.validate();

    if (result) {
        emit('update:collectionBySchoolAgent', props.collectionBySchoolAgent === -2 ? 1 : 0);
        emit('change');
    }
};
const loadAddress = () => {
    // TODO 更新地址
    console.log('loadSetAddress');
};
const fnChangeAddress = (resAddress: Address) => {
    console.log('address receive', resAddress);
    if (resAddress.type === 0) {
        address.value = resAddress;
        emit('update:addressId', address.value?.id);
    } else {
        agentAddress.value = resAddress;
        emit('update:dormitoryAddressId', agentAddress.value?.id);
    }
    emit('change', {
        address: address.value,
        agentAddress: agentAddress.value
    });
};
const fnShowAgentTip = () => {
    emit('showAgentPop', {
        type: 1
    });
};
const fnShowForceAgentTip = () => {
    console.log('团购强制代理');
};
const filterName = (name: string) => {
    if (!name) {
        return '--';
    }
    if (name.length > 20) {
        return name.substring(0, 20) + '...';
    }
    return name;
};
defineExpose({
    loadAddress
});
addressInit();
onMounted(() => {
    uni.$on('address-selected', fnChangeAddress);
});
</script>
<template>
    <!-- 代收开关 -->
    <view
        v-if="collectionBySchoolAgent !== -5"
        class="container small"
    >
        <view class="agent-address">
            <view class="agent-address-head">
                <view class="agent-address-head-text">由校内员工代收并送货到寝</view>
                <zd-icon
                    type="zdmp-jieshi"
                    :size="32"
                    color="rgba(138, 147, 153, 1)"
                    @tap="fnShowAgentTip"
                ></zd-icon>
                <view class="agent-address-head-seat"></view>
                <switch
                    v-if="collectionBySchoolAgent === 2"
                    :checked="collectionBySchoolAgent === 2"
                    disabled
                    color="rgba(25, 159, 255, 1)"
                    style="transform: scale(0.7)"
                    @tap="fnShowForceAgentTip"
                />
                <switch
                    v-else-if="
                        collectionBySchoolAgent !== undefined && +collectionBySchoolAgent >= 0
                    "
                    :checked="collectionBySchoolAgent == 1"
                    color="rgba(25, 159, 255, 1)"
                    style="transform: scale(0.7)"
                    @change="fnChangeAgent"
                />
                <switch
                    v-else-if="collectionBySchoolAgent === -2"
                    disabled
                    :checked="false"
                    color="rgba(25, 159, 255, 1)"
                    style="transform: scale(0.7)"
                    @tap="fnAuth"
                />
            </view>
        </view>
    </view>
    <!-- 代收地址明细 -->
    <template v-if="collectionBySchoolAgent && collectionBySchoolAgent > 0">
        <agentAddressModule
            :show-edit="true"
            :address="agentAddress"
            :agent-address="addressInfo"
            @go-address="goAddressSelect(1)"
        />
    </template>
    <!-- 非代收地址 -->
    <view
        v-else
        class="container"
    >
        <view
            v-if="address"
            class="self-address"
            @tap="goAddressSelect(0)"
        >
            <zd-icon
                type="zdmp-weizhi"
                :size="40"
                color="rgba(138, 147, 153, 1)"
            ></zd-icon>
            <view class="address-detail">
                <view class="address-detail-text">{{ address?.detailInfo }}</view>
                <view class="user-info">
                    <view class="user-info-text">{{ filterName(address?.userName) }}</view>
                    <view class="user-info-text">{{ address?.phone }}</view>
                </view>
            </view>
            <zd-icon
                type="zdmp-qianwang"
                :size="32"
                color="rgba(138, 147, 153, 1)"
            ></zd-icon>
        </view>
        <view
            v-else
            class="self-address"
            @tap="goAddressAdd(0)"
        >
            <zd-icon
                type="zdmp-weizhi"
                :size="40"
                color="rgba(138, 147, 153, 1)"
            ></zd-icon>
            <view class="address-detail">
                <view class="address-detail-text ellipsis">新增地址</view>
            </view>
            <zd-icon
                type="zdmp-qianwang"
                :size="32"
                color="rgba(138, 147, 153, 1)"
            ></zd-icon>
        </view>
    </view>
    <studentAuthPop
        ref="studentAuth"
        content="未获取到你的学生认证记录，前往认证，认证成功后下单"
    ></studentAuthPop>
</template>
<style lang="scss" scoped>
.container {
    width: 710rpx;
    margin-top: 20rpx;
    padding: 30rpx 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    box-sizing: border-box;
    &.small {
        padding: 20rpx;
    }
}
.self-address {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    .address-detail {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        margin-left: 24rpx;
        flex: 1;
        flex-direction: column;
        &-text {
            color: #292f33;
            font-size: 32rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
        .user-info {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: row;
            &-text {
                margin-top: 20rpx;
                margin-right: 20rpx;
                color: #576066;
                font-size: 28rpx;
                font-weight: 400;
                line-height: 28rpx;
            }
        }
    }
}
.agent-detail {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: row;
}
.agent-detail-head {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40rpx;
    margin-right: 20rpx;
    flex-direction: column;
    &-inner {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 4rpx;
        height: 50%;
        background-image: linear-gradient(to bottom, rgba(54, 205, 255, 1), rgba(255, 71, 52, 1));
        flex-direction: column;
        &-bg {
            width: 10rpx;
            height: 100%;
            background-image: linear-gradient(
                to bottom,
                #fff 0,
                #fff 10%,
                rgba(0, 0, 0, 0) 10%,
                rgba(0, 0, 0, 0) 20%,
                #fff 20%,
                #fff 30%,
                rgba(0, 0, 0, 0) 30%,
                rgba(0, 0, 0, 0) 40%,
                #fff 40%,
                #fff 50%,
                rgba(0, 0, 0, 0) 50%,
                rgba(0, 0, 0, 0) 60%,
                #fff 60%,
                #fff 70%,
                rgba(0, 0, 0, 0) 70%,
                rgba(0, 0, 0, 0) 80%,
                #fff 80%,
                #fff 90%,
                rgba(0, 0, 0, 0) 90%,
                rgba(0, 0, 0, 0) 100%
            );
            background-repeat: repeat-y;
        }
    }
    &-tag {
        position: absolute;
        top: 0;
        left: 50%;
        width: 36rpx;
        height: 36rpx;
        border-radius: 100%;
        text-align: center;
        color: #ffffff;
        font-size: 20rpx;
        background-color: rgba(25, 159, 255, 1);
        transform: translate(-50%, -50%);
        line-height: 36rpx;
        &.end {
            top: unset;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 50%);
            background-color: rgba(255, 71, 52, 1);
        }
    }
}
.agent-detail-main {
    flex: 1;
    &-agent {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        flex-direction: column;
    }
    &-mine {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 1px solid rgba(237, 240, 242, 1);
        flex-direction: row;
        &-main {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            flex-direction: column;
            overflow: hidden visible;
        }
        &-line {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            flex-direction: row;
            margin-bottom: 20rpx;
            &-title {
                width: 114rpx;
                height: 40rpx;
                margin-right: 20rpx;
                text-align: justify;
                color: #576066;
                font-size: 28rpx;
                line-height: 40rpx;
                &::after {
                    display: inline-block;
                    width: 100%;
                    content: ''; //这三个都不可以少
                }
            }
            &-input {
                color: #292f33;
                font-size: 28rpx;
                font-weight: 500;
                flex: 1;
                line-height: 40rpx;
            }
            &-placeholder {
                color: #8a9399;
                font-size: 28rpx;
                font-weight: 400;
                line-height: 40rpx;
            }
        }
    }
}
.agent-detail-text {
    &-main {
        color: #292f33;
        font-size: 28rpx;
        font-weight: 500;
        line-height: 40rpx;
    }
    &-sub {
        margin-top: 20rpx;
        color: #576066;
        font-size: 28rpx;
        line-height: 28rpx;
    }
}

.agent-address {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;

    .agent-address-head {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        &-text {
            margin-right: 10rpx;
            color: $uni-text-color;
            font-size: 28rpx;
            font-weight: 500;
            line-height: 40rpx;
        }
        &-seat {
            flex: 1;
        }
    }
}
</style>
