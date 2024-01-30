import type { OrderDetailResp } from '../../api/order/types';

export function filterStatus(order: OrderDetailResp | undefined) {
    if (!order) {
        return '';
    }
    switch (order.status) {
        case 0:
            return '待付款';
        case 1:
            return '拼团中';
        case 2:
            if (order.disputeStatus == 1 || order.disputeStatus == 2) {
                return '投诉处理中';
            } else {
                return '待发货';
            }
        case 3:
        case 301:
        case 302:
            if (order.disputeStatus == 1 || order.disputeStatus == 2) {
                return '投诉处理中';
            } else if (order.status == 302) {
                return '校内员工送件中';
            } else {
                return '待收货';
            }
            return '待付款';
        case 4:
            return '已完成';
        case -1:
            return '交易失败';
        case -2:
        case -4:
            if (order.cancelApplyType == 1) {
                return '申请退款中';
            } else if (order.cancelApplyType == 2) {
                return '申请退货中';
            }
            return '待付款';
        default:
            return '未知';
    }
}
