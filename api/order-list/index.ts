import { useRequest } from '@zsdx/mp-utils';

import type { Order } from '../order/types';
import type { OrderSearchParam } from './types';

const request = useRequest();

/**
 * 获取订单列表
 * @param params
 * @returns 订单列表返回
 */
export function getOrderList(params: OrderSearchParam) {
    return request.post<{
        list: Order[];
        scrollId: '';
    }>('/student-school-shop/order/list', params);
}
