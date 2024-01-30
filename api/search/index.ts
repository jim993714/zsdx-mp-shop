import { useRequest } from '@zsdx/mp-utils';

import type { GoodsListReq, GoodsListResp } from './types';

const request = useRequest();

/**
 * 获取本店商品列表
 */
export function getGoodsList(params: GoodsListReq) {
    return request.post<GoodsListResp>('/student-school-shop/studentShop/getGoodsList', params);
}

/**
 * 关键词联想
 * @param params
 * @returns
 */
export function keywordSuggest(params: { keyWord: string }) {
    return request.post<string[]>('/student-school-shop/studentShop/keywordSuggest', params);
}
