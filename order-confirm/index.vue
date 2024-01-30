<script setup lang="ts">
import { clickTrack, router, storage } from '@zsdx/mp-utils';

import {
    checkOrder,
    createOrder,
    getRecommendAllowance,
    getRecommendCoupon,
    getRecommendRedPack,
    getRecommendStudentShopRedPack,
    preview
} from '@/api/order-confirm/index';
import type {
    DiscountInfo,
    Order,
    OrderList,
    OrderPreview,
    PreviewParam
} from '@/api/order-confirm/types';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import definePageProps from '@/utils/definePageProps';
import { pay, requestSubscribeMessage } from '@/utils/pay';

import addressModel from './components/address.vue';
import agentModal from './components/agent-modal.vue';
import crossForm from './components/cross-form.vue';
import discounts from './components/discounts.vue';
import goodsGroup from './components/goods-group.vue';
import type { AgentConfig, Discount, OrderParams, OrderRemark, ResultData } from './types';
import { OrderType } from './types';

const orderStore = useOrderStore();
const userStore = useUserStore();

const { zsdxPwd } = toRefs(userStore);
const localStorage = storage();
const paying = ref(false);
const previewParam = ref<PreviewParam>({
    orderItemList: orderStore.getSelectedProducts(),
    buyType: 1,
    addressId: undefined,
    dormitoryAddressId: undefined,
    result: 15,
    studentCouponNos: [],
    studentPacketNos: [],
    studentAllowanceId: '',
    shopUseVipPriceConfig: [],
    shopRemarkConfig: [],
    studentPacketIds: [],
    removeShopCart: false,
    virtualBuyInfoMap: {},
    crossBorderInfo: { realName: '', idCardNumber: '' },
    // shopUseDormitoryAddressConfig: [],
    shopUseDormitoryAddress: 0,
    zsdxPwd: undefined,
    bypassStudentAuth: 1
});
const trackSearchSession = ref('');
const newAddress = ref({ userName: '', phone: '', detailInfo: '' });
//订单关键信息
const orderInfo = ref<OrderParams>();
const customPageNo = ref<string>('');
const orderTimer = ref(0);

const buyInfo = ref({
    totalCount: 0
});
const remarks = ref<OrderRemark[]>([]);

// 1: 开启, 0: 关闭, -1: 预留不可开启, 2: 强制开启代理, -2:未认证不可开启, -4:非同校不可开启, -5:关闭代收
const collectionBySchoolAgent = ref(-5);
const computeCollectionBySchoolAgent = () => {
    // 校园团开启强制代理
    if (
        orderDetail.value?.schoolDumplingActivity?.collectionType === 1 &&
        orderDetail.value?.schoolDumplingActivity?.leaderType === 1
    ) {
        collectionBySchoolAgent.value = 2;
        return;
    }
    let enable = false; //存在可开启
    let needVerify = false; //需要认证
    orderDetail.value?.orderList.forEach(sub => {
        sub.list.forEach(order => {
            if (
                order.collectionBySchoolAgent.enable === 1 ||
                order.collectionBySchoolAgent.enable === 0
            ) {
                enable = true;
            } else if (order.collectionBySchoolAgent.enable === -2) {
                needVerify = true;
            }
        });
    });
    if (enable) {
        collectionBySchoolAgent.value = 0;
    } else if (needVerify) {
        collectionBySchoolAgent.value = -2;
    } else {
        collectionBySchoolAgent.value = -5;
    }
};
const orderDetail = ref<OrderPreview>();
const discountList = ref<Discount[]>([]);
const subSidyDiscount = ref(0); //津贴优惠
const agentModalRef = ref();

const fnPreview = async () => {
    uni.showLoading({
        title: '',
        mask: true
    });
    // 虚拟订单提交信息
    getPreviewVirtualBuyInfoMap();
    // 代收地址提交信息
    previewParam.value.shopUseDormitoryAddress = collectionBySchoolAgent.value >= 1 ? 1 : 0;
    // getPreviewAgentAddress();
    orderDetail.value = await preview(previewParam.value);

    // 初始化备注
    const remarkList: OrderRemark[] = [];
    let totalCount = 0;
    orderDetail.value?.orderList.forEach(item => {
        // 备注列表生成
        item.list.forEach(order => {
            remarkList.push({
                orderKey: order.orderKey,
                shopNo: order.shopNo,
                remark: '',
                studentShopId: order.studentShopId || ''
            });
            totalCount += order.num;
        });
    });
    // 没有修改过, 重新计算是否可代收
    if (collectionBySchoolAgent.value === -5) {
        computeCollectionBySchoolAgent();
    }
    remarks.value = remarkList;
    buyInfo.value = {
        totalCount: totalCount
    };
    previewParam.value.studentCouponNos = orderDetail.value.usedStudentCouponNos;
    let value = orderDetail.value.orderList[0].list[0].orderKey;
    fnGetDiscount();
    uni.hideLoading();
};
const fnGetDiscount = () => {
    subSidyDiscount.value =
        orderDetail.value?.orderList.reduce((disResult: number, item) => {
            disResult += item.list.reduce((subRes: number, subItem: Order) => {
                subRes += subItem.discountInfo
                    ? subItem.discountInfo?.reduce((disRes: number, disItem: DiscountInfo) => {
                          if (disItem.type === 23) {
                              disRes += +disItem.discountMoney;
                          }

                          return disRes;
                      }, 0)
                    : 0;
                return subRes;
            }, 0);
            return disResult;
        }, 0) || 0;

    console.log('获取订单信息', subSidyDiscount.value);
    discountList.value = [
        {
            type: 1,
            discountMoney: orderDetail.value?.usedStudentCouponDiscountMoney || 0,
            title: '优惠券',
            disabled: false
        },
        {
            type: 2,
            discountMoney: -1,
            title: '掌大红包',
            disabled: false
        },
        {
            type: 4,
            discountMoney: -1,
            title: '社群红包',
            disabled: false
        },
        {
            type: 3,
            discountMoney: subSidyDiscount.value,
            title: '购物津贴',
            disabled: false
        }
    ];
    if (
        orderDetail.value?.orderSummerVacationDiscountActivityMoney &&
        +orderDetail.value?.orderSummerVacationDiscountActivityMoney > 0
    ) {
        discountList.value.unshift({
            type: 5,
            discountMoney: +orderDetail.value?.orderSummerVacationDiscountActivityMoney,
            freeDiscountMaxSubsidyMoney: orderDetail.value?.freeDiscountMaxSubsidyMoney || 0,
            title: '活动立减',
            disabled: false
        });
    }
};
const fnChangeCount = async (data: any) => {
    previewParam.value.orderItemList?.forEach(item => {
        if (item.productNo === data.productNo) {
            item.num = data.count;
        }
    });
    await getRecommendDiscount();
    fnPreview();
    uni.$emit('OrderConfirmReload');
};
const payOrder = async (payOrderInfo: OrderParams) => {
    try {
        uni.showLoading({
            title: '',
            mask: true
        });
        await pay(
            payOrderInfo.resultData.reduce((result: string[], item: ResultData) => {
                result.push(item.payOrderNo);
                return result;
            }, []),
            OrderType.GoodsOrder
        );
        uni.hideLoading();
        track('订单支付成功');
        router.redirect('payResult', {
            money: orderDetail.value?.orderMoney,
            orderNo: payOrderInfo.resultData[0].orderNo,
            /** 一分购购买成功后，需要吧活动好传递给结果页，以用来显示成功后的弹窗 */
            activityNo: options.value?.activityNo
        });
    } catch (e) {
        console.log('========e', e);
        uni.showToast({
            title: '支付失败',
            icon: 'none',
            mask: true
        });
        setTimeout(() => {
            if (payOrderInfo.resultData.length > 1) {
                router.redirect('orderList', {});
            } else {
                router.redirect('orderDetail', {
                    orderNo: payOrderInfo.resultData[0].orderNo
                });
            }
        }, 1000);
    }
};
const getPreviewVirtualBuyInfoMap = () => {
    previewParam.value.virtualBuyInfoMap = orderDetail.value?.orderList.reduce(
        (result: any, subList: OrderList) => {
            let subObj = subList.list.reduce((subRes: any, item) => {
                if (item.virtualBuyInfo) {
                    subRes[item.orderKey] = item.virtualBuyInfo;
                }
                return subRes;
            }, {});
            return {
                ...result,
                ...subObj
            };
        },
        {}
    );
};
const fnCreateOrder = async () => {
    track('提交订单按钮');
    // 虚拟订单提交信息
    getPreviewVirtualBuyInfoMap();
    // 代收地址提交信息
    // getPreviewAgentAddress();
    previewParam.value.shopUseDormitoryAddress = collectionBySchoolAgent.value >= 1 ? 1 : 0;
    if (paying.value) {
        return;
    }
    paying.value = true;
    uni.showLoading({
        title: '',
        mask: true
    });
    if (orderInfo.value) {
        // 上次支付未成功
        payOrder(orderInfo.value);
        return;
    }
    try {
        // 创建订单
        // 无需支付订单, 直接订阅订单模板
        if (!orderDetail.value?.orderMoney || +orderDetail.value?.orderMoney <= 0) {
            requestSubscribeMessage();
        }
        previewParam.value.shopRemarkConfig = remarks.value;
        const ticket: string = await createOrder(
            {
                ...previewParam.value,
                trace: JSON.stringify({
                    search_session: trackSearchSession.value,
                    session_id: localStorage.get('session_id') || ''
                })
            },
            {
                orderTrace: {
                    type: 1,
                    pageNo: customPageNo.value
                }
            }
        );

        const checkOrderStatus = () => {
            clearTimeout(orderTimer.value);

            orderTimer.value = setTimeout(async () => {
                try {
                    let res = await checkOrder({ ticket: ticket });

                    if (res.result == -1) {
                        paying.value = false;
                        uni.hideLoading();
                        uni.showToast({
                            title: res?.failReason || '创建失败',
                            icon: 'none'
                        });
                        return;
                    }
                    if (res.result == 1) {
                        let needPay = res.resultData.some((item: ResultData) => {
                            if (item.payOrderNo) {
                                return true;
                            }
                            return false;
                        });
                        if (needPay) {
                            orderInfo.value = res;
                            await payOrder(orderInfo.value);
                        } else {
                            router.redirect('payResult', {
                                money: orderDetail.value?.orderMoney,
                                orderNo: res.resultData[0].orderNo
                            });
                        }
                    } else {
                        checkOrderStatus();
                    }
                    uni.hideLoading();
                    paying.value = false;
                } catch (e) {
                    uni.hideLoading();
                    paying.value = false;
                    console.log(e);
                }
            }, 1000);
        };
        checkOrderStatus();
    } catch (e) {
        paying.value = false;
    }
};
/**
 * 获取推荐优惠
 */
const getRecommendDiscount = async () => {
    // 按照 "优惠券 -> 红包 -> 社群红包 -> 津贴" 顺序使用优惠
    try {
        previewParam.value.studentCouponNos = await getRecommendCoupon(previewParam.value);
        previewParam.value.studentPacketNos = await getRecommendRedPack(previewParam.value);
        previewParam.value.studentPacketIds = await getRecommendStudentShopRedPack(
            previewParam.value
        );
        previewParam.value.studentAllowanceId = await getRecommendAllowance(previewParam.value);
    } catch (e: any) {
        uni.showToast({
            title: e.msg,
            icon: 'none'
        });
    }
};
const fnChangeDiscount = async (data: any) => {
    switch (data.type) {
        case 'coupon':
            previewParam.value.studentCouponNos = data.value;
            previewParam.value.studentAllowanceId = '';
            previewParam.value.studentPacketNos = [];
            previewParam.value.studentPacketIds = [];
            previewParam.value.studentPacketNos = await getRecommendRedPack(previewParam.value);
            previewParam.value.studentPacketIds = await getRecommendStudentShopRedPack(
                previewParam.value
            );
            previewParam.value.studentAllowanceId = await getRecommendAllowance(previewParam.value);
            break;
        case 'allowance':
            previewParam.value.studentAllowanceId = data.value;
            break;
        case 'redPack':
            previewParam.value.studentPacketNos = data.value;
            previewParam.value.studentAllowanceId = '';
            previewParam.value.studentPacketIds = [];
            previewParam.value.studentPacketIds = await getRecommendStudentShopRedPack(
                previewParam.value
            );
            previewParam.value.studentAllowanceId = await getRecommendAllowance(previewParam.value);
            break;
        case 'studentShopRedPack':
            console.log('获取社群红包');
            previewParam.value.studentPacketIds = data.value;
            previewParam.value.studentAllowanceId = '';
            previewParam.value.studentAllowanceId = await getRecommendAllowance(previewParam.value);
            break;
        default:
            break;
    }
    uni.$emit('OrderConfirmReload');
    fnPreview();
};
const fnShowAgentPop = (param: { type: number; config: AgentConfig }) => {
    agentModalRef.value.open(param.type, param.config);
};
const track = (element_name: string) => {
    let shopNos: string[] = [];
    const studentShopId: string = localStorage.get('studentShopId') || '';
    orderDetail.value?.orderList.forEach(item => {
        // 备注列表生成
        item.list.forEach(order => {
            shopNos.push(order.shopNo);
        });
    });
    let data = {
        type: 'click',
        eventData: {
            action: 2,
            path: 'bi_event',
            element_name,
            student_shop_id: studentShopId,
            page_data_type: 'Order',
            page_data_id: shopNos.join(','),
            page_data_info: orderDetail.value?.orderList
        }
    };
    clickTrack(data);
};
const options = definePageProps<{
    buyType?: string;
    orderFrom?: string;
    activityNo?: string;
    customPageNo?: string;
    __trackSearchSession?: string;
}>(async params => {
    previewParam.value.buyType = params?.buyType ? +params?.buyType : 1;
    previewParam.value.zsdxPwd = zsdxPwd.value;
    previewParam.value.removeShopCart = params?.orderFrom === 'shopCart' ? true : false;
    customPageNo.value = params?.customPageNo || '';
    trackSearchSession.value = params?.__trackSearchSession || '';

    await getRecommendDiscount();
    fnPreview();
});
onUnload(() => {
    clearTimeout(orderTimer.value);
});
</script>
<template>
    <zd-navbar
        relative
        title="确认订单"
    />
    <view class="page-body">
        <zd-notice-bar
            v-if="previewParam.buyType === 11"
            padding="0 30rpx"
            color="rgba(25, 159, 255, 1)"
            background="rgba(25, 159, 255, 0.1)"
            :content-list="[
                '组合包内的商品支付后，会生成多个订单',
                '该组合包内包含虚拟商品，需要单独填写信息'
            ]"
            :interval="3000"
            :show-title="false"
            :height="64"
        ></zd-notice-bar>
        <!-- 跨境信息 -->
        <crossForm
            v-if="orderDetail?.needCrossBorderInfo"
            v-model:id-card="previewParam.crossBorderInfo.idCardNumber"
            v-model:true-name="previewParam.crossBorderInfo.realName"
        />
        <template
            v-for="(orderGroup, gIndex) in orderDetail?.orderList"
            :key="gIndex"
        >
            <addressModel
                v-if="orderGroup.needTrackingInfoType == 1"
                v-model:addressId="previewParam.addressId"
                v-model:dormitoryAddressId="previewParam.dormitoryAddressId"
                v-model:collection-by-school-agent="collectionBySchoolAgent"
                :address-info="orderDetail?.addressInfo"
                @change="fnPreview"
                @show-agent-pop="fnShowAgentPop"
            />
            <goodsGroup
                v-for="(order, oIndex) in orderGroup.list"
                :key="oIndex"
                v-model:remark="remarks[oIndex].remark"
                v-model:info="orderGroup.list[oIndex]"
                :buy-type="previewParam.buyType"
                @change-count="fnChangeCount"
                @show-agent-pop="fnShowAgentPop"
            />
        </template>
        <discounts
            :preview-param="previewParam"
            :list="discountList"
            :order-detail="orderDetail"
            @change="fnChangeDiscount"
        />
    </view>
    <view class="page-footer-seat savepadding"></view>
    <view
        v-if="orderDetail?.result === 1"
        class="page-footer savepadding"
    >
        <view class="page-footer-main">
            <view class="page-footer-total"> 已选{{ buyInfo.totalCount }}件， </view>
            <view class="page-footer-title"> 合计 </view>
            <zd-price
                :value="orderDetail?.orderMoney"
                color="#FF4734"
                :font-size-large="48"
                :font-size-small="28"
                :font-size-unit="20"
            />
        </view>
        <zd-button
            type="primary"
            :button-style="{
                width: '212rpx',
                lineHeight: '68rpx',
                height: '68rpx',
                marginRight: '20rpx',
                fontWeight: 'bold',
                fontStyle: '28rpx'
            }"
            @tap="fnCreateOrder"
        >
            <text class="button-text">立即付款</text>
        </zd-button>
    </view>
    <view
        v-else-if="orderDetail?.resultMsgList"
        class="page-footer savepadding"
    >
        <view class="error-msg ellipsis">{{ orderDetail?.resultMsgList[0] }}</view>
    </view>
    <agentModal ref="agentModalRef" />
</template>

<style>
page {
    background-color: #f5f8fa;
}
</style>
<style lang="scss" scoped>
.page-body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 750rpx;
    flex-direction: column;
}
.page-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 750rpx;
    height: 100rpx;
    background: #ffffff;
    flex-direction: row;
    &-seat {
        height: 140rpx;
    }
    .page-footer-main {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        margin-right: 20rpx;
        font-size: 24rpx;
        font-weight: 400;
        flex: 1;
        flex-direction: row;
        line-height: 24rpx;
    }
    .page-footer-total {
        color: rgba(138, 147, 153, 1);
    }
    .page-footer-total {
        margin-right: 4rpx;
    }
    .error-msg {
        width: 550rpx;
        margin: 0 100rpx;
        text-align: center;
        color: #999;
        font-size: 28rpx;
        line-height: 100rpx;
    }
}
.button-text {
    font-size: 28rpx;
    font-weight: 600;
}
</style>
