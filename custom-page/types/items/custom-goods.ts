import type { COMPONENT_TYPE, GoodsGroupStyle, GoodsItem } from '..';

export interface CustomGoodsData {
    goods_list: GoodsItem[];
}

export interface CustomGoods {
    type: COMPONENT_TYPE.CUSTOM_GOODS | COMPONENT_TYPE.HOT_GOODS;
    style: GoodsGroupStyle;
    data: CustomGoodsData;
}
