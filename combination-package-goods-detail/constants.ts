import type { GoodsInfo } from '@zsdx/mp-material/dist/lib/components/zd-sku-pop/types';

import type { IGoodsList } from '../api/combination-package-goods-detail/types';

/**
 * 生成商品简要内容
 * @param goodsDetail
 * @returns
 */

export function getGoodsInfo(goodsDetail: IGoodsList): GoodsInfo {
    return {
        goodsNo: goodsDetail.goodsNo,
        goodsCover: goodsDetail.goodsCover,
        goodsPrice: goodsDetail.goodsPrice,
        goodsShowPrice: goodsDetail.goodsShowPrice || 0,
        goodsShowOriginPrice: goodsDetail.goodsShowOriginPrice || 0,
        goodsShowPriceType: goodsDetail.goodsShowPriceType,
        buyLimitCount: goodsDetail.buyLimitCount,
        buyCount: goodsDetail.buyCount
    };
}

/**  活动状态： -1已售罄 0已结束 1预热 2开始  3未开始 */
export function getToastTips(status: number) {
    switch (status) {
        case -1:
            return '商品已售罄';
        case 0:
            return '活动已结束';
        case 1:
        case 3:
            return '活动未开始';
    }
}
