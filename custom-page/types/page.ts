import type { PageBaseConfig } from './basic';
import type {
    ComposePackage,
    Coupon,
    CustomGoods,
    GoodsGroup,
    MultiImage,
    Packet,
    Search,
    Seckill,
    SingleImage
} from './items';

export type Components =
    | MultiImage
    | SingleImage
    | GoodsGroup
    | CustomGoods
    | Coupon
    | Packet
    | Seckill
    | ComposePackage
    | Search;

export interface PageConfig {
    /**
     * 页面基础配置
     */
    base_config: PageBaseConfig;
    /**
     * 页面模块配置
     */
    item_list: Components[];
}
