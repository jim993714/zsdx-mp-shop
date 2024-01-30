import type { Action, COMPONENT_TYPE } from '../common';

export interface SingleImageStyle {
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
     * 高度
     */
    height: number;
}

export interface SingleImageData {
    /**
     * 图片地址
     */
    image_url: string;
    /**
     * 行为
     */
    action: Action;
}

export interface SingleImage {
    type: COMPONENT_TYPE.SINGLE_IMAGE;
    style: SingleImageStyle;
    data: SingleImageData;
}

export interface SearchStyle {
    position: 'normal' | 'fixed';
    textAlign: 'left' | 'center';
    height: number;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
}

export interface SearchData {
    search_source_key: string;
}
export interface Search {
    type: COMPONENT_TYPE.SEARCH;
    style: SearchStyle;
    data: SearchData;
}
