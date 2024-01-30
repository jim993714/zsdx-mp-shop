export interface GoodsList {
    list: GoodsItem[];
    scrollId: string;
    startTime: number;
    endTime: number;
    rules: string[];
}

export interface GoodsItem {
    startTime: number;
    endTime: number;
    goodsNo: string;
    activityNo: string;
    productNo: string;
    goodsCover: string;
    goodsTitle: string;
    goodsPrice: number;
    subsidyPrice: number;
    subsidyMoney: number;
    goodsStock: number;
    isSetAlter: number;
    goodsShowPrice: number;
    goodsShowPriceType: number;
    goodsShowOriginPrice: number;
    levelList: Level[];
    saleNum: number;
    maxSubsidy: number;
}

export interface Level {
    num: number;
    discount: number;
    money: number;
}
