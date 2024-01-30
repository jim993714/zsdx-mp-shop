import { useRequest } from '@zsdx/mp-utils';

import type { CheckReceiveSuccessRes, ReceiveCouponParams, ReceiveCouponRes } from './types';

const request = useRequest();

/**
 * 领取优惠券
 */
export function receiveCoupon(params: ReceiveCouponParams) {
    return request.post<ReceiveCouponRes>('/student-school-shop/Coupon/receive', params);
}

/**
 * 判断队列是否领取成功
 */
export function checkReceiveSuccess(receiveTicket: string) {
    return request.post<CheckReceiveSuccessRes>('/student-school-shop/Coupon/checkReceive', {
        receiveTicket
    });
}
