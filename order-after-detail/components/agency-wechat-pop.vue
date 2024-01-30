<script setup lang="ts">
const zdPopupRef = ref();

const props = defineProps<{
    img: string;
    phone: string;
}>();

function open() {
    zdPopupRef.value?.open();
}

function close() {
    zdPopupRef.value?.close();
}

function call() {
    uni.makePhoneCall({
        phoneNumber: props.phone
    });
}

defineExpose({
    open,
    close
});
</script>

<template>
    <zd-popup
        ref="zdPopupRef"
        type="center"
    >
        <view class="container">
            <view class="content">
                <view class="title"> 代理信息 </view>
                <view class="qrcode">
                    <image
                        class="qrcode"
                        :src="props.img"
                        mode="scaleToFill"
                        show-menu-by-longpress
                    />
                </view>
                <view class="desc">长按添加代理微信</view>
                <view
                    class="contact"
                    @tap="call"
                >
                    <text class="label">联系电话: </text>
                    <text>{{ props.phone }}</text>
                    <zd-icon
                        style="margin-left: 20rpx"
                        type="zdmp-dianhua"
                        :size="24"
                    ></zd-icon>
                </view>
            </view>
            <view
                class="close"
                @tap="close"
            >
                <zd-icon
                    type="zdmp-guanbi1"
                    :size="56"
                ></zd-icon>
            </view>
        </view>
    </zd-popup>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.content {
    display: flex;
    align-items: center;
    width: 582rpx;
    height: 548rpx;
    border-radius: 32rpx;
    background-color: #fff;
    flex-direction: column;
    .title {
        margin: 40rpx 0;
        font-size: 32rpx;
        font-weight: bold;
    }
    .qrcode {
        width: 276rpx;
        height: 276rpx;
        color: red;
    }
    .desc {
        margin-top: 40rpx;
        color: #576066;
        font-size: 24rpx;
    }
    .contact {
        margin-top: 20rpx;
        color: $zd-main-color;
        font-size: 24rpx;
        font-weight: bold;
    }
}
.close {
    margin-top: 40rpx;
    color: #fff;
}
</style>
