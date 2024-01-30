import { useRequest } from '@zsdx/mp-utils';

import type { CheckReceiveSuccessRes, ReceivePacketParams, ReceivePacketRes } from './types';

const request = useRequest();

/**
 * 领取优惠券
 */
export function receivePacket(params: ReceivePacketParams) {
    return request.post<ReceivePacketRes>('/student-school-shop/RedPacket/receive', params);
}

/**
 * 判断队列是否领取成功
 */
export function checkReceiveSuccess(receiveTicket: string) {
    return request.post<CheckReceiveSuccessRes>('/student-school-shop/RedPacket/checkReceive', {
        receiveTicket
    });
}
