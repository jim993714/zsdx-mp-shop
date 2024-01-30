import type { COMPONENT_TYPE } from '../common';

export interface SeckillItemFlashItem {
    /**
     * 秒杀编号
     */
    sale_no: string;
    /**
     * 商品编号
     */
    goods_no: string;
    /**
     * 是否是学生价
     */
    platform_student_price_status: 1 | 0;
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
    goods_price: string;
    /**
     * 购买价格
     */
    goods_price_pay: string;
}

export interface SeckillItem {
    /**
     * 场次编号
     */
    time_no: string;
    /**
     * 开始时间
     */
    start_time: number;
    /**
     * 结束时间
     */
    end_time: number;
    /**
     * 秒杀商品列表
     */
    flash_list: SeckillItemFlashItem[];
}

export interface SeckillStyle {
    backgroundImage: string;
}

export interface SeckillData {
    list: SeckillItem[];
}

export interface Seckill {
    type: COMPONENT_TYPE.SECKILL;
    style: SeckillStyle;
    data: SeckillData;
}
