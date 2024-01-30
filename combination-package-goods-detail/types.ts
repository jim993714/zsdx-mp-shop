export type CoverItem = {
    type: number;
    cover: string;
    videoUrl?: string;
};

export interface skuResult {
    productNo: string;
    count: number;
    price: number;
}
export interface GoodsInfo {
    goodsNo: string;
    goodsCover: string;
    goodsPrice: number;
    buyLimitCount: number;
    buyCount: number;
    goodsTitle?: string;
}
export interface Product {
    productNo: string;
    productPrice: number;
    productImage: string;
    productStock: number;
    productIdentify: string;
    specList: SpecItem[];
}
export interface Spec {
    name: string;
    list: SpecItem[];
}

export interface SpecItem {
    specNo: string;
    specValue: string;
    checked?: boolean;
    disabled?: boolean;
}
export interface ReductionItem {
    require_num: number;
    reduction_price: number;
}
export interface Reduction {
    reduction_type: number;
    list: ReductionItem[];
}
