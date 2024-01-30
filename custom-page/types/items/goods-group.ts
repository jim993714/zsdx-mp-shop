import type { COMPONENT_TYPE, GoodsItem } from '..';

export interface GoodsGroupCategory {
    /**
     * 参数 用于请求商品列表
     */
    param_str: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 商品列表
     */
    dataList?: GoodsItem[];
    /**
     * 是否初始化
     */
    init?: boolean;
    /**
     * 分页
     */
    page?: {
        next_page: number;
    };
}

export interface GoodsGroupGoodsButton {
    /**
     * 是否显示
     */
    show: 1 | 0;
    /**
     * 文案
     */
    text: string;
    /**
     * 背景色
     */
    backgroundColor: string;
}

export interface GoodsGroupGoodsTag {
    /**
     * 是否显示
     */
    show: 1 | 0;
    /**
     * 类型 0:热门 1:新品 2:自定义图片
     */
    type: 0 | 1 | 2;
    /**
     * 角标宽度
     */
    width: number;
    /**
     * 角标高度
     */
    height: number;
    /**
     * 角标左边距
     */
    left: number;
    /**
     * 角标上边距
     */
    top: 0;
    /**
     * 角标图片
     */
    url: string;
}

export interface GoodsGroupStyle {
    /**
     * 固定分类头部
     */
    fixHeader: 1 | 0;
    /**
     * 分类按钮颜色
     */
    headerActiveBackgroundColor: string;
    /**
     * 分类按钮背景色
     */
    headerBackgroundColor: string;
    /**
     * 分类按钮选中颜色
     */
    headerActiveColor: string;
    /**
     * 分类文字颜色
     */
    headerColor: string;
    /**
     * 分组标题背景图
     */
    headerBackgroundImage: string;
    /**
     * 页面边距
     */
    pageMargin: number;
    /**
     * 商品边距
     */
    goodsMargin: number;
    /**
     * 商品列数
     */
    columns: number;
    /**
     * 商品按钮配置
     */
    goodsButton: GoodsGroupGoodsButton;
    /**
     * 商品角标配置
     */
    goodsTag: GoodsGroupGoodsTag;
    /**
     * 商品圆角
     */
    goodsBorderRadius: string;
    /**
     * 模块块背景色
     */
    backgroundColor: string;
    /**
     * 模块下边距
     */
    mBottom: number;
}

export interface GoodsGroupData {
    /**
     * 分类列表
     */
    category_list: GoodsGroupCategory[];
}

export interface GoodsGroup {
    type: COMPONENT_TYPE.GOODS_GROUP;
    style: GoodsGroupStyle;
    data: GoodsGroupData;
}
