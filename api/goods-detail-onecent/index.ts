import { useRequest } from '@zsdx/mp-utils';

import type { GoodsDetail } from './types';

const request = useRequest();

/** 获取一分购商品详情 */
export function fetchPennyGoodsDetail(params: {}) {
    return request.post<GoodsDetail>('/student-school-shop/pennyGoods/getPennyGoodsDetail', params);
}

/** 检查是否可以购买一分购商品 */
export function fetchLimit(params: {
    activityNo: string;
    goodsNo: string;
    studentShopId: string;
    zsdxPwd?: string;
}) {
    return request.post<{
        canBuy: boolean;
        desc: string;
    }>('/student-school-shop/pennyGoods/checkPennyGoodsLimit', params);
}
