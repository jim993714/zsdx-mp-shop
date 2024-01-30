export interface MyGoodReportListReq {
    /** 滚动id， 第一页使用空字符串*/
    scrollId?: string;
    /** 加载数量*/
    size?: number;
}

/**
 * 滚动列表返回结果
 */
export interface MyGoodReportListResp {
    /** 列表*/
    list?: ListItem[];
    /** 滚动id， 为空表示没有下一页*/
    scrollId?: string;
}
/**
 * 列表
 */
export interface ListItem {
    /** 爆料时间*/
    reportTime?: string;
    /** 爆料价格*/
    reportPrice?: number;
    /** 商品图片*/
    goodsUrl?: string;
    /** 商品标题*/
    goodsTitle?: string;
    /** 商品编号*/
    goodsNo?: string;
    /** 状态：0-审核中 1-审核通过 -1-审核未通过*/
    state?: number;
    /** 规格*/
    spec: Spec[];
    /** 审核未通过理由 */
    verifyFailReason?: string;
}
/**
 * 规格
 */
export interface Spec {
    /** 规格名称*/
    name?: string;
    /** 规格编号*/
    specNo?: string;
    /** 规格值*/
    specValue?: string;
}

/**
 * 添加爆料
 */
export interface GoodReportReq {
    productNo: string;
    reportPrice: number | string;
    url: string;
    imageUrls: string[];
    spec: Spec[];
}
