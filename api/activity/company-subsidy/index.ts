import { useRequest } from '@zsdx/mp-utils';

import type { ISummerGoodsListReq } from './types';

const request = useRequest();

/**
 * 暑期专区搜索结果列表
 * @param params
 * @returns
 */
export function getSummerGoodsList(params: ISummerGoodsListReq) {
    return request.post(
        '/student-school-shop/summerVacationDiscountActivity/getSearchList',
        params
    );
}

/**
 * 自由折扣专区搜索列表
 * @param params
 * @returns
 */
export function getSummerFreeGoodsList(params: ISummerGoodsListReq) {
    return request.post(
        '/student-school-shop/summerVacationFreeDiscountActivity/getSearchList',
        params
    );
}
