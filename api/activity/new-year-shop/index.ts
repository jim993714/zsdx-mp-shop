import { useRequest } from '@zsdx/mp-utils';

import type { GoodsList } from './types';

const request = useRequest();

/**
 * 获取优惠券列表
 */
export function getGoodsList(params: {
    activityNo: string;
    keywords?: string;
    sortField?: string;
    sortType?: string;
    size: number;
    scrollId: string;
}) {
    return request.post<GoodsList>('/student-school-shop/stepGroup/getGoodsList', params);
}
