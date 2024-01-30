<script setup lang="ts">
import { router } from '@zsdx/mp-utils';

const props = defineProps<{
    lotteryNo: string;
}>();
const popup = ref();

const open = () => {
    popup.value.open('center');
};
const fnGoLottery = () => {
    router.push('lottery', {
        lotteryNo: props.lotteryNo
    });
};

defineExpose({
    open
});
</script>
<template>
    <uni-popup ref="popup">
        <image
            class="lottery-image"
            src="https://cdn.zsdx.cn/mp-cs/images/shop/order-confirm/lottery.png"
            mode="widthFixed"
            @tap="fnGoLottery"
        />
    </uni-popup>
</template>
<style lang="scss" scoped>
.lottery-image {
    width: 554rpx;
    height: 676rpx;
}
</style>
