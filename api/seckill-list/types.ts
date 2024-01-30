/** 场次信息 */
export interface TimeListResp {
    /** banner */
    imageUrl: string;
    /** 跳转链接 */
    appAction: string;
    list: TimeItem[];
}
export interface TimeItem {
    /** 场次编号 */
    timeNo: string;
    /** 开始时间  */
    startTime: number;
    /** 结束时间 */
    endTime: number;
}

export interface GetTimeGoodsListReq {
    /** 场次编号 */
    timeNo?: string;
    scrollId?: string;
    listType: 1 | 2;
}

/** 分页列表返回结果*/
export interface GoodsListItemResp {
    /** 列表 */
    list?: GetTimeGoodsListItem[];
    scrollId?: string;
}

/** 列表*/
export interface GetTimeGoodsListItem {
    /** 抢购编号 */
    saleNo?: string;
    /** 商品类型 */
    goodsType?: number;
    /** 商品名称 */
    goodsTitle?: string;
    /** 商品封面 */
    goodsCover?: string;
    /** 商品价格 */
    goodsPrice?: number;
    /** 购买价格 */
    goodsPricePay?: number;
    /** 商品原价 */
    goodsPriceOrigin?: number;
    /** 抵扣价格 */
    discountPrice?: number;
    /** 商品总数量 */
    goodsNum: number;
    /** 已购买数量 */
    saleNum: number;
    /** 状态, 1:未开始,2:进行中,3:已结束 */
    status: number;
    /** 提醒设置状态, 0:未设置,1:已设置 */
    alertStatus?: number;

    isCrossBorder?: boolean;
}

export interface SaleGoodsDetailReq {
    /** 大促编号*/
    saleNo?: string;
    /** 邀请学生编号*/
    inviteStudentNo?: string;
    /** 邀请学生编号*/
    studentShopId?: string;
    /** zsdxPwd*/
    zsdxPwd?: string;
}

/** 返回结果 */
export interface GetSaleGoodsDetailResp {
    /** 商品编号*/
    goodsNo?: string;
    /** 商品类型*/
    goodsType?: number;
    /** 商品名称*/
    goodsTitle?: string;
    /** 商品封面*/
    goodsCover?: string;
    /** 商品价格*/
    goodsPrice?: number;
    /** 购买价格*/
    goodsPricePay?: number;
    /** 图片链接*/
    goodsImageList?: string[];
    /** 标签名称*/
    goodsTagList?: ShopGoodsServiceContent[];
    /** 商品运费*/
    goodsFreight?: number;
    /** 商品原价*/
    goodsPriceOrigin?: number;
    /** 额外头信息*/
    goodsHeaderExtra?: GoodsHeaderExtra[];
    /** 商品内容*/
    goodsContent?: string;
    /** 规格信息*/
    specList?: Spec[];
    shopInfo?: GoodsDetailShopInfo;
    /** 限购数量, -1:不限购*/
    buyLimitCount?: number;
    /** 剩余购买数量, -1:不限购*/
    lastBuyCount?: number;
    /** 优惠券金额*/
    couponMoney?: string;
    coverVideo?: GoodsCoverVideoInfo;
    /** 规格信息*/
    productList?: Product[];
    /** 已购买数量*/
    goodsSale?: number;
    /** 商品状态, 1:正常, -1:下架, -2:库存不足*/
    goodsStatus?: number;
    studentShopInfo?: StudentShopForGoodsDetail;
    /** 校园店信息*/
    delayDay?: number;
    /** 商品数量*/
    goodsNum?: number;
    /** 状态, 1:未开始,2:进行中,3:已结束*/
    status?: number;
    freightInfo?: DetailFreightInfo;
    /** 公司名称*/
    companyName?: string;
    /** 商品所属企业编号*/
    hireNo?: string;
    /** 提醒设置状态, 0:未设置,1:已设置*/
    alertStatus?: number;
    /** 限购开始时间*/
    saleStartTime?: number;
    /** 限购结束时间*/
    saleEndTime?: number;
    /** 埋点活动类型*/
    maidianActivityType?: number;
    /** 埋点活动编号*/
    maidianActivityNo?: string;
}
/** 标签名称 */
export interface ShopGoodsServiceContent {
    /** 服务内容*/
    title?: string;
    /** 服务内容描述*/
    desc?: string;
}
/** 额外头信息 */
export interface GoodsHeaderExtra {
    /** 额外头信息*/
    title?: string;
    /** 额外头信息内容*/
    content?: string;
}
/** 奖品规格信息 */
export interface Spec {
    /** 规格名称*/
    name?: string;
    /** 规格明细信息*/
    list?: SpecValue[];
}
/** 规格明细信息 */
export interface SpecValue {
    /** 规格编号*/
    specNo?: string;
    /** 规格值*/
    specValue?: string;
}
/** 店铺信息 */
export interface GoodsDetailShopInfo {
    /** 店铺编号*/
    shopNo?: string;
    /** 店铺类型，1：自营，2：淘宝*/
    shopType?: number;
    /** 店铺名称*/
    shopTitle?: string;
    /** 店铺LOGO*/
    shopLogo?: string;
    /** 等级保证金*/
    levelMoney?: number;
    /** 等级LOGO*/
    levelLogo?: string;
    /** 商品数*/
    goodsNum?: number;
    /** 商品销量*/
    goodsSale?: number;
    /** 店铺状态，1：上架，0：下架*/
    shopStatus?: number;
    /** 闭店时间*/
    closeTime?: number;
    /** 公告内容*/
    content?: string;
}
/** 商品封面视频 */
export interface GoodsCoverVideoInfo {
    /** 视频地址*/
    videoUrl?: string;
    /** 视频封面*/
    videoCover?: string;
}
/** 产品信息 */
export interface Product {
    /** 产品名称*/
    productNo?: string;
    /** 产品价格*/
    productPrice?: number;
    /** 产品图片*/
    productImage?: string;
    /** 产品库存*/
    productStock?: number;
    /** 产品标识*/
    productIdentify?: string;
    /** 规格明细信息*/
    specList?: SpecValue[];
}
/** 校园店信息 */
export interface StudentShopForGoodsDetail {
    /** 店铺名称*/
    shopName?: string;
    /** 店铺logo*/
    shopLogo?: string;
    /** 店铺子标题*/
    shopSubtitle?: string;
    /** 学校名称*/
    schoolName?: string;
    /** 学生昵称*/
    trueName?: string;
}
/** 运费信息 */
export interface DetailFreightInfo {
    /** 类型 -2:未找到匹配，-1非配送地区,0包邮0运费,1需要支付运费(判断为1显示即可)*/
    freightType?: number;
    /** 运费金额，freight_type为1时显示运费*/
    freightMoney?: number;
}

/** 大促预约列表 */
export interface GetBuyAlertListItem {
    /** 学生姓名*/
    studentMaskedName?: string;
    /** 头像*/
    studentHeadImg?: number;
    /** 商品名称*/
    goodsTitle?: string;
    /** 下单时间*/
    buyTime?: string;
}
