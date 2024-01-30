export interface GoodsInfo {
    goodsNo: string;
    saleNo: string;
    lotteryNo: string;
    orderOrderSubsidyActivityNo: string;
    welfareNo: string;
    schoolSeasonCombinationPackageActivityId: string;
    goodsNumber: string;
    thumbPic: string;
    title: string;
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
    price: string;
    priceOri: string;
    num: number;
    discountMoney: string;
    commission: string;
    freight: string;
    money: string;
    canCancelApply: number;
    canCancelApplyNum: number;
    canCancelApplyFreight: string;
    canCancelApplyMoney: string;
    cancelApplyNo: string;
    cancelStatus: number;
}

export interface BuyStudent {
    studentNo: string;
    isSelf: number;
    isOwner: number;
    trueName: string;
    headImg: string;
    orderItemList: OrderItem[];
    productMoney: string;
    freight: string;
    discountMoney: string;
    money: string;
    payStatus: number;
    payTime: string;
    payExpireTime: string;
}

export interface DiscountInfo {
    type: number;
    desc: string;
    discountMoney: string;
}

export interface SelfDiscountInfo {
    type: number;
    desc: string;
    discountMoney: number;
}

export interface AddressInfo {
    userName: string;
    phone: string;
    detailInfo: string;
    provinceName?: string;
    cityName?: string;
    countyName?: string;
}

export interface DormitoryAddressInfo {
    userName: string;
    phone: string;
    wechat: string;
    detailInfo: string;
}

export interface VirtualBuyInfo {
    title: string;
    value: string;
    type?: number;
}

export interface Data {
    name: string;
    value: string;
}

export interface VirtualKey {
    exchangeUrl: string;
    data: Data[];
}

export interface VirtualTrackingInfo {
    type: number;
    exchangeCode: string;
    virtualKeys: VirtualKey[];
}

export interface TissueDumplingInfo {
    tissueDumplingId: string;
    missStudentNum: number;
}

export interface MemberList {
    studentHeadImg: string;
}

export interface TuanInfo {
    studentHeadImg: string;
    memberList: MemberList[];
    lastPeoNum: number;
    endTime: string;
    completeTime: string;
}

export interface GroupBuyingInfo {
    buyingNo: string;
    buyingStatus: number;
}

export interface StudentList {
    headImg: string;
}

export interface WorkHireAgentGoodsGroup {
    applyNo: string;
    agentStudentNo: string;
    studentCount: number;
    studentList: StudentList[];
}

export interface OrderDetail {
    orderCategory: number;
    fromType: number;
    shopNo: string;
    shopTitle: string;
    studentShopId: string;
    studentShopName: string;
    buyStudentList: BuyStudent[];
    productMoney: string;
    freight: string;
    discountMoney: string;
    discountInfo: DiscountInfo[];
    money: string;
    status: number;
    statusDesc: string;
    selfPayOrderNo: string;
    selfPayRequireMulti: number;
    selfPayStatus: number;
    selfPayTime: string;
    selfFreight: string;
    selfDiscountInfo: SelfDiscountInfo[];
    selfMoney: string;
    payExpireTime: string;
    paidStudentCount: number;
    unPayStudentCount: number;
    createTime: string;
    remark: string;
    trackingBySchoolAgent?: number;
    shipType?: number;
    addressInfo?: AddressInfo;
    dormitoryAddressInfo?: DormitoryAddressInfo;
    virtualBuyInfo?: VirtualBuyInfo[];
    virtualTrackingInfo?: VirtualTrackingInfo;
    tuanNo?: string;
    tissueDumplingInfo?: TissueDumplingInfo;
    tuanInfo?: TuanInfo;
    groupBuyingInfo?: GroupBuyingInfo;
    workHireAgentGoodsGroup?: WorkHireAgentGoodsGroup;
    alertHireToDeliver?: number;
    isOwner?: number;
    canReview?: number;
    changeAddressMsgId?: string;
    awardNo?: string;
}
