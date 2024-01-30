import dayjs from 'dayjs';

import type { PacketItem } from '../../types';

export function getAcceptStatus(packet: PacketItem) {
    const time = dayjs().unix();

    if (
        packet.get_start_time <= time &&
        packet.get_end_time >= time &&
        (packet.receive_count < packet.get_limit_count || packet.get_limit_count <= 0) &&
        packet.has_last_count == 0
    ) {
        return -3; // 已抢完
    } else if (packet.receive_status == 1) {
        return 2; // 已领取
    } else if (packet.receive_status === 0) {
        return 1; // 未领取
    } else {
        return -1; // 失效
    }
}

export function getCouponStatusIcon(packet: PacketItem) {
    const status = getAcceptStatus(packet);

    switch (status) {
        case -3:
            return 'zdmp-yiqiangwan';
        case 2:
            return 'zdmp-yilingqu';
        case -1:
            return 'zdmp-yishixiao';
        default:
            return '';
    }
}
