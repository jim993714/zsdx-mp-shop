export interface Action {
    /**
     * 行为类型 1 app_action 0 无交互
     */
    type: 1 | 0;
    /**
     * app_action
     */
    app_action?: any;
}

export enum COMPONENT_TYPE {
    /**
     * 单图组件
     */
    SINGLE_IMAGE = 1,
    /**
     * 多图拼凑
     */
    MULTI_IMAGE = 2,
    /**
     * 商品分组
     */
    GOODS_GROUP = 101,
    /**
     * 自定义商品
     */
    CUSTOM_GOODS = 103,
    /**
     * 热推商品组
     */
    HOT_GOODS = 115,
    /**
     * 优惠券
     */
    COUPON = 106,
    /**
     * 优惠券
     */
    PACKET = 107,
    /**
     * 限时秒杀
     */
    SECKILL = 109,
    /**
     * 组合包
     */
    COMPOSE_PACKAGE = 112,
    /**
     * 搜索组件
     */
    SEARCH = 116
}

export enum COMPONENT_TYPE_FOR_DATA {
    /**
     * 商品组数据
     */
    GOODS_GROUP = 900101,
    /**
     * 商品组数据
     */
    GOODS_SEARCH = 900116
}
