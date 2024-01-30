/** 地址类型 */
export enum AddressType {
    /** 普通地址 */
    Normal,
    /** 代收地址 */
    School
}

/** 获取地址列表参数 */
export interface AddressListParams {
    /** 地址类型 */
    type: AddressType;
}

export interface AddressItem {
    /** 地址编码*/
    id: number;
    /** 地址类型 */
    type: AddressType;
    /** 用户姓名 */
    userName: string;
    /** 用户手机号 */
    phone: string;
    /** 微信 */
    wechat: string;
    /** 详细地址 */
    detailInfo: string;
    /** 省名 */
    provinceName: string;
    /** 市名 */
    cityName: string;
    /** 区名 */
    countyName: string;
    /** 是否默认 */
    isDefault: 0 | 1;
}

/** 地址列表返回 */
export type AddressListRes = AddressItem[];

/** 地址更新创建参数 */
export type AddressParams = AddressItem;

/** 删除地址参数 */
export interface DeleteAddressParams {
    id: number;
}

export interface Department {
    /** 区域编号 */
    id: string;
    /** 省市区名称 */
    name: string;
    /** 下级 */
    children: Department[];
}

/** 省市区数据 */
export type DepartmentList = Department[];

export type AddressDetailParams = DeleteAddressParams;
