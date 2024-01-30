<script lang="ts" setup>
interface IItem {
    [key: string]: any;
}

const props = defineProps({
    /** 溢出隐藏行数 */
    titleLine: {
        type: String,
        default: '1'
    },
    /** 显示商品tag */
    showTitleTag: {
        type: Boolean,
        default: false
    },
    goodsTag: {
        type: String,
        default: ''
    },
    /** 显示左上角的tag */
    showHeaderTag: {
        type: Boolean,
        default: false
    },
    /** 商品信息 */
    item: {
        type: Object,
        default() {
            return {} as IItem;
        }
    },
    /** 商品价格Label */
    priceLabel: {
        type: String,
        default: '学生价'
    },
    /** 价格大数字 */

    fontSizeLarge: {
        type: Number,
        default: 24
    },
    /** 价格小数字 */

    fontSizeSmall: {
        type: Number,
        default: 20
    },
    /** 价格标识符 */
    fontSizeUnit: {
        type: Number,
        default: 20
    },
    /** 价格文字颜色 */
    priceColor: {
        type: String,
        default: 'rgba(255, 71, 52, 1)'
    },

    /** 按钮背景颜色 */
    btnBg: {
        type: String,
        default: '#ffffff'
    },
    /** 按钮文字 */
    btnText: {
        type: String,
        default: '立即购买'
    },
    /** 按钮文字颜色 */
    btnTextColor: {
        type: String,
        default: '#ffffff'
    },
    /** 按钮圆角 */
    btnBorderRadius: {
        type: String,
        default: '30rpx'
    },
    /** 按钮文字大小 */
    btnTextSize: {
        type: String,
        default: '24rpx'
    },
    /** 图片样式 */
    coverStyle: {
        type: Object,
        default() {
            return {};
        }
    },
    /** 主盒子的样式 */
    itemStyle: {
        type: Object,
        default() {
            return {};
        }
    },
    /** 商品内容的样式 */
    contentStyle: {
        type: Object,
        default() {
            return {};
        }
    }
});

/** 按钮点击事件 返回整个商品的信息 */
const onClick = () => {
    emit('click', props.item);
};

const emit = defineEmits(['click']);
</script>

<template>
    <view
        class="goods-warp"
        :style="props.itemStyle"
    >
        <view
            class="goods-item"
            :style="props.contentStyle"
        >
            <view
                v-if="showHeaderTag"
                class="goods-header-left"
            >
                <slot name="head-tag"></slot>
            </view>
            <image
                class="goods-cover"
                :src="props.item.goodsCover"
                mode="aspectFill"
                :style="props.coverStyle"
            />
            <view class="goods-info">
                <view class="goods-header">
                    <image
                        v-if="props.showTitleTag"
                        :src="props.goodsTag"
                        mode="aspectFill"
                        class="goods-title-tag"
                    />
                    <view
                        :class="{
                            'goods-title-text': true,
                            ellipsis: props.titleLine === '1',
                            ellipsis2: props.titleLine === '2',
                            'text-indent': props.showTitleTag
                        }"
                        >{{ props.item.goodsTitle }}</view
                    >
                </view>
                <view class="goods-tag-warp">
                    <slot name="tag"></slot>
                </view>
                <view class="goods-footer">
                    <slot name="footer">
                        <view class="goods-footer-price-warp">
                            <text
                                class="goods-price-label"
                                :style="{ color: props.priceColor }"
                            >
                                {{ props.priceLabel }}
                            </text>
                            <zd-price
                                :value="props.item.goodsPricePay"
                                :font-size-large="props.fontSizeLarge"
                                :font-size-small="props.fontSizeSmall"
                                :font-size-unit="props.fontSizeUnit"
                                :color="props.priceColor"
                            ></zd-price>
                            <!-- 价格扩展插槽 -->
                            <slot
                                v-if="$slots.priceExtra"
                                name="priceExtra"
                            />
                        </view>
                    </slot>
                </view>
                <view
                    v-if="btnText"
                    class="btn-warp"
                >
                    <slot name="btn">
                        <text
                            class="btn-text"
                            :style="{
                                color: props.btnTextColor,
                                background: props.btnBg,
                                borderRadius: props.btnBorderRadius,
                                fontSize: props.btnTextSize
                            }"
                            @tap.prevent.stop="onClick"
                            >{{ props.btnText }}</text
                        >
                    </slot>
                </view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.goods-warp {
    display: flex;
    justify-content: center;
    width: 750rpx;
    flex-direction: row;
}
.goods-item {
    position: relative;
    display: flex;
    overflow: hidden;
    width: 710rpx;
    height: 260rpx;
    padding: 20rpx;
    border-radius: 16rpx;
    background: #ffffff;
    flex-direction: row;
    box-sizing: border-box;
    .goods-header-left {
        position: absolute;
        top: 0;
        left: 0;
    }
    .goods-cover {
        width: 220rpx;
        height: 220rpx;
        margin-right: 22rpx;
    }
    .goods-info {
        position: relative;
        display: flex;
        width: 446rpx;
        flex-direction: column;
        flex: 1;
        .goods-header {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: row;
            .goods-title-tag {
                position: absolute;
                top: 6rpx;
                left: 0;
                width: 28rpx;
                height: 28rpx;
                margin-right: 6rpx;
            }
            .goods-title-text {
                flex: 1;
                color: #292f33;
                font-size: 28rpx;
                font-weight: 400;
                line-height: 40rpx;
            }
        }
        .goods-tag-warp {
            display: flex;
            width: 100%;
            flex-direction: row;
            margin-top: 20rpx;
            .goods-tag-item {
                width: 60rpx;
                height: 32rpx;
                border-radius: 4rpx;
                text-align: center;
                font-size: 20rpx;
                font-weight: 500;
                line-height: 32rpx;
            }
        }
        .goods-footer {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            .goods-footer-price-warp {
                display: flex;
                flex-direction: row;
                align-items: flex-end;
            }
            .goods-price-label {
                margin-right: 6rpx;
                font-size: 20rpx;
                font-weight: 500;
                line-height: 20rpx;
            }
        }
        .btn-warp {
            position: absolute;
            right: 0rpx;
            bottom: 0rpx;
            .btn-text {
                padding: 12rpx 24rpx;
                color: #ffffff;
                font-size: 28rpx;
                line-height: 28rpx;
                font-weight: 500;
            }
        }
    }
}
.text-indent {
    padding-left: 6rpx;
    text-indent: 1rem;
}
</style>
