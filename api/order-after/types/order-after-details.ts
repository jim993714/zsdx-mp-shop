export interface OrderCancelApplyBaseReq {
    /** 申请编号 */
    applyNo?: string;
}

/** 订单售后详细信息 */
export interface OrderCancelApplyDetailResp {
    /** 来源类型 0:用户申请, 1:纠纷订单 */
    fromType?: number;
    /** 类型 1:仅退款, 2:退货退款 */
    type: number;
    /** 店铺编号 */
    shopNo: string;
    /** 店铺名称 */
    shopTitle: string;
    /** 订单编号 */
    orderNo: string;
    /** 子订单信息 */
    orderItemList: OrderItem[];
    /** 总价 */
    money: number;
    /** 售后数量 */
    cancelApplyNum?: number;
    /** 退款总金额 */
    refundMoney?: number;
    /** 申请原因 */
    reason: string;
    /** 申请备注 */
    remark: string;
    /** 订单取消申请状态 1:申请中,11:退货申请审核通过,12:退货已发货,13:换货待商家发货,14:换货商家已寄货,15:换货待买家签收,2:申请通过,3:换货超时退款成功,-1:申请不通过,-2:撤销申请 */
    status: number;
    /** 拒绝原因 */
    refuseReason: string;
    /** 图片链接,买家证明 */
    evidenceList: string[];
    /** 创建时间 */
    createTime: number;
    /** 剩余订单取消申请次数 */
    lastCancelApplyCount: number;
    /** 是否可申请取消订单 0:否, 1:是, 2:订单完成超出7天 */
    canCancelApply?: number;
    /** 是否可申请客服介入 1:是, 0:否 */
    canDispute?: number;
    disputeInfo?: DisputeInfo;
    rejectAddressInfo?: RejectAddressInfo;
    rejectTrackingInfo?: RejectTrackingInfo;
    /** 换货收货地址编号 */
    returnAddressId?: string;
    returnAddressInfo?: RejectAddressInfo;
    returnTrackingInfo?: ReturnTrackingInfo;
    /** 图片链接， 商家截图凭证 */
    hireEvidenceList?: string[];
    /** 处理过期时间 */
    dealExpireTime?: number;
    /** 退货申请处理方式 0:未处理, 1:用户处理, 3:管理员处理 */
    dealRejectPassType?: number;
    /** 退货申请处理时间 */
    dealRejectPassTime?: number;
    /** 退货发货处理方式 0:未处理, 1:用户处理 */
    dealRejectProcessType?: number;
    /** 退货发货处理时间 */
    dealRejectProcessTime?: number;
    /** 换货同意处理方式 0:未处理, 2:商家处理, 4:系统超时处理 */
    dealReturnPassType?: number;
    /** 换货同意处理时间 */
    dealReturnPassTime?: number;
    /** 换货商家寄货处理方式 0:未处理, 2:商家处理, 4:系统超时处理 */
    dealReturnProcessType?: number;
    /** 换货商家寄货签收处理时间 */
    dealReturnProcessTime?: number;
    /** 换货商家寄货签收处理方式 0:未处理, 1:用户处理, 4:系统超时处理 */
    dealReturnSignType?: number;
    /** 换货商家寄货处理时间 */
    dealReturnSignTime?: number;
    /** 通过处理方式 0:未处理, 2:商家处理, 3:管理员处理, 4:系统超时处理 */
    dealSuccessType?: number;
    /** 通过处理时间 */
    dealSuccessTime: string;
    /** 拒绝处理方式  0:未处理, 2:商家处理 */
    dealRefuseType?: number;
    /** 拒绝处理时间 */
    dealRefuseTime?: number;
    /** 取消处理方式 0:未处理, 1:用户处理, 4:系统超时处理 */
    dealCancelType?: number;
    /** 取消处理时间 */
    dealCancelTime?: string;
    /** 协商数量 */
    historyCount?: number;
    /** 是否极速退款流程 */
    fastRefund?: 1 | 0;
    /** 极速退款账号 */
    fastRefundAccount: string;
    /** 极速退款打款姓名 */
    fastRefundAccountName: string;
    /** 极速退款弹窗信息 */
    fastRefundAuditContactInfo: {
        /** 微信二维码 */
        wechatQrcode: string;
        /** 电话 */
        phone: string;
    };
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

/** 维权信息 */
export interface DisputeInfo {
    /** 维权编号 */
    disputeNo?: string;
    /** 状态 1:商家处理中,2:客服处理中,3:投诉成立,-1:用户撤回,-2:投诉驳回 */
    status?: number;
}

/** 退款退货信息 */
export interface RejectAddressInfo {
    /** 退款退货收货人姓名 */
    userName?: string;
    /** 退款退货收货人手机号 */
    phone?: string;
    /** 退款退货省份名称 */
    provinceName?: string;
    /** 退款退货城市名称 */
    cityName?: string;
    /** 退款退货区名称 */
    countyName?: string;
    /** 退款退货收货地址详细地址 */
    detailInfo?: string;
    /** 退款退货备注 */
    remark?: string;
}

/** 物流信息 */
export interface RejectTrackingInfo {
    logisticsName?: string;
    /** 物流公司编号 */
    logisticsNo?: string;
    /** 运单号 */
    trackingNo?: string;
}

/** 换货物流信息 */
export interface ReturnTrackingInfo {
    logisticsName?: string;
    /** 换货物流公司编号 */
    logisticsNo?: string;
    /** 换货运单号 */
    trackingNo?: string;
}
