<script setup lang="ts">
import { ref } from 'vue';

import type { CoverItem } from '../../api/goods-detail/types';

const props = defineProps({
    list: {
        type: Array<CoverItem>,
        default: () => {
            return [];
        }
    }
});
const currentIndex = ref<number>(1);
const videoContent = ref<UniNamespace.VideoContext>();
const playing = ref(false);
const fnChange = (e: any) => {
    currentIndex.value = e.detail.current + 1;

    if (currentIndex.value !== 0 && props.list[0].type == 2) {
        playing.value = false;
    }
};
const playVideo = () => {
    console.log('play');
    playing.value = true;
};
const fnError = (e: any) => {
    console.log('playError', e);
};
const fnPreviewImages = (covers: CoverItem[], currentUrl: string) => {
    uni.previewImage({
        current: currentUrl,
        urls: covers.reduce((result: string[], item: CoverItem) => {
            if (item.type === 1) {
                result.push(item.cover);
            }

            return result;
        }, [])
    });
};
</script>
<template>
    <view class="cover-swiper-wrap">
        <swiper
            class="cover-swiper"
            :indicator-dots="false"
            :autoplay="false"
            circular
            @change="fnChange"
        >
            <swiper-item
                v-for="(cover, cIndex) in list"
                :key="cIndex"
                class="cover-swiper-item"
            >
                <view
                    v-if="cover.type === 2"
                    class="video-wrap"
                >
                    <video
                        v-if="playing"
                        id="myVideo"
                        :autoplay="true"
                        :controls="true"
                        class="cover-video"
                        :class="{ 'cover-video-show': playing }"
                        :poster="cover.cover"
                        :src="cover.videoUrl"
                        @error="fnError"
                    ></video>
                    <image
                        v-else
                        class="cover-image fixed"
                        :class="{ hide: playing }"
                        :src="cover.cover"
                        mode="aspectFill"
                    />
                </view>
                <image
                    v-else
                    class="cover-image"
                    :src="cover.cover"
                    mode="aspectFill"
                    @tap="fnPreviewImages(list, cover.cover)"
                />
                <view
                    v-if="cover.type == 2 && !playing"
                    class="video-btn"
                    @tap="playVideo"
                >
                    <zd-icon
                        type="zdmp-bofang"
                        color="#fff"
                        :size="100"
                    ></zd-icon>
                </view>
            </swiper-item>
        </swiper>
        <view class="indicator">{{ currentIndex }}/{{ list.length }}</view>
    </view>
</template>
<style lang="scss" scoped>
.cover-swiper-wrap {
    position: relative;
}
.cover-swiper {
    width: 750rpx;
    height: 750rpx;
}
.cover-swiper-item {
    position: relative;
}
.cover-image {
    width: 100%;
    height: 100%;
    &.fixed {
        position: absolute;
        top: 0;
        left: 0;
    }
    &.hide {
        left: -1000rpx;
    }
}
.video-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .cover-video {
        position: absolute;
        top: 0;
        left: -1000rpx;
        width: 100%;
        height: 100%;
        &-show {
            left: 0;
        }
    }
}

.video-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150rpx;
    height: 150rpx;
    border-radius: 100%;
    color: #fff;
    transform: translate(-50%, -50%);
    flex-direction: row;
}
.indicator {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    z-index: 1;
    padding: 0 20rpx;
    border-radius: 20rpx;
    color: #fff;
    font-size: 24rpx;
    background-color: rgba(0, 0, 0, 0.3);
    line-height: 40rpx;
}
</style>
