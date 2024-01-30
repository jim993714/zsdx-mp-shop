// 津贴
export interface DiscountItem {
    desc: string;
    useStartTime: number;
    useEndTime: number;
    combineType: number;
}
export interface Allowance extends DiscountItem {
    studentAllowanceId: string;
    allowanceId: string;
    availableTotalAllowanceMoney: number;
    discountMoney: number;
    discountLimitType: number;
    discountLimit: number;
    title: string;
}
// 红包
export interface RedPacket extends DiscountItem {
    studentPacketNo: string;
    packetNo: string;
    title: string;
    discountNum: number;
    discountLimitType: number;
    discountLimit: number;
}
// 社群红包
export interface StudentShopRedPack extends DiscountItem {
    studentPacketId: string;
    packetId: string;
    title: string;
    discountNum: number;
    discountLimitType: number;
    discountLimit: number;
}
// 优惠券
export interface Coupon extends DiscountItem {
    studentCouponNo: string;
    couponNo: string;
    shopNo: string;
    category: number;
    official: boolean;
    desc: string;
    discountNum: string;
    discountLimitType: number;
    discountLimit: number;
    couponType: string;
    discountNumMax: string;
}
export interface OrderParams {
    failReason?: string;
    result: number;
    resultData: ResultData[];
}
export interface ResultData {
    orderNo: string;
    payOrderNo: string;
    newUserDiscountMoney: number;
    payMoney: number;
}
/**
 * 地址
 */
export interface Address {
    id: number;
    type: number;
    userName: string;
    phone: string;
    wechat: string;
    detailInfo: string;
    provinceName: string;
    cityName: string;
    countyName: string;
    isDefault?: number;
}

/**
 * 订单备注
 */
export interface OrderRemark {
    orderKey: string;
    shopNo: string;
    remark: string;
    studentShopId: string;
}

/**
 * discount
 */
export interface Discount {
    type: number;
    discountMoney: number;
    title: string;
    disabled?: boolean;
    extra?: any[]; // 已领取优惠券,津贴
    key?: string;
    freeDiscountMaxSubsidyMoney?: number;
}
export type ChooseTab = {
    key: string;
    value: number;
    label: string;
    list: any[];
    type: string;
};

export type AgentConfig = {
    enable: number;
    deliveryTimeStr?: string;
    closeReason?: string;
};

export enum OrderType {
    /** 其他订单 */
    OtherOrder,
    /** 商品订单 */
    GoodsOrder
}
