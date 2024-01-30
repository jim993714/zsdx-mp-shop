import { EnumOrderAfterType } from '@/api/order-after/types/constants';

import type { Step } from './types';

export const STEP_OPTIONS_MAP: Record<number, Step[]> = {
    [EnumOrderAfterType.REFUND]: [
        { label: '提交申请' },
        { label: '商家处理' },
        { label: '售后完成' }
    ],
    [EnumOrderAfterType.REFUND_RETURN]: [
        { label: '提交申请' },
        { label: '商家处理' },
        { label: '寄回商品' },
        { label: '售后完成' }
    ],
    [EnumOrderAfterType.EXCHANGE]: [
        { label: '提交申请' },
        { label: '商家处理' },
        { label: '寄回商品' },
        { label: '商家寄货' },
        { label: '售后完成' }
    ],
    /** 极速退款独立的进度条 */
    100: [
        { label: '提交申请' },
        { label: '校园代理审核' },
        { label: '寄回商品' },
        { label: '售后完成' }
    ]
};
