<script setup lang="ts">
import { useUserStore } from '@/stores/user';

import { getAgentAddress } from '../../api/order/index';
import type { AgentAddress, ResponseOrder8 } from '../../api/order/types';

const props = withDefaults(
    defineProps<{
        showEdit?: boolean;
        address: ResponseOrder8; // 用户宿舍地址
        agentAddress: ResponseOrder8; // 校内员工代收地址
        type: number;
    }>(),
    {
        showEdit: false,
        address: undefined,
        agentAddress: undefined,
        type: 1
    }
);
const emit = defineEmits(['goAddress', 'update:agentAddress']);
const userStore = useUserStore();
const fnGoAddress = () => {
    emit('goAddress', 1);
};
const filterName = (name?: string) => {
    if (!name) {
        return '--';
    }
    if (name.length > 20) {
        return name.substring(0, 20) + '...';
    }
    return name;
};
</script>
<template>
    <view class="container">
        <view class="agent-detail">
            <view class="agent-detail-head">
                <view class="agent-detail-head-inner">
                    <view class="agent-detail-head-inner-bg"></view>

                    <view class="agent-detail-head-tag">代</view>
                    <view class="agent-detail-head-tag end">我</view>
                </view>
            </view>
            <view class="agent-detail-main">
                <view class="agent-detail-main-agent">
                    <view class="agent-detail-text-main">
                        <template v-if="type == 2">
                            {{
                                agentAddress?.provinceName +
                                ' ' +
                                agentAddress?.provinceName +
                                '  ' +
                                agentAddress?.countyName
                            }}
                        </template>
                        {{ agentAddress?.detailInfo }}</view
                    >
                    <view class="agent-detail-text-sub"
                        >{{ agentAddress?.userName }} {{ agentAddress?.phone }}</view
                    >
                </view>
                <!-- 有代收地址 -->
                <view
                    v-if="!showEdit || address"
                    class="agent-detail-main-mine bottom"
                    @tap="fnGoAddress()"
                >
                    <view class="agent-detail-main-mine-main">
                        <view class="agent-detail-text-main">{{ address?.detailInfo }}</view>
                        <view class="agent-detail-text-sub"
                            >{{ filterName(address?.userName) }} {{ address?.phone }}</view
                        >
                    </view>
                    <zd-icon
                        v-if="showEdit"
                        type="zdmp-qianwang"
                        :size="32"
                        color="rgba(138, 147, 153, 1)"
                    ></zd-icon>
                </view>
                <!-- 无代收地址 -->
                <view
                    v-else-if="showEdit"
                    class="agent-detail-main-mine bottom"
                    @tap="fnGoAddress()"
                >
                    <view class="agent-detail-main-mine-main">
                        <view class="agent-detail-text-main ellipsis">添加地址</view>
                    </view>
                    <zd-icon
                        v-if="showEdit"
                        type="zdmp-qianwang"
                        :size="32"
                        color="rgba(138, 147, 153, 1)"
                    ></zd-icon>
                </view>
            </view>
        </view>
    </view>
    <view
        v-if="showEdit"
        class="agent-address-tip"
        >请确保您的校内地址为{{ agentAddress?.schoolName }}{{ agentAddress?.campusName }}内的地址，
        否则无法送货到寝</view
    >
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    z-index: 1;
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
        background-image: linear-gradient(
            to bottom,
            rgba(54, 205, 255, 0.2),
            rgba(255, 71, 52, 0.2)
        );
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
.agent-address-tip {
    width: 750rpx;
    margin-top: 20rpx;
    padding: 0 20rpx;
    color: #199fff;
    font-size: 24rpx;
    box-sizing: border-box;
    line-height: 32rpx;
}
</style>
