import { useRequest } from '@zsdx/mp-utils';

import type {
    AgentAddress,
    LogisticsInfoParams,
    LogisticsInfoRes,
    MultiPayInfo,
    OrderDetailResp
} from './types';

const request = useRequest();

/** 获取代收地址 */
export function getAgentAddress(params: { studentShopId: string }) {
    return request.post<AgentAddress>(
        '/student-school-shop/userAddress/getStudentShopAddress',
        params
    );
}

/** 获取共享优惠订单信息 */
export function getMultiPayInfo(params: { orderNo: string }) {
    return request.post<MultiPayInfo>('/student-school-shop/order/multi-pay-info', params);
}

/** 获取订单物流信息 */
export function getLogisticsInfo(params: LogisticsInfoParams) {
    return request.post<LogisticsInfoRes>('/student-school-shop/order/logistics/info', params);
}

/**
 * 获取订单详情
 * @param params
 */
export function fetchOrderDetail(params: { orderNo: string }) {
    return request.post<OrderDetailResp>('/student-school-shop/order/detail', params);
}
