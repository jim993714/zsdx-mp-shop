import { useRequest } from '@zsdx/mp-utils';

import type {
    AddressDetailParams,
    AddressItem,
    AddressListParams,
    AddressListRes,
    AddressParams,
    DeleteAddressParams,
    DepartmentList
} from './types';

const request = useRequest();

/** 获取地址列表  */
export function getAddressList(params: AddressListParams) {
    return request.post<AddressListRes>('/student-school-shop/userAddress/getAddressList', params);
}

/** 更新删除地址列表 */
export function addOrUpdateAddress(params: AddressParams) {
    return request.post<number>('/student-school-shop/userAddress/addOrUpdateAddress', params);
}

/** 删除地址 */
export function deleteAddress(params: DeleteAddressParams) {
    return request.post('/student-school-shop/userAddress/removeAddress', params);
}

/** 获取全国地址 */
export function getDepartmentList() {
    return request.post<DepartmentList>('/student-school-shop/userAddress/getAreaList');
}

/** 获取地址详情 */
export function getAddressDetail(params: AddressDetailParams) {
    return request.post<AddressItem>('/student-school-shop/userAddress/getAddressById', params);
}
