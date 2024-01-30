import dayjs from 'dayjs';

import type { CouponItem } from '../../types';

export function getAcceptStatus(coupon: CouponItem) {
    const time = dayjs().unix();

    if (
        coupon.get_start_time <= time &&
        coupon.get_end_time >= time &&
        (coupon.receive_count < coupon.get_limit_count || coupon.get_limit_count <= 0) &&
        coupon.has_last_count == 0
    ) {
        return -3; // 已抢完
    } else if (coupon.receive_status == 1) {
        return 2; // 已领取
    } else if (coupon.receive_status === 0) {
        return 1; // 未领取
    } else {
        return -1; // 失效
    }
}

export function getCouponStatusIcon(coupon: CouponItem) {
    const status = getAcceptStatus(coupon);

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
