import { useRequest } from '@zsdx/mp-utils';

import type { ICombinationDetail, IPackageParams } from './types';

const request = useRequest();

/**获取组合包详情*/
export const getActivityDetail = (params: IPackageParams) => {
    return request.post<ICombinationDetail>(
        '/student-school-shop/activity/schoolSeasonCombinationPackage/getActivityDetail',
        params
    );
};
