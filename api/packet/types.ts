export interface ReceivePacketParams {
    packetNo: string;
}

export enum ReceiveResult {
    /**正常 */
    SUCCESS = 1,
    /**等待队列 */
    WAITING = 2,
    /**失败 */
    FAIL = -1
}

export interface ReceivePacketRes {
    result: ReceiveResult;
    /**错误信息 0一般错误 1：老粉才能领取 */
    errorResult: 0 | 1;
    /**学生优惠券编号 result 1返回 */
    studentCouponNo: string;
    /**领取凭证 result 2返回 */
    receiveTicket: string;
    /**失败原因 result -1返回 */
    failReason: string;
}

export enum CheckReceiveResult {
    /**成功 */
    SUCCESS = 1,
    /**没出结果 */
    WAITING = 0,
    /**失败 */
    FAIL = -1
}

export interface CheckReceiveSuccessRes {
    result: CheckReceiveResult;
    /**错误信息 0一般错误 1：老粉才能领取 */
    errorResult: 0 | 1;
    /**学生优惠券编号 result 1返回 */
    studentCouponNo: string;
    /**失败原因 result -1返回 */
    failReason: string;
}
