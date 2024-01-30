import type { ActivityInfo } from '../goods-detail/types';

export interface GoodsDetail {
    goodsNo: string;
    goodsType: number;
    goodsTitle: string;
    goodsCover: string;
    goodsPrice: number;
    goodsPricePay: number;
    goodsImageList: any[];
    goodsTagList: GoodsTagList[];
    goodsFreight: number;
    goodsPriceOrigin: number;
    goodsHeaderExtra: GoodsHeaderExtra[];
    goodsContent: string;
    zsdxPwd: string;
    specList: SpecList[];
    shopInfo: ShopInfo;
    buyLimitCount: number;
    lastBuyCount: number;
    couponMoney: string;
    coverVideo: CoverVideo;
    productList: ProductList[];
    goodsSale: number;
    goodsStatus: number;
    studentShopInfo: StudentShopInfo;
    delayDay: number;
    goodsNum: number;
    status: number;
    freightInfo: FreightInfo;
    companyName: string;
    hireNo: string;
    platformStudentPriceStatus: number;
    recommendWords: string;
    goodsReductionMoney: number;
    activityType: number;
    activityInfo: ActivityInfo;
    buyCount: number;
    collectStatus: number;
    reductionInfo: ReductionInfo;
    newRecruitHireGoodsStatus: number;
}

export interface GoodsTagList {
    title: string;
    desc: string;
}

export interface GoodsHeaderExtra {
    title: string;
    content: string;
}

export interface SpecListElement {
    specNo: string;
    specValue: string;
}

export interface SpecList {
    name: string;
    list: SpecListElement[];
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

export interface CoverVideo {
    videoUrl: string;
    videoCover: string;
}

export interface ProductList {
    goodsTitle: string;
    productNo: string;
    productPrice: number;
    productImage: string;
    productStock: number;
    productIdentify: string;
    specList: SpecListElement[];
    lastDays: number;
    buyLimitCount: number;
    buyCount: number;
}

export interface StudentShopInfo {
    shopName: string;
    shopLogo: string;
    shopSubtitle: string;
    schoolName: string;
    trueName: string;
}

export interface FreightInfo {
    freightType: number;
    freightMoney: number;
}

export interface ReductionInfo {
    reductionType: number;
    list: ReductionInfoList[];
}

export interface ReductionInfoList {
    requireNum: number;
    reductionPrice: number;
}
