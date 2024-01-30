import { useRequest } from '@zsdx/mp-utils';

import type {
    Address,
    Allowance,
    Coupon,
    OrderParams,
    RedPacket,
    StudentShopRedPack
} from '../../order-confirm/types';
import type { CheckLottery, DiscountResult, OrderPreview, PreviewParam } from './types';

const request = useRequest();

/**
 * 订单预览
 * @param params
 * @returns 优惠券红包列表
 */
export function preview(params: PreviewParam) {
    return request.post<OrderPreview>('/student-school-shop/order/preview/preview', params);
}
/**
 * 获取默认地址
 * @param params
 * @returns 优惠券红包列表
 */
export function getDefaultAddress(params: { type: number }): Promise<Address> {
    return request.post<Address>('/student-school-shop/userAddress/getDefaultAddress', params);
}
/**
 * 创建订单
 * @param params
 * @returns
 */
export function createOrder(params: PreviewParam, traceData: any) {
    const postParams = {
        ...params,
        ...traceData
    };
    console.log('createOrder', postParams);
    return request.post<string>('/student-school-shop/order/backend/create', postParams);
}
/**
 * 订单队列结果查询
 * @param params
 * @returns
 */
export function checkOrder(params: { ticket: string }) {
    return request.post<OrderParams>('/student-school-shop/order/backend/check/queue', params);
}

/**
 * 获取津贴
 * @param params
 * @returns
 */
export function getAllowance(params: PreviewParam) {
    return request.post<DiscountResult<Allowance>>(
        '/student-school-shop/order/preview/allowance',
        params
    );
}
/**
 * 获取优惠券
 * @param params
 * @returns
 */
export function getCoupon(params: PreviewParam) {
    return request.post<DiscountResult<Coupon>>(
        '/student-school-shop/order/preview/coupon',
        params
    );
}
/**
 * 获取红包
 * @param params
 * @returns
 */
export function getRedPack(params: PreviewParam) {
    return request.post<DiscountResult<RedPacket>>(
        '/student-school-shop/order/preview/redpack',
        params
    );
}
/**
 * 获取社群红包
 * @param params
 * @returns
 */
export function getStudentShopRedPack(params: PreviewParam) {
    return request.post<DiscountResult<StudentShopRedPack>>(
        '/student-school-shop/order/preview/studentshopredpack',
        params
    );
}
/**
 * 获取推荐津贴
 * @param params
 * @returns
 */
export function getRecommendAllowance(params: PreviewParam) {
    return request.post<string>('/student-school-shop/order/preview/recommand/allowance', params);
}
/**
 * 获取推荐优惠券
 * @param params
 * @returns
 */
export function getRecommendCoupon(params: PreviewParam) {
    return request.post<string[]>('/student-school-shop/order/preview/recommand/coupon', params);
}
/**
 * 获取推荐红包
 * @param params
 * @returns
 */
export function getRecommendRedPack(params: PreviewParam) {
    return request.post<string[]>('/student-school-shop/order/preview/recommand/redpack', params);
}
/**
 * 获取推荐社群红包
 * @param params
 * @returns
 */
export function getRecommendStudentShopRedPack(params: PreviewParam) {
    return request.post<string[]>(
        '/student-school-shop/order/preview/recommand/studentshopredpack',
        params
    );
}
/**
 * 获取推荐社群红包
 * @param params
 * @returns
 */
export function checkLottery(params: { orderNo: string }) {
    return request.post<CheckLottery>('/student-school-shop/order/finish/check/lottery', params);
}
/**
 * 检测优惠券是否可用
 * @param params
 * @returns
 */
export function checkCoupon(params: PreviewParam) {
    return request.post<string[]>('/student-school-shop/order/preview/coupon/available', params);
}
/**
 * 检测优惠券是否可用
 * @param params
 * @returns
 */
export function checkRedPack(params: PreviewParam) {
    return request.post<string[]>('/student-school-shop/order/preview/redpack/available', params);
}
/**
 * 检测优惠券是否可用
 * @param params
 * @returns
 */
export function checkStudentShopRedPack(params: PreviewParam) {
    return request.post<string[]>(
        '/student-school-shop/order/preview/studentshopredpack/available',
        params
    );
}
