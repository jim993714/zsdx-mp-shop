/**
 * 售后类型
 */
export const enum EnumOrderAfterType {
    REFUND = 1,
    REFUND_RETURN,
    EXCHANGE
}

/**
 *
 */
export const STATUS_MAP: Record<
    number,
    { title: string; cardHeader: string; status: string; status2: string; icon: string }
> = {
    [EnumOrderAfterType.REFUND]: {
        title: '我要退款',
        cardHeader: '退款商品',
        status: '仅退款',
        status2: '退款',
        icon: 'http://cdn.zsdx.cn/mp-cs/images/shop/order/order-after-type-1.png'
    },
    [EnumOrderAfterType.REFUND_RETURN]: {
        title: '我要退货退款',
        cardHeader: '退款商品',
        status: '退货退款',
        status2: '退货退款',
        icon: 'http://cdn.zsdx.cn/mp-cs/images/shop/order/order-after-type-2.png'
    },
    [EnumOrderAfterType.EXCHANGE]: {
        title: '我要换货',
        cardHeader: '换货商品',
        status: '换货',
        status2: '换货',
        icon: 'http://cdn.zsdx.cn/mp-cs/images/shop/order/order-after-type-3.png'
    }
};

/** 订单取消申请状态 1:申请中,11:退货申请审核通过,12:退货已发货,13:换货待商家发货,14:换货商家已寄货,15:换货待买家签收,2:申请通过,3:换货超时退款成功,-1:申请不通过,-2:撤销申请 */
export const ORDER_STATUS_MAP: Record<string | number, string> = {
    '-2': '撤销申请',
    '-1': '申请不通过',
    1: '申请中',
    2: '申请通过',
    11: '退货申请审核通过',
    12: '退货已发货',
    13: '换货待商家发货',
    14: '换货商家已寄货',
    15: '换货待买家签收',
    /** 极速退款相关 */
    101: '极速退款待校内员工审核',
    102: '极速退款校内员工审核通过',
    103: '极速退款校内员工拒绝',
    104: '极速退款待打款',
    105: '极速退款打款失败',
    111: '商家拒绝极速退款'
};
