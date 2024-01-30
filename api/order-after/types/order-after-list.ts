/** 订单列表请求 */
export interface OrderCancelApplyReq {
    /** 滚动id， 第一页使用空字符串 */
    scrollId?: string;
    /** 加载数量 */
    size?: number;
}

/** 订单列表响应 */
export interface OrderCancelApplyResp {
    /** 列表 */
    list?: OrderCancelApplyBase[];
    /** 滚动id， 为空表示没有下一页 */
    scrollId?: string;
}

/** 订单售后列表信息 */
export interface OrderCancelApplyBase {
    /** 退款申请编号 */
    applyNo?: string;
    /** 类型 1:仅退款, 2:退货退款, 3:换货 */
    type?: number;
    /** shop_description */
    shopTitle?: string;
    /** 店铺名称 */
    orderNo?: string;
    /** 子订单信息 */
    orderItemList?: OrderItem[];
    /** 总价 */
    money?: number;
    /** 售后数量 */
    cancelApplyNum?: number;
    /** 退款总金额 */
    refundMoney?: number;
    /** 订单取消申请状态 1:申请中,11:退货申请审核通过,12:退货已发货,13:换货待商家发货,14:换货商家已寄货,15:换货待买家签收,2:申请通过,3:换货超时退款成功,-1:申请不通过,-2:撤销申请 */
    status?: number;
    /** 拒绝原因 */
    refuseReason?: string;
    /** 创建时间 */
    createTime?: number;
    /** 是否可申请取消订单 0:否, 1:是, 2:订单完成超出7天 */
    canCancelApply?: number;
    /** 是否可申请客服介入 1:是, 0:否 */
    canDispute?: number;
}

/** 订单明细信息 */
export interface OrderItem {
    /** 子订单序号 */
    index?: number;
    goodsInfo?: ReviewListGoodInfo;
}

/** 商品信息 */
export interface ReviewListGoodInfo {
    /** 商品编号 */
    goodsNo?: string;
    /** 商品货号 */
    goodsNumber?: string;
    /** 商品名称 */
    goodsTitle?: string;
    /** 商品封面 */
    goodsCover?: string;
}

/** 取消订单申请请求 */
export interface CancelApplyReq {
    /** 订单编号 */
    orderNo?: string;
    /** 订单下标编号 */
    index?: string[];
    /** 申请取消类型1:仅退款, 2:退货退款, 3:换货 */
    type?: number;
    /** 售后数量不提交则售后全部 */
    num?: number;
    /** 售后金额不提交则对应售后数量的金额 */
    money?: string;
    /** 是否收到货1:是, 0:否 */
    receiveGoods?: number;
    /** 退货原因 */
    reason?: string;
    /** 备注 */
    remark?: string;
    /** 用户提交证明图片 */
    evidence?: string[];
    /** 地址编号 */
    addressId?: number;
    /** 退货原因id只在整单退的时候有效，其余传0 */
    reasonId?: string;
    /** 是否极速退款, 1:是, 0:否 */
    fastRefund?: 0 | 1;
    /** 极速退款打款帐号	 */
    fastRefundAccount?: string;
    /** 极速退款打款姓名 */
    fastRefundAccountName?: string;

    /** 自定义表单字段 */
    _price?: any;
    /** 能否使用极速退款 */
    _canUseQuickRefund?: boolean;
    /** 是否禁止使用 */
    _forbidQuickRefund?: boolean;

    _goodsNo?: string;

    _shopNo?: string;

    _studentShopId?: string;
}

/**
 * 售后协商历史信息
 */
export interface OrderCancelApplyHistory {
    /** 标题 */
    title?: string;
    /** 内容 */
    desc?: string;
    /** 创建时间 */
    createTime?: string;
}

/** 退货物流单号 */
export interface OrderCancelRejectTrackingReq {
    /** 申请编号*/
    applyNo?: string;
    /** 物流公司编号*/
    logisticsNo?: string;
    /** 运单编号*/
    trackingNo?: string;
}

/** 更新申请 */
export interface UpdateCancelApplyInfoReq {
    /** 申请编号*/
    applyNo?: string;
    /** 售后数量,不提交则售后全部*/
    num?: number;
    /** 是否收到货*/
    receiveGoods?: boolean;
    /** 退货原因*/
    reason?: string;
    /** 备注*/
    remark?: string;
    /** 用户提交证明图片*/
    evidence?: string[];
    /** 地址编号*/
    addressId?: number;
}

/**
 * 退款理由
 */
export interface ReasonItem {
    id: number;
    orderStatus: number;
    content: string;
}

/**
 * 物流列表项
 */
export interface LogisticsItem {
    logisticsNo: string;

    name: string;
}
