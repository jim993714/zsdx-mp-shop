<script setup lang="ts">
import { router } from '@/utils/router/useRouter';

const props = defineProps<{
    activityNo?: string;
    alertImage?: string;
}>();

const image = ref('');

watch(
    () => props.alertImage,
    val => {
        console.log('fsafasdf', val);
        if (val) {
            image.value = val;
            open();
        }
    }
);

const popup = ref();

const open = () => {
    popup.value.open('center');
};

function fnGoOnecent() {
    router.push('oneCentPurchase', {});
}

defineExpose({
    open
});
</script>
<template>
    <uni-popup ref="popup">
        <image
            class="lottery-image"
            :src="image"
            mode="widthFixed"
            @tap="fnGoOnecent"
        />
    </uni-popup>
</template>
<style lang="scss" scoped>
.lottery-image {
    width: 554rpx;
    height: 676rpx;
}
</style>
