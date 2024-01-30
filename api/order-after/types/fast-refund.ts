/** 极速退款表单预填写 */
export interface FastRefundPreResp {
    /** 可退款金额	 */
    amount: number;
    /** 是否展示先退款后退货标识。0:不展示,1:展示。	 */
    showRefundBeforeReturn: 0 | 1;
    /** 支付宝账号 */
    fastRefundAccount: string;
    /** 真实姓名 */
    fastRefundAccountName: string;
}

export interface FastRefundAccountReq {
    /** 退款申请编号 */
    applyNo: string;
    /** 支付宝账户 */
    fastRefundAccount: string;
    /** 真实姓名 */
    fastRefundAccountName: string;
}
