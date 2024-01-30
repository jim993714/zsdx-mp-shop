import type { COMPONENT_TYPE } from '../common';

export enum PacketShowType {
    /**
     * 大图模式
     */
    SINGLE = 0,
    /**
     * 一行两个
     */
    TWO = 1,
    /**
     * 一行三个
     */
    THREE = 2,
    /**
     * 一行四个
     */
    FOUR = 3,
    /**
     * 横向滑动
     */
    SLIDE = 4
}

export interface PacketItem {
    /**
     * 优惠券编号
     */
    packet_no: string;
    /**
     * 优惠券封面图
     */
    cover_image: string;
    /**
     * 优惠券标题
     */
    title: string;
    /**
     * 是否有剩余数量, 1:是, 0:否
     */
    has_last_count: 1 | 0;
    /**
     * 限领数量
     */
    get_limit_count: number;
    /**
     * 领取开始时间
     */
    get_start_time: number;
    /**
     * 领取结束时间
     */
    get_end_time: number;
    /**
     * 领取状态, 0:未领取, 1:已领取
     */
    receive_status: 0 | 1;
    /**
     * 领取开始时间
     */
    receive_time?: string;
    /**
     * 领取数量
     */
    receive_count: number;
}

export interface PacketStyle {
    /**
     * 背景色
     */
    backgroundColor: string;
    /**
     * 上下边距
     */
    marginV: number;
    /**
     * 左右边距
     */
    marginH: number;
    /**
     * 优惠券样式
     */
    coupon_array: PacketShowType;
    /**
     * 状态戳颜色
     */
    iconColor: string;
    /**
     * 状态戳大小
     */
    iconFontSize: number;
    /**
     * 状态戳距离顶部距离
     */
    iconTop: number;
    /**
     * 状态戳距离左边距离
     */
    iconLeft: number;
    /**
     * 优惠券宽度 仅滑动模式有效
     */
    coupon_width: number;
    /**
     * 领取时间 1:立即领取 2:领取时间
     */
    receive_type: 1 | 2;
    receive_time?: string;
    /**
     * 优惠券高度
     */
    height: number;
}

export interface PacketData {
    packet_list: PacketItem[];
}

export interface Packet {
    type: COMPONENT_TYPE.PACKET;
    style: PacketStyle;
    data: PacketData;
}
