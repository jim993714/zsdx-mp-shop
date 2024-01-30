import type { Product } from '@/stores/order/types';

import type { OrderRemark } from '../../../order-confirm/types';
import type { ResponseOrder8 } from '../../order/types';

export interface PreviewParam {
    orderItemList?: Product[];
    buyType?: number;
    addressId?: number;
    dormitoryAddressId?: number;
    result?: number;
    studentCouponNos?: string[];
    studentPacketNos?: string[];
    studentAllowanceId?: string;
    shopUseVipPriceConfig?: any[];
    shopUseDormitoryAddressConfig?: any[];
    shopUseDormitoryAddress?: number;
    studentPacketIds?: string[];
    shopRemarkConfig?: OrderRemark[];
    removeShopCart?: boolean;
    checkStudentPacketNos?: string[];
    checkStudentPacketIds?: string[];
    checkStudentCouponNos?: string[];
    virtualBuyInfoMap?: any;
    crossBorderInfo?: any;
    zsdxPwd?: string;
    usePayType?: number;
    bypassStudentAuth?: number;
    trace?: string;
}

export interface GoodsInfo {
    goodsNo: string;
    saleNo: string;
    lotteryNo: string;
    goodsNumber: string;
    thumbPic: string;
    title: string;
    isCrossBorder: number;
}

export interface Spec {
    name: string;
    value: string;
}

export interface GoodsProductInfo {
    sku: string;
    barcode: string;
    stock: number;
    goodsSpecs: Spec[];
    productNo?: string;
}

export interface OrderItem {
    goodsInfo: GoodsInfo;
    goodsProductInfo: GoodsProductInfo;
    isVipGoods: number;
    goodsDiscountVip: number;
    price: number;
    num: number;
    money: number;
    canShip: number;
    delayDay: string;
}

export interface DiscountInfo {
    type: number;
    desc: string;
    discountMoney: number;
}

export interface CollectionBySchoolAgent {
    enable: number;
    closeReason: string;
    deliveryTimeStr: string;
    deliveryRemark: string;
}

export interface VirtualBuyInfo {
    type: number;
    title: string;
    value?: string;
}

export interface Order {
    orderKey: string;
    shopNo: string;
    shopTitle: string;
    companyName: string;
    studentShopId: string;
    studentShopName: string;
    orderItemList: OrderItem[];
    freight: number;
    productMoney: number;
    num: number;
    discountMoney: number;
    discountInfo: DiscountInfo[];
    usedStudentCouponNos: string[];
    money: number;
    shipAble: number | boolean;
    discountMoneyForShop: number;
    moneyForShop: number;
    collectionBySchoolAgent: CollectionBySchoolAgent;
    needTrackingInfoType: number;
    virtualBuyInfo: VirtualBuyInfo[];
}

export interface OrderList {
    needTrackingInfoType: number;
    list: Order[];
}

export interface GoodsList {
    title: string;
    thumbPic: string;
    num: number;
}

export interface MarketingActivity {
    activityType: number;
    activityGradient: number;
    activityOtherExtend: any;
    discountMoney: number;
    oriMoney: number;
    num: number;
    goodsList: GoodsList[];
}
export interface OrderPreview {
    result: number;
    resultMsgList?: string[];
    freight: number;
    vipBenefitDiscountFreightLastCount?: number;
    canShip: number;
    orderMoney: number;
    vipBenefitVipGoodsLastCount?: number;
    orderList: OrderList[];
    needCrossBorderInfo: number;
    usedStudentCouponNos: string[];
    usedStudentCouponDiscountMoney: number;
    usedStudentAllowanceId: string;
    usedStudentPacketIds: string[];
    marketingActivityDiscountMoney: number;
    marketingActivity: MarketingActivity[];
    crossBorderInfo?: any[];
    virtualBuyInfoMap: any;
    addressInfo: ResponseOrder8;
    orderSummerVacationDiscountActivityMoney?: number;
    freeDiscountMaxSubsidyMoney?: number;
    schoolDumplingActivity: {
        collectionType: number;
        leaderType: number;
    };
    orderSummerVacationDiscountActivity: {
        discountMoney: string;
        oriMoney: string;
        num: number;
        goodsList: {
            title: string;
            thumbPic: string;
            num: number;
        }[];
    }[];
}
export interface DiscountResult<T> {
    validList: T[];
    invalidList?: T[];
}
