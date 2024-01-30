import { router } from '@zsdx/mp-utils';

import { useUserStore } from '@/stores/user';

import { getStudentVerify } from '../../api/common/index';
import type { StudentInfo } from '../../api/common/types';

export default function useStudentAuth(popup?: Ref<any>) {
    const studentAuthDetail = ref<StudentInfo>();
    const userStore = useUserStore();
    const { isLogin, userInfo } = toRefs(userStore);

    /** 验证 */
    async function validate() {
        if (userInfo.value?.userVerify !== '1') {
            // 审核未通过
            popup?.value?.open();
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    async function getAuthStatus() {
        let resp;
        try {
            resp = await getStudentVerify();
        } catch (err: any) {
            uni.showToast({
                title: err.msg ?? '未知错误',
                icon: 'none'
            });
        }
        if (resp) {
            studentAuthDetail.value = resp;
        }
        return resp;
    }

    async function toStudentAuth(beforeGet?: boolean) {
        if (!isLogin) return router.push('login');
        popup?.value.close();
        if (beforeGet) {
            try {
                studentAuthDetail.value = await getAuthStatus();
            } catch (err: any) {
                uni.showToast({
                    title: err.msg ?? '未知错误',
                    icon: 'none'
                });
            }
        }

        if (studentAuthDetail.value?.verify === 0) {
            //等待审核
            return router.push('studentAuthStatus', {
                status: 1
            });
        }
        if (studentAuthDetail.value?.verify === -1) {
            //审核未通过
            return router.push('studentAuthStatus', {
                status: 2,
                reason: studentAuthDetail.value.verifyFailReason
            });
        }
        if (studentAuthDetail.value?.changeVerifyStatus === '0') {
            //变更审核中
            return router.push('studentAuthStatus', {
                status: 1,
                from: 'update'
            });
        }
        if (studentAuthDetail.value?.changeVerifyStatus === '-1') {
            //变更审核中
            return router.push('studentAuthStatus', {
                status: 2,
                from: 'update',
                reason: studentAuthDetail.value.studentChangeDTO?.verifyFailReason
            });
        }

        return router.push('studentAuth');
    }

    return {
        studentAuthDetail,
        toStudentAuth,
        getAuthStatus,
        validate
    };
}
