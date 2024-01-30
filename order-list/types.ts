export interface GoodsInfo {
    goodsNo: string;
    saleNo: string;
    lotteryNo: string;
    welfareNo: string;
    goodsNumber: string;
    thumbPic: string;
    title: string;
    specialTagTitle?: string;
}

export interface GoodsSpec {
    name: string;
    value: string;
}

export interface GoodsProductInfo {
    sku: string;
    barcode: string;
    goodsSpecs: GoodsSpec[];
}

export interface OrderItem {
    index: number;
    goodsInfo: GoodsInfo;
    goodsProductInfo: GoodsProductInfo;
    isVipGoods: number;
    goodsDiscountVip: number;
    price: number;
    num: number;
    money: number;
    cancelApplyNo: string;
    cancelStatus: number;
}

export interface VirtualMap {
    name: string;
    value: string;
}

export interface VirtualTrackingInfo {
    type: number;
    exchangeCode?: string;
    virtualKeys?: VirtualMap[];
}

export interface WorkHireAgentGoodsGroup {
    applyNo: string;
    agentStudentNo: string;
}

export interface Order {
    orderNo: string;
    orderCategory: number;
    fromType: number;
    orderSocialType: number;
    orderSocialDetailUrl: string;
    orderSocialCustomerServiceUrl: string;
    shopNo: string;
    shopTitle: string;
    studentShopId: string;
    studentShopName: string;
    orderItemList: OrderItem[];
    freight: number;
    productMoney: number;
    money: number;
    status: number;
    payOrderNo: string;
    payRequireMulti: number;
    payStatus: number;
    createTime: number;
    trackingBySchoolAgent: number;
    shipType: number;
    virtualTrackingInfo: VirtualTrackingInfo;
    workHireAgentGoodsGroup: WorkHireAgentGoodsGroup;
    alertHireToDeliver: number;
    isOwner: number;
    canReview: number;
    changeAddressMsgId: number;
    selfPayOrderNo?: string;
}
/**
 * 筛选列表项
 */
export interface FilterItem {
    startTime: number;
    endTime: number;
    label: string;
}
export type TabItem = {
    label: string;
    key?: string;
    value: number;
    list: Order[];
    url?: string;
};
