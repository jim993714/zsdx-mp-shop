<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        /** 占位符 */
        placeholder?: string;

        /** 是否为结果页 */
        isResult?: boolean;

        showSearchType?: boolean;

        /** 是否自动聚焦 */
        focus?: boolean;
    }>(),
    {
        placeholder: '请输入搜索关键词',
        showSearchType: false
    }
);

const emits = defineEmits<{
    (e: 'back', isResult?: boolean): void;
    (e: 'search', value: string): void;
    (e: 'update:modelValue', value: string): void;
    (e: 'focus'): void;
    (e: 'changeType', value: SearchType): void;
    (e: 'input', value: string): void;
}>();

function changeType(type: SearchType) {
    emits('changeType', type);
}

const keyword = useVModel(props, 'modelValue', emits);
const searchType = ref<SearchType>(1);
</script>
<script lang="ts">
export type SearchType = 1 | 2;
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <zd-header
        capsule
        fix-background="#fff"
        show-fixed
        show-header-left
    >
        <template #fix-set>
            <view class="header-wrapper">
                <view class="header-content">
                    <zd-icon
                        type="zdmp-fanhui"
                        :size="40"
                        @tap="emits('back')"
                    />
                    <view class="input-wrapper">
                        <!-- <uni-data-select
                            v-if="props.showSearchType"
                            v-model="searchType"
                            :clear="false"
                            :localdata="[
                                { value: 1, text: '商品' },
                                { value: 2, text: '企业' }
                            ]"
                            @change="changeType"
                        ></uni-data-select> -->
                        <uni-easyinput
                            v-model="keyword"
                            trim="all"
                            :input-border="false"
                            :placeholder="props.placeholder || '请输入关键词'"
                            :clearable="false"
                            :focus="props.focus"
                            @tap="emits('focus')"
                            @input="(val:string)=>emits('input', val)"
                        ></uni-easyinput>
                        <view
                            class="btn"
                            @tap.stop="emits('search', keyword)"
                        >
                            搜索
                        </view>
                    </view>
                </view>
                <view class="capsule"></view>
            </view>
        </template>
    </zd-header>
</template>

<style scoped lang="scss">
.header-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 88rpx;
    padding-left: 24rpx;
    box-sizing: border-box;
    .header-content {
        flex: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;

        .input-wrapper {
            display: flex;
            align-items: center;
            width: 456rpx;
            height: 64rpx;
            margin-left: 12rpx;
            padding: 0 10rpx;
            padding-left: 20rpx;
            border-radius: 44rpx;
            background-color: #f5f8fa;
            box-sizing: border-box;
            :deep(.uni-select) {
                border: none;
                border-bottom: none;
            }
            .btn {
                width: 88rpx;
                height: 48rpx;
                border-radius: 24rpx;
                text-align: center;
                color: #fff;
                font-size: 24rpx;
                background: #199fff;
                line-height: 48rpx;
            }
            :deep(.uni-easyinput__content) {
                overflow: hidden;
                height: 60rpx;
                background-color: #f5f8fa;
                flex: 1;
                flex: 1;
            }
            :deep(input) {
                flex: 1;
                background-color: #f5f8fa;
            }
            :deep(.uni-icons) {
                background-color: #f5f8fa;
            }
        }
    }
    .capsule {
        width: 194rpx;
        background-color: blue;
    }
}
</style>
