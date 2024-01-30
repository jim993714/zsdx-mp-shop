import type { COMPONENT_TYPE } from '../common';

export interface ComposePackageItem {
    /**
     * 组合包活动id
     */
    school_season_combination_package_activity_id: string;
    /**
     * 组合包名称
     */
    package_title: string;
    /**
     * 组合包封面
     */
    package_cover: string;
    /**
     * 一口价
     */
    fixed_money: number;
    /**
     * 原价
     */
    origin_price: number;
    /**
     * 排序
     */
    sort: number;
}

export interface ComposePackageStyle {
    backgroundImage: string;
    scrollBarColor: string;
}

export interface ComposePackageData {
    list: ComposePackageItem[];
}

export interface ComposePackage {
    type: COMPONENT_TYPE.COMPOSE_PACKAGE;
    style: ComposePackageStyle;
    data: ComposePackageData;
}
