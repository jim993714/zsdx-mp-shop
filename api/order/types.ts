/**
 * 订单明细
 */
export interface OrderDetailResp {
    orderNo?: string;
    /** 订单类别 */
    orderCategory?: number;
    /** 来源类别 */
    fromType?: number;
    /** 店铺编号 */
    shopNo?: string;
    /** 店铺标题 */
    shopTitle?: string;
    /** 校园店编号 */
    studentShopId?: string;
    /** 校园店名称 */
    studentShopName?: string;
    /** 购买列表 */
    buyStudentList?: ResponseOrder1[];
    /** 商品总价 */
    productMoney?: string;
    /** 运费 */
    freight?: string;
    /** 优惠金额 */
    discountMoney?: string;
    /** 优惠信息 */
    discountInfo?: ResponseOrder6[];
    /** 总金额 */
    money?: string;
    /** 状态 0:待支付, 1:待成团, 2:待发货, 3:待收货, 4:已完成, -1:已取消 */
    status: number;
    payTime?: number;
    /** 状态描述 */
    statusDesc?: string;
    /** 自己的支付账单号 */
    selfPayOrderNo?: string;
    /** 是否要求联合支付 1:是, 0:否。判断 order表的other对象，如果存在need_pay_same_time_order_nos这个键 且这个键的值非空数组  则返回1  否则为0 */
    selfPayRequireMulti?: number;
    /** 自己的支付状态 0:未支付, 1:已支付 */
    selfPayStatus?: number;
    /** 自己的支付时间 pay_time 根据shop_goods_order_item的pay_order_no关联到pay_order去获取支付时间 ( 如果pay_status = 0, 则时间为0; 如果pay_order_no为空,  op_goods_order的create_time;  否则取 pay_order的update_time ) self_pay_time即 student_no = 当前登录用户编号的pay_time
     */
    selfPayTime?: string;
    /** 商品运费 */
    selfFreight?: string;
    /** 我的优惠信息 */
    selfDiscountInfo?: ResponseOrder7[];
    /** 自己的订单总价(支付价格) */
    selfMoney?: string;
    /** 过期时间 获取关联的pay_order的最小的expire_time,  如果都没有  则为0 */
    payExpireTime?: string;
    /** 已支付人数 */
    paidStudentCount?: number;
    /** 未支付人数 */
    unPayStudentCount?: number;
    /** 创建时间 字符串时间戳 */
    createTime?: string;
    /** 备注 */
    remark?: string;
    /** 是否由校内员工代收 1:是, 0:否 */
    trackingBySchoolAgent?: number;
    /** 发货方式 0:物流发货 */
    shipType?: number;
    addressInfo?: ResponseOrder8;
    dormitoryAddressInfo?: ResponseOrder8;
    /** 虚拟商品收货信息 */
    virtualBuyInfo?: ResponseOrder10[];
    virtualTrackingInfo?: ResponseOrder11;
    /** 拼团编号 */
    tuanNo?: string;
    /** 退款申请处理截止时间 */
    cancelApplyDealExpireTime?: string;
    tissueDumplingInfo?: ResponseOrder14;
    schoolDumplingInfo?: SchoolDumplingInfo;
    tuanInfo?: ResponseOrder15;
    groupBuyingInfo?: ResponseOrder17;
    workHireAgentGoodsGroup?: ResponseOrder18;
    /** 是否已提醒发货,  1:已提醒, 0:未提醒 */
    alertHireToDeliver?: number;
    /** 订单所有者 0:否(团员等), 1:是(单独购买/团长), 判断order.student_no 是否等于当前登录用户的student_no   相同则1  否则为0 */
    isOwner?: number;
    /** 是否可评价 0:不可评价, 1:可评价, 2:已评价 */
    canReview?: number;
    /** 修改地址用的消息编号, 为空则无法修改 order.other这个对象的 change_address_msg_id 这个键的值, 如果没有这个键 则返回0 */
    changeAddressMsgId?: {
        empty: boolean;
        innerMap: {
            [k: string]: {};
        };
        /**
         * 修改地址用的消息编号, 为空则无法修改 order.other这个对象的 change_address_msg_id 这个键的值, 如果没有这个键 则返回0
         */
        [k: string]: {};
    };
    /** 奖品编号 为空则不是奖品。当shop_goods_order的from_type = 24, 取from_no */
    awardNo?: string;
    disputeStatus?: number;
    cancelApplyType?: number;
    shipByQrcode?: number;
    canCancelApply?: number;
    /** 签收照片 */
    collectionSignImageList?: string[];
    /** 退款金额 */
    refundMoney?: number;
    /** 退款时间 */
    refundTime?: number;
}

export interface SchoolDumplingInfo {
    schoolDumplingId: string;
    activityNo: string;
}
/**
 * 购买学生列表
 */
export interface ResponseOrder1 {
    /** 用户编号 */
    studentNo?: string;
    /** 是否为自己 1:是, 0:否， order_item 的 student_no和登录编号相同 */
    isSelf?: number;
    /** 订单所有者 0:否(团员等), 1:是(单独购买/团长)， order_item 的 student_no 和 order 的 student_no相同 */
    isOwner?: number;
    /** 学生姓名 */
    trueName?: string;
    /** 头像 */
    headImg?: string;
    /** 子订单列表 */
    orderItemList?: OrderItem[];
    /** 商品总价 改为字符串类型 */
    productMoney?: string;
    /** 运费 */
    freight?: string;
    /** 优惠金额 */
    discountMoney?: string;
    /** 总价(支付价格) */
    money?: string;
    /** 支付结果 0:未支付,1:已支付 */
    payStatus?: number;
    /** 支付时间 字符串时间戳 */
    payTime?: string;
    /** 过期时间 字符串时间戳 */
    payExpireTime?: string;
}
/**
 * 子订单明细
 */
export interface OrderItem {
    /** 订单序号 */
    index?: number;
    goodsInfo?: GoodsInfo;
    goodsProductInfo?: GoodsProductInfo;
    /** 是否一卡通商品 0:否, 1:是, 2:一卡通0元购 */
    isVipGoods?: number;
    /** 会员商品折扣 vip_discount_percent 字段 除10 */
    goodsDiscountVip?: number;
    /** 单价 */
    price?: string;
    /** 原单价 */
    priceOri?: string;
    /** 数量 */
    num?: number;
    /** 优惠金额 */
    discountMoney?: string;
    /** 总佣金 */
    commission?: string;
    /** 运费 */
    freight?: string;
    /** 总金额 */
    money: string;
    /** 是否可申请取消订单 0:否, 1:是, 2:订单完成超出7天。 */
    canCancelApply?: number;
    /** 可申请取消的数量 shop_goods_order_item 表的 num - refund_num */
    canCancelApplyNum?: number;
    /** 售后数量 */
    cancelApplyNum?: number;
    /** 可申请取消的运费  shop_goods_order_item 表的 freight 减去 discount_info字段里type=5的优惠的money后, 得到的金额为支付运费金额   can_cancel_apply_freigh  支付运费金额 - (refund_money * 支付运费金额 / money)
     */
    canCancelApplyFreight?: string;
    /** 可申请取消的金额(包含运费)  shop_goods_order_item 表的 money - refund_money */
    canCancelApplyMoney?: string;
    /** 取消订单申请编号 */
    cancelApplyNo?: string;
    /** 订单取消状态 0:未申请,1:申请中,2:申请通过,-1:申请拒绝 */
    cancelStatus?: number;
}
/**
 * 商品信息
 */
export interface GoodsInfo {
    /** 商品编号 */
    goodsNo?: string;
    /** 定时抢购编号 */
    saleNo?: string;
    /** 抽奖编号 */
    lotteryNo?: string;
    /** 单单补活动编号(待定) */
    orderOrderSubsidyActivityNo?: string;
    /** 新人专享, 非新人专享则为空（待定） */
    welfareNo?: string;
    /** 组合包编号, 非组合包则为空 */
    schoolSeasonCombinationPackageActivityId?: string;
    /** 商品货号 */
    goodsNumber?: string;
    /** 商品封面 */
    thumbPic?: string;
    /** 商品标题 */
    title?: string;
}
/**
 * 商品信息
 */
export interface GoodsProductInfo {
    /** 产品SKU */
    sku?: string;
    /** 产品条形码 */
    barcode?: string;
    /** goods_specs */
    goodsSpecs?: GoodsSpecs[];
}
/**
 * 商品规格信息
 */
export interface GoodsSpecs {
    /** 规格名称 */
    name: string;
    /** 规格值 */
    value: string;
}
/**
 * 优惠信息
 */
export interface ResponseOrder6 {
    /** 优惠类型 1:商品满减, 2:优惠券, 3:一卡通优惠, 4:一卡通0元购, 5:一卡通包邮, 6:团购价格, 8:红包优惠, 11:临期商品优惠, 12:社群商品优惠, 13:砍价活动优惠, 14:新 优惠
     */
    type?: number;
    /** 优惠描述 */
    desc?: string;
    /** 优惠金额 改为字符串 */
    discountMoney?: string;
}
/**
 * 当前打折信息
 */
export interface ResponseOrder7 {
    /** 优惠类型 1:商品满减, 2:优惠券, 3:一卡通优惠, 4:一卡通0元购, 5:一卡通包邮, 6:团购价格, 8:红包优惠, 11:临期商品优惠, 12:社群商品优惠, 13:砍价活动优惠, 14:新 优惠
     */
    type?: number;
    /** 优惠描述 */
    desc?: string;
    /** 优惠金额 改为字符串 */
    discountMoney?: number;
}
/**
 * 地址信息
 */
export interface ResponseOrder8 {
    /** 收货人姓名 */
    userName?: string;
    /** 收货人手机号 */
    phone?: string;
    /** 收货地址详细地址 */
    detailInfo?: string;
    /** 省份名称 */
    provinceName?: string;
    /** 城市名称 */
    cityName?: string;
    /** 区名称 */
    countyName?: string;
    /** 微信号 */
    wechat?: string;
    schoolName?: string;
    campusName?: string;
}
/**
 * 虚拟商品收货信息
 */
export interface ResponseOrder10 {
    /** 虚拟订单收件人信息名 */
    title?: string;
    /** 虚拟订单收件人信息值 */
    value?: string;
}
/**
 * 虚拟商品兑换信息
 */
export interface ResponseOrder11 {
    /** 类型 1:兑换码, 2:虚拟卡密 */
    type?: number;
    /** 兑换码 */
    exchangeCode?: string;
    exchangeUrl?: string;
    /** virtual_keys */
    virtualKeys?: ResponseOrder12[];
}
/**
 * virtual_keys
 */
export interface ResponseOrder12 {
    /** 兑换链接, 为空不跳转 */
    exchangeUrl?: string;
    /** data */
    data?: ResponseOrder13[];
}
/**
 * VirtualKeysData信息
 */
export interface ResponseOrder13 {
    /** 名称 */
    name?: string;
    /** 值 */
    value?: string;
}
/**
 * 纸巾团开团活动信息 当shop_goods_order的from_type != 23, 为null;
 */
export interface ResponseOrder14 {
    /** 开团活动id 为shop_goods_order表的from_no字段 */
    tissueDumplingId?: string;
    /** 差多少人成团 对应tissue_dumpling_activity的student_num - tissue_dumpling_activity_open_dumpling_student_link这个表对应delete_time=0 and ssue_dumpling_id = shop_goods_order.from的count(*)
     */
    missStudentNum?: number;
}
/**
 * 拼团信息
 */
export interface ResponseOrder15 {
    /** 拼团团长头像 */
    studentHeadImg?: string;
    /** 成员信息 */
    memberList?: ResponseOrder16[];
    /** 剩余拼团人数 require_member_num - member_num */
    lastPeoNum?: number;
    /** 拼团结束时间 对应shop_goods_tuan表的expire_time字段 */
    endTime?: string;
    /** 成团时间 */
    completeTime?: string;
}
/**
 * 成员信息
 */
export interface ResponseOrder16 {
    /** 成员头像 对应shop_goods_tuan_member表 */
    studentHeadImg?: string;
}
/**
 * 团购信息 取自shop_group_buying表
 */
export interface ResponseOrder17 {
    /** 团购编号 */
    buyingNo?: string;
    /** 团购状态 0：待成团，1：待支付，2：团购成功，-1：团购失败，-2：团购取消 */
    buyingStatus?: number;
}
/**
 * 拼团信息 work_hire_agent_goods_group_apply ,如果order.from_type != 16 则为null
 */
export interface ResponseOrder18 {
    /** 拼团编号 order.from_no */
    applyNo?: string;
    /** 团长学生编号 agent_student_no = order.other 对象的 work_hire_agent_student_no  如果不存在则为空字符串 */
    agentStudentNo?: string;
    /** 参团人数 */
    studentCount?: number;
    /** 参团列表 */
    studentList?: ResponseOrder19[];
}
/**
 * 参团列表
 */
export interface ResponseOrder19 {
    /** head_img student_user表的head_img信息 */
    headImg?: string;
}

export enum LogisticsType {
    /** 正常物流 */
    Normal = 1,
    /** 退货物流 */
    Exit = 2
}

export enum LogisticsFromType {
    /** 订单 */
    Order = 1,
    /** 奖品 */
    Prize = 2
}

/** 物流详细状态 */
export enum TrackingDetailStatus {
    /** 已下单 */
    Ordered = 1,
    /** 已发货 */
    Shipped = 2,
    /** 已揽件 */
    Collected = 3,
    /** 运输中 */
    Transport = 4,
    /** 已签收 */
    Signed = 5,
    /** 校内员工已取件 */
    WorkerCollected = 101,
    /** 校内员工送件 */
    WorkerDelivery = 102,
    /** 校内员工签收 */
    WorkerSigned = 103
}

/** 物流状态 */
export enum TrackingStatus {
    /** 未发货 */
    NotDelivered = -2,
    /** 暂无信息 */
    None = -1,
    /** 已揽件 */
    Collected = 0,
    /** 途中 */
    Transport = 1,
    /** 派件中 */
    Delivery = 2,
    /** 已签收 */
    Signed = 3,
    /** 派送失败 */
    Failed = 4,
    /** 疑难件 */
    Problem = 5,
    /** 退件签收 */
    Exit = 6
}

export interface LogisticsInfoParams {
    /** 订单编号 */
    orderNo: string;
    /** 物流类型 */
    type: LogisticsType;
}

export interface LogisticsInfoRes {
    /** 商品编号 */
    goodsNo: string;
    /** 商品图片 */
    goodsCover: string;
    /** 物流状态 */
    trackingStatus: TrackingStatus;
    /** 物流单号 */
    trackingNo: string;
    /** 物流公司名称 */
    logisticsName: string;
    /** 物流电话 */
    logisticsPhone: string;
    /** 快递员名称 */
    courierName: string;
    /** 快递员手机 */
    courierPhone: string;
    /** 物流信息 */
    trackingInfoList: {
        /** 物流状态 */
        type: TrackingDetailStatus;
        /** 物流信息 */
        info: string;
        /** 时间 */
        createTime: number;
    }[];
    /** 额外的物流信息 */
    extraTrackingInfo: {
        /** 物流状态 */
        trackingStatus: TrackingStatus;
        /** 物流单号 */
        trackingNo: string;
        /** 物流公司名称 */
        logisticsName: string;
        /** 物流电话 */
        logisticsPhone: string;
        /** 快递员名称 */
        courierName: string;
        /** 快递员手机 */
        courierPhone: string;
        /** 物流信息 */
        trackingInfoList: {
            /** 物流状态 */
            type: TrackingDetailStatus;
            /** 物流信息 */
            info: string;
            /** 时间 */
            createTime: number;
        }[];
    }[];
}

export interface AgentAddress {
    /** 用户姓名 */
    userName: string;
    /** 用户手机号 */
    phone: string;
    /** 详细地址 */
    detailInfo: string;
    /** 省名 */
    provinceName: string;
    /** 市名 */
    cityName: string;
    /** 区名 */
    countyName: string;
}
export interface OtherOrderItem {
    orderNo: string;
    shopTitle: string;
    buyGoodsList: BuyGoodsItem[];
    money: number;
}

export interface BuyGoodsItem {
    title: string;
    num: number;
}

export interface MultiPayInfo {
    otherOrderList: OtherOrderItem[];
    money: number;
    payOrderNo: string;
}
