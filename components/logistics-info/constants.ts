import { TrackingDetailStatus } from '../../api/order/types';

/** 物流状态文案 */
export const trackingStatusLabel = {
    [TrackingDetailStatus.Ordered]: '已下单',
    [TrackingDetailStatus.Shipped]: '已发货',
    [TrackingDetailStatus.Collected]: '已揽件',
    [TrackingDetailStatus.Transport]: '运输中',
    [TrackingDetailStatus.Signed]: '已签收',
    [TrackingDetailStatus.WorkerCollected]: '校内员工已取件',
    [TrackingDetailStatus.WorkerDelivery]: '校内员工送件中',
    [TrackingDetailStatus.WorkerSigned]: '校内员工签收'
};
