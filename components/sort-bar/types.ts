/**排序配置*/
export interface ISortConfig {
    sortField: string;
    sortType: string;
    sortRank: boolean;
    sortTitle: string;
}

/**排序样式配置*/
export interface IStyleConfig {
    backgroundColor: string;
    backgroundTextStyle: string;
    textColor: string;
    textActiveColor: string;
    barBackgroundImage: string;
    borderRadius?: string;
}
