import type { Order } from '../../order-list/types';

export type MultiPayResult = {
    payOrderNo: string;
    order: Order;
    money: number;
};
