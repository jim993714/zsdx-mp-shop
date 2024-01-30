import { useRequest } from '@zsdx/mp-utils';

import type { OrderDetailResp } from '../order/types';

const request = useRequest();

/**
 * 获取订单列表
 * @param params
 * @returns 订单列表返回
 */
export function getOrderDetail(params: { orderNo: string }): Promise<OrderDetailResp> {
    return request.post<OrderDetailResp>('/student-school-shop/order/detail', params);
}

/**
 * 取消订单
 * @param params
 * @returns
 */
export function cancelOrder(params: { orderNo: string }) {
    return request.post('/student-school-shop/order/manage/cancel', params);
}

/**
 * 确认收货
 * @param params
 * @returns
 */
export function completeOrder(params: { orderNo: string }) {
    return request.post('/student-school-shop/order/manage/complete', params);
}

/**
 * 删除订单
 * @param params
 * @returns
 */
export function deleteOrder(params: { orderNo: string }) {
    return request.post('/student-school-shop/order/manage/delete', params);
}

/**
 * 提醒发货
 * @param params
 * @returns
 */
export function remindDeliver(params: { orderNo: string }) {
    return request.post('/student-school-shop/order/manage/deliver/remind', params);
}
