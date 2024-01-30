<script setup lang="ts">
const emits = defineEmits<{
    (e: 'change', filter: number[]): void;
}>();

const rangeList = ref([[0, 50], [50, 150], [150, 300], [300]]);
const range = ref([0, 0]);
const min = ref('');
const max = ref('');
const visible = ref(false);

function show() {
    visible.value = true;
}

function close() {
    visible.value = false;
}

function selectItem(item: number[]) {
    range.value = [...item];
    min.value = item[0] + '';
    max.value = (item[1] ?? '') + '';
}

function reset() {
    range.value = [];
    min.value = '';
    max.value = '';
}

function comfirm() {
    visible.value = false;
    emits('change', range.value);
}

watch(min, newVal => {
    range.value[0] = parseInt(newVal);
});

watch(max, newVal => {
    range.value[1] = parseInt(newVal);
});

defineExpose({
    show,
    close
});
</script>
<script lang="ts">
export default {
    options: {
        styleIsolation: 'shared'
    }
};
</script>

<template>
    <view
        v-if="visible"
        class="filter-popup"
    >
        <view class="title"> 价格区间 </view>
        <view class="filter-list">
            <view
                v-for="(item, index) in rangeList"
                :key="index"
                class="filter-item"
                :class="{
                    'filter-item__active': item.join('') === range.join('')
                }"
                @tap="selectItem(item)"
            >
                <template v-if="item[1]"> {{ item[0] }}-{{ item[1] }} </template>
                <template v-else> {{ item[0] }}+</template>
            </view>
        </view>
        <view class="filter-list">
            <view class="filter-item filter-item-large">
                <uni-easyinput
                    v-model="min"
                    :input-border="false"
                    placeholder="最低价"
                    :clearable="false"
                ></uni-easyinput>
            </view>
            <view class="filter-item filter-item-large">
                <uni-easyinput
                    v-model="max"
                    :input-border="false"
                    placeholder="最高价"
                    :clearable="false"
                ></uni-easyinput>
            </view>
        </view>
        <view class="btn-wrapper">
            <zd-button @tap="reset">重置</zd-button>
            <zd-button
                type="primary"
                @tap="comfirm"
            >
                确定
            </zd-button>
        </view>
    </view>
</template>

<style scoped lang="scss">
.filter-popup {
    position: absolute;
    width: 750rpx;
    padding: 20rpx;
    font-size: 28rpx;
    background-color: #fff;
    box-sizing: border-box;
}
.filter-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20rpx;
    .filter-item {
        height: 60rpx;
        margin-bottom: 20rpx;
        padding: 0 30rpx;
        border-radius: 30rpx;
        text-align: center;
        background-color: #f5f8fa;
        line-height: 60rpx;
    }
    .filter-item__active {
        color: #199fff;
        background: rgba(25, 159, 255, 0.1);
    }
    .filter-item-large {
        width: 320rpx;
        box-sizing: border-box;
        :deep(.uni-easyinput__content) {
            height: 60rpx;
            background-color: #f5f8fa;
            flex: 1;
        }
        :deep(input) {
            flex: 1;
            height: 60rpx;
            background-color: #f5f8fa;
        }
    }
}
.btn-wrapper {
    display: flex;
    justify-content: space-around;
    :deep(button) {
        width: 320rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 32rpx;
    }
}
</style>
