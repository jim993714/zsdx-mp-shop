import { useRequest } from '@zsdx/mp-utils';

import type {
    CollectParam,
    Coupon,
    GoodsCouponParams,
    GoodsDetail,
    GoodsDetailParams,
    ReceiveResult
} from '../goods-detail/types';

const request = useRequest();
/**
 * 获取商品详情
 * @param params
 * @returns 商品详情信息
 */
export function getGoodsDetail(params: GoodsDetailParams): Promise<GoodsDetail> {
    const result = request.post<GoodsDetail>('/student-school-shop/goods/getGoodsDetail', params);

    return result;
}

/**
 * 获取暑假专区商品详情
 * @param params
 * @returns 商品详情信息
 */
export function getSummerGoodsDetail(params: GoodsDetailParams): Promise<GoodsDetail> {
    const result = request.post<GoodsDetail>(
        '/student-school-shop/summerVacationDiscountActivity/goodsDetail',
        params
    );

    return result;
}
/**
 * 获取折扣专区商品详情
 * @param params
 * @returns 商品详情信息
 */
export function getSummerDiscountGoodsDetail(params: GoodsDetailParams): Promise<GoodsDetail> {
    const result = request.post<GoodsDetail>(
        '/student-school-shop/summerVacationFreeDiscountActivity/goodsDetail',
        params
    );

    return result;
}
/**
 * 获取秒杀商品详情
 * @param params
 * @returns 商品详情信息
 */
export function getFlashGoodsDetail(params: GoodsDetailParams): Promise<GoodsDetail> {
    const result = request.post<GoodsDetail>(
        '/student-school-shop/flashSale/getSaleGoodsDetail',
        params
    );

    return result;
}
/**
 * 获取商品详情可领取优惠券红包列表
 * @param params
 * @returns 优惠券红包列表
 */
export function getCouponList(params: GoodsCouponParams): Promise<{ list: Coupon[] }> {
    return request.post<{ list: Coupon[] }>('/student-school-shop/goods/getCouponList', params);
}
/**
 * 收藏/取消收藏
 * @param params
 */
export function collect(params: CollectParam) {
    return request.post('/student-school-shop/collect/collect', params);
}
/**
 * 领取优惠券
 * @param params
 */
export function receiveCoupon(params: {
    couponNo?: string;
    shareId?: number;
    studentShopId: string;
    isNeedReturnResultCheck: number;
}) {
    return request.post<ReceiveResult>('/student-school-shop/Coupon/receive', params);
}
/**
 * 领取优惠券结果
 * @param params
 */
export function receiveCouponCheck(params: { receiveTicket: string }) {
    return request.post<ReceiveResult>('/student-school-shop/Coupon/checkReceive', params);
}
/**
 * 领取红包
 * @param params
 */
export function receiveRedPacket(params: { packetNo?: string; receiveTicket?: string }) {
    return request.post<ReceiveResult>('/student-school-shop/RedPacket/receive', params);
}
/**
 * 领取红包结果
 * @param params
 */
export function receiveRedPacketCheck(params: { packetNo?: string; receiveTicket?: string }) {
    return request.post<ReceiveResult>('/student-school-shop/RedPacket/checkReceive', params);
}
/**
 * 秒杀预约
 * @param params
 */
export function setSaleAlert(params: { saleNo: string; status: number }) {
    return request.post('/student-school-shop/flashSale/setSaleAlert', params);
}

/**
 * 获取企业工资资质照片列表
 */
export function getHireQualification(params: { key: string; code: string; hireNo: string }) {
    return request.post<{ list: string[] }>(
        '/student-school-shop/goods/getHireQualification',
        params
    );
}
