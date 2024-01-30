<script setup lang="ts">
const props = defineProps<{
    storageKey: string;
    studentShopId?: string;
    trackSearchSession?: string;
}>();

const historyList = ref<string[]>([]);

onBeforeMount(() => {
    loadList();
});

async function loadList() {
    const res: UniApp.GetStorageSuccess = await new Promise(resolve => {
        uni.getStorage({
            key: props.storageKey,
            success: res => resolve(res),
            fail: err => resolve(err)
        });
    });

    if (res.data) {
        historyList.value = res.data.split?.('<>');
    }
}

async function addHistory(keyword: string) {
    if (!keyword) return;
    const index = historyList.value.findIndex(item => item === keyword);
    if (index > -1) historyList.value.splice(index, 1);
    historyList.value.unshift(keyword);
    historyList.value = historyList.value.slice(0, 20);
    await new Promise(resolve => {
        uni.setStorage({
            key: props.storageKey,
            data: historyList.value.join('<>'),
            success: () => resolve(true),
            fail: err => resolve(err)
        });
    });
}

async function clearHistory() {
    const resp = await new Promise(resolve => {
        uni.showModal({
            content: '是否清空你所有的搜索记录？',
            confirmColor: '#199fff',
            cancelColor: '#8A9399',
            success: function (res) {
                if (res.confirm) {
                    resolve(1);
                } else if (res.cancel) {
                    resolve(0);
                }
            }
        });
    });
    if (resp) {
        uni.removeStorage({ key: props.storageKey });
        historyList.value = [];
    }
}

const emits = defineEmits<{
    (e: 'change', value: string): void;
}>();
defineExpose({
    addHistory,
    clearHistory
});
</script>

<template>
    <view
        v-if="historyList.length > 0"
        class="history-list"
    >
        <view class="header">
            <view class="title">最近搜索</view>
            <zd-icon
                type="zdmp-shanchu"
                :size="40"
                @tap="clearHistory"
            />
        </view>
        <view class="list">
            <track-view
                v-for="(item, index) in historyList"
                :key="index"
                :track-data="{
                    type: 'all',
                    observerName: '.list-item' + index,
                    eventData: {
                        path: 'bi_search',
                        student_shop_id: studentShopId,
                        search_word: item,
                        search_session: trackSearchSession
                    },
                    clickData: {
                        action: 3
                    },
                    exposureData: {
                        action: 2
                    }
                }"
            >
                <view
                    class="list-item ellipsis"
                    :class="'list-item' + index"
                    @tap="emits('change', item)"
                >
                    {{ item }}
                </view>
            </track-view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.history-list {
    box-sizing: border-box;
    width: 100%;
    padding: 20rpx;
    .header {
        display: flex;
        justify-content: space-between;
    }

    .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: 20rpx;
        &-item {
            max-width: 690rpx;
            height: 44rpx;
            margin-right: 20rpx;
            margin-bottom: 20rpx;
            padding: 0 20rpx;
            border-radius: 22rpx;
            font-size: 24rpx;
            background-color: $uni-text-color-inverse;
            line-height: 44rpx;
        }
    }
}
</style>
