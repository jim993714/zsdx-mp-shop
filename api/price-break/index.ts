import { useRequest } from '@zsdx/mp-utils';

import type { GoodReportReq, MyGoodReportListReq, MyGoodReportListResp } from './types';

const request = useRequest();

/**
 * 获取我的全部爆料列表
 * @param params
 * @returns
 */
export function fetchMyGoodsReportList(params: MyGoodReportListReq) {
    return request.post<MyGoodReportListResp>(
        '/student-school-shop/goods/getMyGoodsReportList',
        params
    );
}

/**
 * 爆料低价
 * @param params
 * @returns
 */
export function addMyGoodsReport(params: GoodReportReq) {
    return request.post('/student-school-shop/goods/reportLowerPrice', params);
}

/**
 * 获取商品规格信息
 * @param params
 * @returns
 */
export function getGoodsSpecList(params: {
    studentShopId: string;
    goodsNo: string;
    zsdxPwd?: string;
}) {
    return request.post('/student-school-shop/goods/getGoodsSpecList', params);
}

/**
 *  获取本月爆料低价的优惠收益
 * @param params
 * @returns
 */
export function getMyGoodsReportMoney(params: { goodsNo: string }) {
    return request.post<number>('/student-school-shop/goods/getMyGoodsReportMoney', params);
}
