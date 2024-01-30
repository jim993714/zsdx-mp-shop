export interface GoodsListReq {
    /** 滚动id， 第一页使用空字符串*/
    scrollId?: string;
    /** 加载数量*/
    size?: number;
    /** 校园店id*/
    studentShopId?: string;
    /** 分类id*/
    categoryId?: number;
    /** 搜索类型：1-商品 2-企业*/
    searchType?: number;
    /** 排序字段*/
    sortField?: string;
    /** 排序方式*/
    sortType?: string;
    /** 排序方式*/
    keyWord?: string;
    /** 价格区间,index:0最小值 1最大值*/
    priceRange?: number[];
}

/**
 * 滚动列表返回结果
 */
export interface GoodsListResp {
    /** 列表*/
    list?: GoodsItem[];
    /** 滚动id， 为空表示没有下一页*/
    scrollId?: string;
}

/**
 * 列表
 */
export interface GoodsItem {
    /** 商品编号*/
    goodsNo?: string;
    /** 商品封面*/
    goodsCover?: string;
    /** 商品标题*/
    goodsTitle?: string;
    /** 商品价格*/
    goodsPrice?: number;
    /** 是否是学生价：1-是 0-不是*/
    isStudentPrice?: number;
    /** 商品原价格*/
    goodsPriceOrigin?: number;
    /** 是否参加活动：1-是 0-不是*/
    isJoinActivity?: number;

    /** 暑价 */
    vacationPrice: number;
    /** 折扣 */
    discount?: number;

    /** 是否是学生价 */
    platformStudentPriceStatus?: boolean;

    /** 专区id */
    zoneId?: string;

    actGoodsNo?: string;
    activityTagImg?: string /**大促标签*/;
    width?: number /**标签宽*/;
    height?: number /**标签高*/;
    goodsShowPrice?: number /**显示价*/;
    goodsShowOriginPrice?: number /**显示原价*/;
    goodsShowPriceType?: number /**价格类型*/;
    activityStatus?: number /**商品活动状态*/;
    timeId?: number /** 专区所属时间timeid */;
    maxSubsidy?: number;
}
