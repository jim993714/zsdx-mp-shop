import type { ISortConfig, IStyleConfig } from '../components/sort-bar/types';

export const sortConfig: Array<ISortConfig> = [
    {
        sortField: '',
        sortTitle: '默认',
        sortRank: false,
        sortType: ''
    },
    {
        sortField: 'saleNum',
        sortTitle: '销量',
        sortRank: true,
        sortType: 'asc'
    },
    {
        sortField: 'goodsPrice',
        sortTitle: '价格',
        sortRank: true,
        sortType: 'asc'
    },
    {
        sortField: 'filter',
        sortTitle: '筛选',
        sortRank: false,
        sortType: 'asc'
    }
];
export const sortConfig2: Array<ISortConfig> = [
    {
        sortField: '',
        sortTitle: '默认',
        sortRank: false,
        sortType: ''
    },
    {
        sortField: 'saleNum',
        sortTitle: '销量',
        sortRank: true,
        sortType: 'asc'
    },
    {
        sortField: 'goodsPrice',
        sortTitle: '价格',
        sortRank: true,
        sortType: 'asc'
    }
];

/**
 * 排序样式配置
 */
export const sortStyleConfig: IStyleConfig = {
    backgroundColor: '#fff',
    backgroundTextStyle: '#199FFF',
    textColor: '#8A9399',
    textActiveColor: '#199FFF',
    barBackgroundImage: ''
};
