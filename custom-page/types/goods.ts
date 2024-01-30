export interface GoodsItem {
    /**
     * 商品编号
     */
    goods_no: string;
    /**
     * 是否是学生价商品 1 是 0 否
     */
    platform_student_price_status?: 1 | 0;

    /**
     * 商品标题
     */
    goods_title: string;
    /**
     * 商品封面
     */
    goods_cover: string;
    /**
     * 商品价格
     */
    goods_price: number;
    /**
     * 商品原价
     */
    goods_price_origin: number;
    /**
     * 代理佣金
     */
    stuagent_rebate_money: number;
    /**
     * 商品价格类型
     */
    goods_show_price_type: number;
    /**
     * 显示的商品价格
     */
    goods_show_price: number;
    /**
     * 显示的商品原价
     */
    goods_show_origin_price: number;
}
