export interface Dispute {
    /**
     * 售后编号
     */
    applyNo?: string;
    /**
     * 投诉原因
     */
    reason?: string;
    /**
     * 投诉原因详情(投诉类型)
     */
    reasonDetail?: string;
    /**
     * 投诉说明
     */
    desc?: string;
    /**
     * 用户提交证明图片
     */
    evidence?: string;
}

/**
 * 返回结果
 */
export interface Reason {
    reason?: string;
    reasonDetailList?: ReasonDetail[];
}
export interface ReasonDetail {
    reasonDetail?: string;
}

/**
 * 返回结果
 */
export interface DisputeDetail {
    /**
     * 订单编号
     */
    orderNo?: string;
    orderInfo?: OrderInfo;
    /**
     * 纠纷原因
     */
    reason?: string;
    /**
     * 纠纷原因详情(投诉类型)
     */
    reasonDetail?: string;
    /**
     * 用户提交额外说明
     */
    desc?: string;
    /**
     * 用户提交证明图片
     */
    evidence?: string[];
    /**
     * 商家提交额外说明
     */
    hireDesc?: string;
    /**
     * 商家提交证明图片
     */
    hireEvidence?: string[];
    /**
     * 商家处理截止时间(毫秒)
     */
    hireDealExpireTime?: number;
    /**
     * 客服处理方式,1:仅退款,2:退货退款
     */
    adminDealType?: number;
    /**
     * 客服处理原因
     */
    adminDealReason?: string;
    /**
     * 状态, 1:商家处理中,2:客服处理中,3:投诉成立,-1:用户撤回,-2:投诉驳回
     */
    status?: number;
}

/**
 * 订单信息
 */
export interface OrderInfo {
    /**
     * 商品编号
     */
    goodsNo?: string;
    /**
     * 商品名称
     */
    goodsTitle?: string;
    /**
     * 商品封面
     */
    goodsCover?: string;
    /**
     * 商品规格
     */
    goodsSpec?: GoodsSpec[];
    /**
     * 商品数量
     */
    num?: number;
    /**
     * 订单总价(支付价格)
     */
    money?: string;
}
/**
 * 商品规格
 */
export interface GoodsSpec {
    /**
     * 规格名
     */
    specName?: string;
    /**
     * 规格值
     */
    specValue?: string;
}
