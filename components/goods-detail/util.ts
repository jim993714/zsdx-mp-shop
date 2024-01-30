import type { GoodsInfo } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';

import { useUserStore } from '@/stores/user';

import type { GoodsDetail } from '../../api/goods-detail/types';

const userStore = useUserStore();
const { userInfo } = toRefs(userStore);

/**
 * 生成商品简要内容
 * @param goodsDetail
 * @returns
 */
export function getGoodsInfo(goodsDetail: GoodsDetail): GoodsInfo {
    return {
        goodsNo: goodsDetail.goodsNo,
        goodsCover: goodsDetail.goodsCover,
        goodsPrice: goodsDetail.goodsPrice,
        goodsShowPrice: goodsDetail.goodsShowPrice || 0,
        goodsShowOriginPrice: goodsDetail.goodsShowOriginPrice || 0,
        goodsShowPriceType: goodsDetail.goodsShowPriceType,
        buyLimitCount: goodsDetail.buyLimitCount,
        buyCount: goodsDetail.buyCount,
        maxSubsidy: goodsDetail.activityInfo?.maxSubsidy || 0
    };
}
/**
 * 生成组团商品简要内容
 * @param goodsDetail
 * @returns
 */
export function getGroupGoodsInfo(goodsDetail: GoodsDetail): GoodsInfo {
    return {
        goodsNo: goodsDetail.goodsNo,
        goodsCover: goodsDetail.goodsCover,
        goodsPrice: goodsDetail.activityInfo?.activityPrice || 0,
        goodsShowPrice: goodsDetail.goodsShowPrice || 0,
        goodsShowOriginPrice: goodsDetail.goodsShowOriginPrice || 0,
        goodsShowPriceType: 1,
        buyLimitCount: goodsDetail.buyLimitCount,
        buyCount: goodsDetail.buyCount
    };
}
/**
 * 生成折扣商品简要内容
 * @param goodsDetail
 * @returns
 */
export function getDiscountGoodsInfo(goodsDetail: GoodsDetail): GoodsInfo {
    if (goodsDetail.alertStatus === 2) {
        return {
            goodsNo: goodsDetail.goodsNo,
            goodsCover: goodsDetail.goodsCover,
            goodsPrice: goodsDetail.activityInfo?.activityPrice || 0,
            goodsShowPrice: goodsDetail.activityInfo?.activityPrice || 0,
            goodsShowOriginPrice: goodsDetail.goodsShowPrice || 0,
            goodsShowPriceType: goodsDetail.goodsShowPriceType,
            buyLimitCount: goodsDetail.buyLimitCount,
            buyCount: goodsDetail.buyCount
        };
    } else if (goodsDetail?.activityInfo?.activityStatus === 2) {
        return {
            goodsNo: goodsDetail.goodsNo,
            goodsCover: goodsDetail.goodsCover,
            goodsPrice: goodsDetail.goodsPrice || 0,
            goodsShowPrice: goodsDetail.goodsShowPrice || 0,
            goodsShowOriginPrice: goodsDetail.goodsShowPrice || 0,
            goodsShowPriceType: 1,
            buyLimitCount: goodsDetail.buyLimitCount,
            buyCount: goodsDetail.buyCount
        };
    } else {
        return {
            goodsNo: goodsDetail.goodsNo,
            goodsCover: goodsDetail.goodsCover,
            goodsPrice: goodsDetail.goodsPrice || 0,
            goodsShowPrice: goodsDetail.goodsShowPrice || 0,
            goodsShowOriginPrice: goodsDetail.goodsShowOriginPrice || 0,
            goodsShowPriceType: goodsDetail.goodsShowPriceType,
            buyLimitCount: goodsDetail.buyLimitCount,
            buyCount: goodsDetail.buyCount
        };
    }
}
/**
 * 生成商品简要内容
 * @param goodsDetail
 * @returns
 */
export function dealGroupGoodsDetail(goodsDetail: GoodsDetail): GoodsDetail {
    // 如果没有开团信息,且团购只能代理可开,删掉团购相关信息,当做普通数据处理
    if (
        goodsDetail.activityType === 11 &&
        !goodsDetail.activityInfo?.schoolDumplingId &&
        goodsDetail.activityInfo?.leaderType === 1
    ) {
        goodsDetail.activityType = 0;
        if (goodsDetail.activityInfo?.subActivityType !== 4) {
            goodsDetail.activityInfo = undefined;
            goodsDetail.goodsShowPriceType = goodsDetail.productList.reduce((result, item) => {
                if (result === 2 || item.goodsShowPriceType === 2) {
                    return 2;
                }
                return 3;
            }, 3);
        }
    }
    console.log('计算结果', goodsDetail);
    return goodsDetail;
}

/**
 * 获取商品主图
 * @param goodsDetail
 * @returns
 */
export function getGoodsMainCover(goodsDetail?: GoodsDetail): string {
    if (goodsDetail && goodsDetail.goodsImageList && goodsDetail.goodsImageList.length > 0) {
        return goodsDetail.goodsImageList[0];
    }
    return '';
}
/**
 * 获取商品分享标题
 * @param goodsDetail
 * @returns
 */
export function getShareTitle(goodsDetail?: GoodsDetail, isActive?: number): string {
    let str = '';
    if (goodsDetail?.activityInfo && goodsDetail?.activityInfo?.subActivityType === 4) {
        return `${userInfo.value?.trueName}喊你一起拼团啦${
            goodsDetail?.activityInfo?.activityStatus == 2 && goodsDetail?.activityInfo?.maxSubsidy
                ? '，最多返现' + goodsDetail?.activityInfo?.maxSubsidy + '元'
                : ''
        } ｜ ${goodsDetail?.goodsTitle}`;
    } else if (
        (goodsDetail?.goodsShowPriceType && goodsDetail?.goodsShowPriceType === 1) ||
        isActive === 1
    ) {
        str = ` | 活动价￥${goodsDetail?.goodsShowPrice}`;
    } else if (goodsDetail?.goodsShowPriceType && goodsDetail?.goodsShowPriceType === 2) {
        str = ` | 学生价￥${goodsDetail?.goodsShowPrice}`;
    }
    return `【全网低价${str}】${goodsDetail?.goodsTitle}`;
}
