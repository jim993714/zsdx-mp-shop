export type CollectParam = {
    goodsNo: string;
    studentShopId: string;
    type: number;
    collectStatus: number;
};

export type GoodsCouponParams = {
    goodsNo: string;
    studentShopId: string;
    onlyHireCoupon: number;
};

export type GoodsDetailParams = {
    goodsNo?: string;
    actGoodsNo?: string;
    studentShopId: string;
    saleNo?: string;
    activityNo?: string;
    zsdxPwd?: string;
    zoneId?: string;
    schoolDumplingId?: string;
    timeId?: string;
    date?: string;
};

export type CoverItem = {
    type: number;
    cover: string;
    videoUrl?: string;
};
export interface GoodsHeaderExtra {
    title: string;
    content: string;
}

export interface SpecItem {
    specNo: string;
    specValue: string;
}

export interface Spec {
    name: string;
    list: SpecItem[];
}

export interface Product {
    productNo: string;
    productPrice: number;
    productImage: string;
    productStock: number;
    productIdentify: string;
    specList: SpecItem[];
    goodsShowPrice?: number;
    goodsShowOriginPrice?: number;
    goodsShowPriceType?: number;
}

export interface ShopInfo {
    shopNo: string;
    shopType: number;
    shopTitle: string;
    shopLogo: string;
    levelMoney: number;
    levelLogo: string;
    goodsNum: number;
    goodsSale: number;
    shopStatus: number;
    closeTime: number;
    content: string;
}

export interface StuAgentInfo {
    trueName: string;
    phone: string;
    headImg: string;
}

export interface StuAgentList {
    totalCount: number;
    list: StuAgentInfo[];
}

export interface FreightInfo {
    freightType: number;
    freightMoney: number;
}

export interface CoverVideo {
    videoUrl: string;
    videoCover: string;
}
export interface GoodsTag {
    title: string;
    desc: string;
}
export interface GoodsDetail {
    canQuickRefund?: number;
    goodsNo: string;
    goodsTitle: string;
    goodsCover: string;
    goodsImageList: string[];
    goodsPrice: number;
    goodsPricePay: number;
    goodsPriceOrigin: number;
    goodsFreight: number;
    goodsTagList: GoodsTag[];
    goodsContent: string;
    goodsStatus: number;
    saleNum?: number;
    buyLimitCount: number;
    buyCount: number;
    goodsType: number;
    goodsHeaderExtra: GoodsHeaderExtra[];
    specList: Spec[];
    productList: Product[];
    shopInfo: ShopInfo;
    stuAgentList?: StuAgentList;
    freightInfo: FreightInfo;
    coverVideo: CoverVideo;
    platformStudentPriceStatus?: number;
    recommendWords?: string;
    workHireNotAgentRebateMoney?: number;
    goodsReductionMoney: number;
    activityType: number;
    companyName: string;
    hireNo: string;
    collectStatus?: number;
    limitOrder?: number;
    newRecruitHireGoodsStatus?: number;
    discount?: number;
    activityInfo?: ActivityInfo;
    // 秒杀
    saleStartTime?: number; //开始时间
    saleEndTime?: number; //开始时间
    status?: number; //秒杀状态
    goodsNum?: number;
    goodsSale?: number;
    alertStatus?: number;
    // 折扣
    gradient?: number;
    otherExtend?: any;
    isSummerActivityWeek?: number;
    reductionInfo: {
        reductionType: number;
        list: any[];
    };
    zsdxPwd?: string;
    actGoodsNo?: string;
    timeId?: string;
    activityAdditionalInfoDTO?: ActivityAdditionalInfoDTO;
    goodsShowPrice?: number;
    goodsShowOriginPrice?: number;
    goodsShowPriceType?: number;
    isCanUse?: boolean;
}

export interface ActivityAdditionalInfoDTO {
    activityTagImg?: string;
    width?: number;
    height: number;
}
export interface ActivityInfo {
    activityNo?: string;
    isActivityGoods: number;
    activityTitle: string;
    activityStatus: number;
    activityStartTime: number;
    activityEndTime: number;
    activityPrice: number;
    activityPriceOrigin: number;
    activitySubsidy: number;
    goodsBanner: string;
    expireTime?: number;
    schoolDumplingId: string;
    leaderType: number;
    leaderIdentity: number;
    memberIdentity: number;
    studentNum: number;
    dumplingBuyType: number;
    haveUnFinishedDumpling: boolean;
    productList: Product[];
    actGoodsNo?: string;
    timeId: string;
    subActivityType?: number /** 活动类型 1: 普通大促, 4:阶梯团购返现 */;
    maxSubsidy?: number /** 阶梯团购返现金额 */;
    levelList?: CashbackStep[];
    saleNum?: number;
}
export interface CashbackStep {
    num: number;
    discount: number;
    money: number;
}
export interface GoodsInfo {
    goodsNo: string;
    saleNo: string;
    lotteryNo: string;
    goodsNumber: string;
    thumbPic: string;
    title: string;
    isCrossBorder: number;
    goodsShowPrice?: number;
    goodsShowOriginPrice?: number;
    goodsShowPriceType?: number;
}
export interface Coupon {
    isOfficial?: number;
    packetStatus?: number;
    shopNo?: string;
    hasLastCount?: number;
    couponStatus?: number;
    receiveStatus?: number;
    receiveCount?: number;
    couponType?: number;
    isSingleGoods?: number;
    useLimitType?: number;
    useStartTime: number;
    useEndTime: number;
    getLimitCount?: number;
    getStartTime?: number;
    getEndTime?: number;
    packetNo?: string;
    type?: string;
    isReceived?: number;
    title?: string;
    couponNo?: string;
    discountNum?: number;
    discountNumMax?: number;
    discountInfo?: string;
    discountLimitType: number;
    discountLimit: number;
}
export type TagInfo = {
    width: number;
    url: string;
};
// sku选择类型: 1: 常规购买, 2: 添加购物车, 3: 开团, 4: 参团购买
export type SkuPopType = 1 | 2 | 3 | 4;

export interface ReceiveResult {
    result: number;
    errorResult: number;
    studentCouponNo: string;
    receiveTicket?: string;
    failReason: number;
}
