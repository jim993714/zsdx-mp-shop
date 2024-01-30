import type { Action, COMPONENT_TYPE } from '../common';

export interface MultiImageStyle {
    /**
     * 上下边距
     */
    marginV: number;
    /**
     * 左右边距
     */
    marginH: number;
    /**
     * 背景色
     */
    backgroundColor: string;
    /**
     * 圆角
     */
    borderRadius: string;
    /**
     * 列数
     */
    columns: number;
    /**
     * 高度
     */
    height: number;
}

export interface MultiImageItem {
    /**
     * url
     */
    image_url: string;
    /**
     * 行为
     */
    action: Action;
}

export interface MultiImageData {
    /**
     * 图片地址
     */
    images: MultiImageItem[];
}

export interface MultiImage {
    type: COMPONENT_TYPE.MULTI_IMAGE;
    style: MultiImageStyle;
    data: MultiImageData;
}
