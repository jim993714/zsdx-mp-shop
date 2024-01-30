<script setup lang="ts">
import type { GoodsInfo, Product, Spec, SpecItem } from '../types';

interface Props {
    /**
     * key
     */
    index: number;
    /**
     * 商品基本信息(展示使用)
     */
    info: GoodsInfo;
    /**
     * sku列表
     */
    productList: Product[];
    /**
     * 规格列表
     */
    specList: Spec[];

    /**
     * 展示数量
     */
    showNumber?: boolean;
    /**
     * 按钮文字
     */
    buttonText?: string;
}
const props = withDefaults(defineProps<Props>(), {
    showNumber: true,
    buttonText: '确定',
    index: 0
});
const emit = defineEmits(['selectSku']);
const specs = ref<Spec[]>([]);
const checkedProductArray = ref<string[]>([]);
const checkedProduct = ref<Product>();
// 当前选中的数量
const currCount = ref(1);
/**
 * 总库存
 */
const stock = computed(() => {
    if (checkedProduct.value) {
        return checkedProduct.value.productStock;
    }
    return props.productList.reduce((result, item) => {
        result += item.productStock;
        return result;
    }, 0);
});

const checkAbleSpecNos = computed(() => {
    return props.productList.reduce((result, item: Product) => {
        if (item.specList) {
            return item.specList.reduce((subResult: any, item: SpecItem) => {
                subResult.add(item.specNo);
                return subResult;
            }, result);
        }
        return result;
    }, new Set<string>());
});
// 当前选中sku商品信息
const goodsInfo = computed((): GoodsInfo => {
    if (checkedProduct.value) {
        return {
            goodsNo: props.info.goodsNo,
            goodsCover: checkedProduct.value.productImage,
            goodsPrice: checkedProduct.value.productPrice,
            buyCount: props.info.buyCount,
            buyLimitCount: props.info.buyLimitCount
        };
    } else {
        return props.info;
    }
});

/**
 * 格式化当前选中的值
 */
const filterSelected = (product: Product | undefined): string => {
    if (!product) {
        let needCheck = specs.value.reduce((result: string[], item: Spec, index: number) => {
            if (checkedProductArray.value.length == 0) {
                result.push(item.name);
            } else if (!checkedProductArray.value[index]) {
                result.push(item.name);
            }
            return result;
        }, []);

        return '请选择: ' + needCheck.join('/');
    } else {
        let checked = product.specList.reduce((result: string[], item: any) => {
            result.push(item.specValue);
            return result;
        }, []);
        return '已选择: ' + checked.join(';');
    }
};

/**
 * 更新规格列表
 */
const getSpecList = (): Spec[] => {
    // 如果只有一个sku, 默认选中
    if (props.productList.length === 1) {
        checkedProduct.value = props.productList[0];
        checkedProductArray.value = checkedProduct.value.productIdentify.split('-');
        emit('selectSku', checkedProduct.value, props.index);
    }
    const list = props.specList.reduce((result: Spec[], item) => {
        const itemResult: Spec = {
            name: item.name,
            list: item.list.reduce((listResult: SpecItem[], listItem: any): SpecItem[] => {
                listResult.push({
                    ...listItem,
                    disabled: false,
                    checked: checkedProductArray.value.indexOf(listItem.specNo) >= 0
                });
                return listResult;
            }, [])
        };

        result.push(itemResult);
        return result;
    }, []);

    return list;
};
/**
 * 选中规格
 */
const checkItem = (item: SpecItem, list: SpecItem[]) => {
    if (item.disabled) {
        return;
    }
    list.forEach(listItem => {
        if (listItem.specNo == item.specNo) {
            listItem.checked = !listItem.checked;
        } else {
            listItem.checked = false;
        }
    });
    getCurrentSelected();
    updateCheckAble();

    emit('selectSku', checkedProduct.value, props.index);
};
/**
 * 更新是否可选
 */
const updateCheckAble = () => {
    let currList = JSON.parse(JSON.stringify(checkedProductArray.value));

    specs.value.forEach((spec, index) => {
        let last = currList[index];

        for (let i = 0; i < spec.list.length; i++) {
            currList[index] = spec.list[i].specNo;
            spec.list[i].disabled = checkDisabled(currList, spec.list[i].specNo);
        }
        currList[index] = last;
    });
};
/**
 * 检测是否可以点击
 * @param currList
 */
const checkDisabled = (currList: string[], currSpecNo?: string) => {
    for (let i in currList) {
        if (!currList[i]) {
            if (currSpecNo) {
                return !checkAbleSpecNos.value.has(currSpecNo);
            }
            return false;
        }
    }
    const key = currList.join('-');

    for (let k in props.productList) {
        if (props.productList[k].productIdentify === key && props.productList[k].productStock > 0) {
            return false;
        }
    }
    return true;
};
/**
 * 计算当前选中的规格
 */
const getCurrentSelected = () => {
    if (!specs.value) {
        checkedProductArray.value = [];
    }
    // 获取所有规格的选中值(空则保存为空)
    checkedProductArray.value = specs.value.reduce((result: string[], item: Spec) => {
        let findResult = item.list.find((specItem: SpecItem) => {
            if (specItem.checked) {
                return true;
            }
            return false;
        });
        result.push(findResult ? findResult.specNo : '');

        return result;
    }, []);

    // 检测是否有漏选
    for (let i in checkedProductArray.value) {
        if (!checkedProductArray.value[i]) {
            checkedProduct.value = undefined;
            return;
        }
    }
    let key = checkedProductArray.value.join('-');

    checkedProduct.value = props.productList.find((item: Product) => {
        return key == item.productIdentify;
    });
};

onMounted(() => {
    // 初始化显示的spec
    specs.value = getSpecList();
    getCurrentSelected();
    updateCheckAble();
});
/**
 * 监听进行更新
 */
watch(
    () => props.specList,
    () => {
        specs.value = getSpecList();
        getCurrentSelected();
        updateCheckAble();
    }
);
watch(
    () => stock.value,
    () => {
        if (currCount.value > stock.value) {
            currCount.value = stock.value;
        }
    }
);
</script>

<template>
    <view class="sku-main">
        <view class="sku-info">
            <image
                class="sku-info-cover"
                :src="goodsInfo.goodsCover"
                mode="aspectFill"
            />
            <view class="sku-info-main">
                <view class="sku-info-title ellipsis2">{{ goodsInfo.goodsTitle }}</view>
                <view>
                    <zd-price
                        :value="goodsInfo.goodsPrice"
                        :font-size-large="40"
                        :font-size-small="24"
                        :font-size-unit="20"
                    ></zd-price>

                    <view class="sku-info-stock">库存{{ stock }}件</view>
                    <view class="sku-info-selected ellipsis">{{
                        filterSelected(checkedProduct)
                    }}</view>
                </view>
            </view>
        </view>

        <view
            v-for="(spec, sIndex) in specs"
            :key="sIndex"
            class="sku-item"
        >
            <view class="sku-item-title">{{ spec.name }}</view>
            <view class="sku-item-detail">
                <view
                    v-for="(subSpec, subIndex) in spec.list"
                    :key="subIndex"
                    class="sku-sub-item ellipsis"
                    :class="{ active: subSpec.checked, disabled: subSpec.disabled }"
                    @tap="checkItem(subSpec, spec.list)"
                >
                    {{ subSpec.specValue }}
                </view>
            </view>
        </view>
    </view>
</template>

<style scoped lang="scss">
.sku-main {
    width: 100%;
    padding: 40rpx 0;
    border-radius: 32rpx 32rpx 0 0;
    background-color: #fff;
    box-sizing: border-box;
    flex-direction: column;
}
.sku-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    .sku-info-cover {
        width: 200rpx;
        height: 200rpx;
        margin-right: 20rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
        background-color: $uni-bg-color-grey;
    }
    .sku-info-main {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        overflow: hidden;
        height: 200rpx;
        flex: 1;
        flex-direction: column;
    }
    .sku-info-stock {
        margin-top: 16rpx;
        color: $uni-text-color-grey;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }
    .sku-info-selected {
        margin-top: 16rpx;
        color: $uni-text-color;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 24rpx;
    }
}

.sku-item {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    overflow-x: hidden;
    width: 100%;
    flex-direction: column;
}
.sku-item-title {
    margin-top: 40rpx;
    color: $uni-text-color;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 28px;
}
.sku-item-detail {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: calc(100% + 24rpx);
    flex-direction: row;
    flex-wrap: wrap;
    margin-right: -24rpx;
}
.sku-sub-item {
    max-width: 100%;
    margin-top: 20rpx;
    margin-right: 24rpx;
    padding: 0 20rpx;
    border: 1px solid #f5f8fa;
    border-radius: 12rpx;
    color: $uni-text-color;
    font-size: 24rpx;
    background: #f5f8fa;
    line-height: 64rpx;
    box-sizing: border-box;
    &.disabled {
        color: $uni-text-color-grey;
        opacity: 0.8;
    }
    &.active {
        border: 1px solid $uni-color-primary;
        color: $uni-color-primary;
        background: rgba(25, 159, 255, 0.1);
    }
}
.sku-number {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    margin-top: 40rpx;
    padding-bottom: 60rpx;
    .sku-number-title {
        color: $uni-text-color;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 28rpx;
    }
    .sku-number-subtitle {
        color: $uni-text-color-grey;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 28rpx;
        flex: 1;
    }
    .sku-number-seat {
        flex: 1;
    }
}
</style>
