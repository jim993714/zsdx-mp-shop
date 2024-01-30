import { useRequest } from '@zsdx/mp-utils';

import type { Dispute, DisputeDetail, Reason } from './types/dispute';
import type { FastRefundAccountReq, FastRefundPreResp } from './types/fast-refund';
import type {
    OrderCancelApplyBaseReq,
    OrderCancelApplyDetailResp
} from './types/order-after-details';
import type {
    CancelApplyReq,
    LogisticsItem,
    OrderCancelApplyHistory,
    OrderCancelApplyReq,
    OrderCancelApplyResp,
    OrderCancelRejectTrackingReq,
    ReasonItem,
    UpdateCancelApplyInfoReq
} from './types/order-after-list';

const request = useRequest();

/**
 * 订单售后列表
 * @param params
 * @returns
 */
export function fetchOrderCancelApplyList(params: OrderCancelApplyReq) {
    return request.post<OrderCancelApplyResp>(
        '/student-school-shop/order/cancelapply/list',
        params
    );
}

/**
 * 订单售后信息
 * @param params
 * @returns
 */
export function fetchOrderCancelApplyDetail(params: OrderCancelApplyBaseReq) {
    return request.post<OrderCancelApplyDetailResp>(
        '/student-school-shop/order/cancelapply/detail',
        params
    );
}

/**
 * 新增订单申请
 * @param params
 * @returns
 */
export function addOrderCancelApply(params: CancelApplyReq) {
    return request.post('/student-school-shop/order/cancelapply/apply', params);
}

/**
 * 订单售后信息
 * @param params
 * @returns
 */
export function delOrderCancelApply(params: OrderCancelApplyBaseReq) {
    return request.post('/student-school-shop/order/cancelapply/del', params);
}

/**
 * 订单售后确认完成
 * @param params
 * @returns
 */
export function completeOrderCancelApply(params: OrderCancelApplyBaseReq) {
    return request.post('/student-school-shop/order/cancelapply/complete', params);
}

/**
 * 订单售后协商历史
 * @param params
 * @returns
 */
export function fetchOrderCancelApplyHistory(params: OrderCancelApplyBaseReq) {
    return request.post<OrderCancelApplyHistory[]>(
        '/student-school-shop/order/cancelapply/history',
        params
    );
}

/**
 * 撤销取消订单申请
 * @param params
 * @returns
 */
export function repealOrderCancelApply(params: OrderCancelApplyBaseReq) {
    return request.post('/student-school-shop/order/cancelapply/repeal', params);
}

/**
 * 设置退货物流单号
 * @param params
 * @returns
 */
export function setTrack(params: OrderCancelRejectTrackingReq) {
    return request.post('/student-school-shop/order/cancelapply/supply/track', params);
}

/**
 * 修改取消订单申请
 * @param params
 * @returns
 */
export function updateOrderCancelApply(params: UpdateCancelApplyInfoReq) {
    return request.post('/student-school-shop/order/cancelapply/update', params);
}

/**
 * 获取售后原因列表
 * @param params
 * @returns
 */
export function getReasonList(params: { orderStatus: number }) {
    return request.post<ReasonItem[]>(
        '/student-school-shop/order/cancelapply/getReasonList',
        params
    );
}

/**
 * 获取物流信息列表
 */
export function getLogisticsList(params: { type: number; keyword: string }) {
    return request.post<{ list: LogisticsItem[] }>(
        '/student-school-shop/logistics/getList',
        params
    );
}

/** 添加纠纷 */
export function addDispute(params: Dispute) {
    return request.post('/student-school-shop/order/dispute/apply', params);
}

/** 获取纠纷原因 */
export function getDisputeReasion() {
    return request.post<Reason[]>('/student-school-shop/order/dispute/reason/list');
}

/**
 * 获取纠纷详情
 * @param params
 * @returns
 */
export function getDisputeDetail(params: { disputeNo: string }) {
    return request.post<DisputeDetail>('/student-school-shop/order/dispute/detail', params);
}

/**
 * 撤回纠纷
 * @param params
 * @returns
 */
export function repealDispute(params: { disputeNo: string }) {
    return request.post('/student-school-shop/order/dispute/repeal', params);
}

/**
 * 先退款后退货获取表单信息
 * @param params
 * @returns
 */
export function fetchOrderPreInfo(params: {
    goodsNo: string;
    shopNo: string;
    studentShopId: string;
}) {
    return request.post<FastRefundPreResp>(
        '/student-school-shop/order/cancelapply/apply/refund-before-return/pre',
        params
    );
}

/**
 * 获取代理人信息
 * @param params
 * @returns
 */
export function fetchAgentInfo(params: { orderNo: string }) {
    return request.post<{
        groupQrcode: string;
        phone: string;
    }>('/student-school-shop/order/cancelapply/proxy-info', params);
}

/**
 * 极速退款账户信息修改
 * @tips 只有状态status是103时，才调改此接口。
 * @param params
 * @returns
 */
export function updateAccountInfo(params: FastRefundAccountReq) {
    return request.post(
        '/student-school-shop/order/cancelapply/fast-refund-account/update',
        params
    );
}

export function getByTrackingNo(params: { trackingNo: string }) {
    return request.post<{
        logisticsNo: string;
        logisticsName: string;
    }>('/student-school-shop/logistics/getByTrackingNo', params);
}
