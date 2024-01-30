import { useRequest } from '@zsdx/mp-utils';

import type {
    ISchoolDumplingDetail,
    ISchoolDumplingDetailParams,
    PrizeLogisticsInfo,
    StudentInfo,
    UpdateGoodsParams
} from './types';

const request = useRequest();

/**
 * 更新学生购物车商品数量
 */
export function updateShopCart(params: UpdateGoodsParams) {
    return request.post('/student-school-shop/shopCart/addOrUpdateShopCart', params);
}

/**
 * 获取学生认证信息
 * @param params
 * @returns
 */
export function getStudentVerify() {
    return request.post<StudentInfo>('/student-school-shop/studentCertification/getStudentVerify');
}

/**
 * 获取校园团活动明细
 */
export const getSchoolDumplingDetail = (params: ISchoolDumplingDetailParams) => {
    return request.post<ISchoolDumplingDetail>(
        '/student-school-shop/activity/school-dumpling/detail',
        params
    );
};

/**
 * 获取奖品物流信息
 */
export function getPrizeLogisticsInfo(exchangeNo: string) {
    return request.post<PrizeLogisticsInfo>(
        '/student-school-shop/activity/lottery/exchange/track/info',
        {
            exchangeNo
        }
    );
}
