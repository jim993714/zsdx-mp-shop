import type { CancelApplyReq } from '../api/order-after/types/order-after-list';

export const formKey: InjectionKey<CancelApplyReq> = Symbol('CancelApplyReq');

export const RECEIVE_STATUS_LIST: { value: number; label: string }[] = [
    {
        label: '未收到货',
        value: 0
    },
    {
        label: '已收到货',
        value: 1
    }
];

export const RESULT_STATUS_LIST: string[] = [
    '买多/买错/不想要',
    '未发货仅退款',
    '商品破损',
    '快递丢件',
    '物流长时间未更新',
    '其他'
];
