import type { TrackingDetailStatus, TrackingStatus } from '../order/types';

export interface UpdateGoodsParams {
    studentShopId: string;
    oldProductNo?: string;
    productNo?: string;
    buyNum: number;
}

/**
 * 返回结果
 */
export interface StudentInfo {
    /** 学信网code(v265)*/
    chsiAuthCode?: string;
    /** 入学年份*/
    enterSchoolYear?: number;
    /** 学校编号*/
    schoolId?: number;
    /** 申请编辑信息状态,-2：未变更，-1：失败，0：待审核，1：通过(v265)*/
    changeVerifyStatus?: string;
    /** 学院编号*/
    collegeNo?: string;
    /** 已完成第三版学生认证, 1:是, 0:否*/
    v3Verified?: number;
    /** 校区名称(v265)*/
    campusName?: string;
    /** 省份编号(v265)*/
    campusPid?: string;
    /** 真实姓名*/
    realName?: string;
    /** 身份证号*/
    idNumber?: string;
    /** 2:通过,1:审核中,0:未提交,-1:失败(v265)*/
    consumerVerifyStatus?: number;
    /** 是否可提交审核, 1:是, 0:否*/
    canSubmitVerify?: number;
    /** 是否可以修改真实姓名, 1:是, 0:否*/
    realNameCanChange?: number;
    /** 学院名称*/
    collegeName?: string;
    /** 学生认证方式,1:原身份认证,2:学信网,3消费者身份证,4消费者绿色(v265)*/
    userAuthMethodType?: number;
    /** 学校名称*/
    schoolName?: string;
    /** 审核状态, 0:待审核, 1:审核通过, -1:审核不通过, -2:未提交审核*/
    verify?: number;
    /** 学生证明图片*/
    images?: string[];
    /** 学信网code(v265)*/
    campusProvinceName?: string;
    /** 校区编号(v265)*/
    campusId?: string;
    /** 年制*/
    maxGrade?: number;
    /** 区域编号(v265)*/
    campusAid?: string;
    /** 区域名称(v265)*/
    campusAreaName?: string;
    /** 市编号(v265)*/
    campusCid?: string;
    /** 市名称(v265)*/
    campusCityName?: string;
    /** 审核失败原因*/
    verifyFailReason?: string;
    studentChangeDTO?: StudentChangeInfo;
}

/**
 * 变更信息
 */
export interface StudentChangeInfo {
    /** 入学年份*/
    enterSchoolYear?: number;
    /** 学校编号*/
    schoolNameschoolId?: number;
    /** 学院编号*/
    collegeNo?: string;
    /** 校区名称(v265)*/
    campusName?: string;
    /** 省份编号(v265)*/
    campusPid?: string;
    /** 学院名称*/
    collegeName?: string;
    /** 学校名称*/
    schoolName?: string;
    /** 审核状态, 0:待审核, 1:审核通过, -1:审核不通过, -2:未提交审核*/
    verify?: number;
    /** 学生证明图片*/
    images?: string[];
    /** 学信网code(v265)*/
    campusProvinceName?: string;
    /** 校区编号(v265)*/
    campusNamecampusId?: string;
    /** 年制*/
    maxGrade?: number;
    /** 区域编号(v265)*/
    campusAid?: string;
    /** 区域名称(v265)*/
    campusAreaName?: string;
    /** 市编号(v265)*/
    campusCid?: string;
    /** 市名称(v265)*/
    campusCityName?: string;
    /** 审核失败原因*/
    verifyFailReason?: string;
}

/**
 * 获取校园团活动明细类型
 */

export interface ISchoolDumplingDetail {
    activityNo: string /***  活动编号 */;
    schoolDumplingId: string /*** 开团id。可参团有值，可开团中有待成团标识的有值，没有标识的无值 */;
    goodsTitle: string /*** 商品名称  */;
    studentNum: number /*** 成团人数 */;
    productNo: string /*** 产品编号 */;
    goodsNo: string /*** 商品编号 */;
    remainingMemberNum: number /*** 剩余成团人数  */;
    groupBuyPrice: number /*** 团购价 */;
    allowsDeliveryToDormitory: number /*** 是否允许送货上寝。0：不允许;1:允许  */;
    showRefundBeforeReturn: number /*** 是否展示先退款后退货标识。0:不展示,1:展示 */;
    showAwaitingGroupFormation: number /*** 是否展示待成团标识。0:不展示（点击购买进入商详开始首单开团）,1:展示（点击购买进入邀请参团）。 */;
    memberHeadImgs: Array<String> /*** 成员头像	 */;
    timeRemaining: number /*** 	距离结束时间的时间差，单位秒 */;
    hasJoined: number /*** 是否已参团购买。0:未参团,1:已参团 */;
    amountOff: string /*** 	减免金额。小程序分享使用  */;
    onlyCampusStaff: number /*** 减免金额。小程序分享使用 */;
    supportLeaderCollection: number /*** 是否仅校内员工开团。0:否,1:是。确认订单页面使用 */;
    status: number /*** 状态：1已成团,0未成团,-1已失效。根据开团状态来判断按钮的显示 */;
    goodsCover: string /*** 商品封面*/;
    needStudentVerify: number;
}

/**
 * 获取校园团活动明细参数的类型
 */
export interface ISchoolDumplingDetailParams {
    activityNo: number | string;
    schoolDumplingId?: number | string;
}

export interface PrizeLogisticsInfo {
    /**
     * 奖品图片
     */
    image: string;
    /**
     * 物流状态
     */
    trackingStatus: TrackingStatus;
    /**
     * 物流单号
     */
    trackingNo: string;
    /**
     * 快递公司名称
     */
    logisticsName: string;
    /**
     * 快递公司手机号
     */
    logisticsPhone: string;
    /**
     * 快递员姓名
     */
    courierName: string;
    /**
     * 快递员手机号
     */
    courierPhone: string;
    /**
     * 物流信息列表
     */
    trackingInfoList: {
        /** 物流状态 */
        type: TrackingDetailStatus;
        /** 物流信息 */
        info: string;
        /** 时间 */
        createTime: number;
    }[];
}
