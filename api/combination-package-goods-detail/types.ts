/**获取详情的参数*/
export interface IPackageParams {
    studentShopId: string;
    schoolSeasonCombinationPackageActivityId: string;
}

export interface ICombinationDetail {
    goodsFreight: string;
    schoolSeasonCombinationPackageActivityId: number;
    packageTitle: string;
    packageCover: string;
    fixedMoney: number;
    categoryId: number;
    sort: number;
    subsidyMoney: number;
    packageNum: number;
    packageCommissionRate: number;
    isSoldOut: number;
    studentShopId: number;
    shopTitle: string;
    shopNo: string;
    originPrice: number | string;
    packageTags: Array<IPackageTags>;
    goodsNum: number;
    packageRemark: string;
    startTime: number;
    endTime: number;
    warmUpStartTime: number;
    warmUpEndTime: number;
    goodsList: Array<IGoodsList>;
}

export interface IPackageTags {
    title: string;
    desc: string;
}

export interface IGoodsList {
    goodsPrice: number;
    goodsTitle: string;
    goodsCover: string;
    hireNo: string;
    goodsNo: string;
    goodsContent: string;
    shopInfo: IGoodsShopInfo;
    productList: Array<IProductList>;
    specList: Array<IGoodsListSpecList>;
    activitySpecList?: [];
    activityProductList: [];
    goodsImageList: string[];
    buyLimitCount: number;
    buyCount: number;
    workHireNotAgentRebateMoney: number;
    goodsReductionMoney: number;
    activityType: number;
    goodsShowPrice?: number;
    goodsShowOriginPrice?: number;
    goodsShowPriceType?: number;
}

export interface IGoodsShopInfo {
    shopNo: string;
    shopTitle: string;
    shopLogo: string;
}

export interface IProductList {
    goodsTitle: string;
    productNo: string;
    productPrice: number;
    productImage: string;
    productStock: number;
    productIdentify: string;
    specList: Array<IProductListSpecList>;
    lastDays: number;
    buyLimitCount: number;
    buyCount: number;
}

export interface IProductListSpecList {
    specNo: string;
    specValue: string;
}

export interface IGoodsListSpecList {
    name: string;
    list: Array<IGoodsListSpecListList>;
}

export interface IGoodsListSpecListList {
    specNo: string;
    specValue: string;
    specName: string;
}
