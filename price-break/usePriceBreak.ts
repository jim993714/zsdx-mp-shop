import { router } from '@zsdx/mp-utils';

import { getMyGoodsReportMoney } from '@/api/price-break';

export async function toPriceBreak(goodsNo: string, studentShopId: string) {
    const resp = await getMyGoodsReportMoney({
        goodsNo
    });
    if (!resp || resp < 2000) {
        if (resp === -1) {
            uni.showToast({
                title: '该商品已被爆料，正在审核中…',
                icon: 'none'
            });
        } else {
            router.push('priceBreak', {
                goodsNo,
                studentShopId
            });
        }
    } else {
        uni.showToast({
            title: '您本月的爆料已达到上限了，下个月再来吧',
            icon: 'none'
        });
    }
}
