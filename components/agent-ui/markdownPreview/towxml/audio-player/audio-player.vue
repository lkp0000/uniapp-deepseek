<template>
    <view :class="'h2w__audio ' + (tips.state || 'h2w__audio--loading')" @tap="playAndPause">
        <view class="h2w__audioIcon"></view>
        <view class="h2w__audioCover">
            <image class="h2w__audioLoading" src="/static/components/agent-ui/markdownPreview/towxml/audio-player/loading.svg"></image>
            <image class="h2w__audioCoverImg" :src="data.attrs.poster"></image>
        </view>
        <view class="h2w__audioInfo">
            <view class="h2w__audioTips">{{ tips.text || 'Error' }}</view>
            <view class="h2w__audioSchedule" :style="'width:' + time.schedule + ';'"></view>
            <view class="h2w__audioTitle">{{ data.attrs.name }}</view>
            <view class="h2w__audioAuthor">{{ data.attrs.author }}</view>
            <view class="h2w__audioTime">{{ time.currentTime || '00:00:00' }} / {{ time.duration || '00:00:00' }}</view>
        </view>
    </view>
</template>

<script>
const Audio = require('./Audio');
export default {
    data() {
        return {
            tips: {
                state: '',
                text: '--'
            },
            time: {
                currentTime: '00:00:00',
                duration: '00:00:00',
                schedule: '0%'
            }
        };
    },
    options: {
        styleIsolation: 'shared'
    },
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    moved: function () {
        _ts.audio.stop();
        _ts.audio.destroy();
    },
    destroyed: () => {
        _ts.audio.stop();
        _ts.audio.destroy();
    },
    methods: {
        // 页面生命周期
        attached: function () {
            const that = this;
            const audio = (that.audio = new Audio(this.data));
            audio.eventPlay = function () {
                that.setData({
                    tips: {
                        state: 'h2w__audio--play',
                        text: 'Playing'
                    }
                });
            };
            audio.eventCanplay = function () {
                that.setData({
                    tips: {
                        state: 'h2w__audio--readyed',
                        text: 'Readyed'
                    }
                });
            };
            audio.eventTimeUpdate = function (duration, currentTime) {
                that.setData({
                    time: {
                        currentTime: currentTime,
                        duration: duration,
                        schedule: (Math.round(that.audio.currentTime) / Math.round(that.audio.duration)) * 100 + '%'
                    }
                });
            };
            audio.eventPause = function () {
                that.setData({
                    tips: {
                        state: 'h2w__audio--pause',
                        text: 'Pause'
                    }
                });
            };
            audio.eventStop = function () {
                that.setData({
                    tips: {
                        state: 'h2w__audio--end',
                        text: 'End'
                    }
                });
            };

            // // 更新播放状态
            // _ts.audio.onTimeUpdate = function(duration,currentTime){
            //  _ts.setData({
            //    playerData:{
            //      state:'h2w__audio--play',
            //      tips:'Playing',
            //      currentTime:currentTime,
            //      duration:duration,
            //      schedule:_ts.audio.currentTime / _ts.audio.duration * 100 + '%'
            //    }
            //  });
            // };

            // _ts.audio.onPause = function(){
            //  _ts.setData({playerData:{state:'h2w__audio--pause',tips:'Pause'}});
            // };

            // _ts.audio.onCanplay = function(){
            //  _ts.setData({playerData:{state:'h2w__audio--readyed',tips:'Readyed'}});
            // };

            // _ts.audio.onError = function(){
            //  _ts.setData({playerData:{state:'h2w__audio--error',tips:'Error'}});
            // };

            // _ts.audio.onEnded = ()=>{
            //  _ts.setData({playerData:{state:'h2w__audio--end',tips:'End'}});
            // };
        },

        playAndPause: function () {
            const that = this;
            const audio = that.audio; // console.log(audio);
            audio.isTouch = true;
            if (audio.status === 'update' || audio.status === 'play') {
                // console.log('pause');
                audio.pause();
            } else {
                // console.log('play');
                audio.play();
            }
        }
    },
    created: function () {}
};
</script>
<style>
/*音频播放器样式*/
.h2w__audio {
    height: 136rpx;
    margin: 16rpx 0;
    background: #f1f1f1;
    position: relative;
}

.h2w__audio--error .h2w__audioIcon,
.h2w__audio--loading .h2w__audioIcon {
    display: none;
}

.h2w__audio--readyed .h2w__audioLoading,
.h2w__audio--end .h2w__audioLoading,
.h2w__audio--play .h2w__audioIcon,
.h2w__audio--pause .h2w__audioLoading,
.h2w__audio--play .h2w__audioLoading {
    display: none;
}

.h2w__audio--play .h2w__audioCover image {
    opacity: 1;
}

.h2w__audio--readyed .h2w__audioTips,
.h2w__audio--end .h2w__audioTips,
.h2w__audio--stop .h2w__audioTips,
.h2w__audio--pause .h2w__audioTips,
.h2w__audio--play .h2w__audioTips {
    opacity: 0.4;
}

.h2w__audio--error {
    background: red;
}

/* .h2w__audio--end .h2w__audio__icon {width:20rpx; height:20rpx; background:white; border:0; left:24rpx; top:24rpx; border-radius:2rpx;} */
.h2w__audioCover {
    width: 136rpx;
    height: 136rpx;
    background: black;
    float: left;
    position: relative;
}

.h2w__audioCover image {
    width: 100%;
    height: 100%;
    opacity: 0.6;
    margin: 0;
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.h2w__audioCover .h2w__audioLoading {
    width: 80rpx;
    height: 80rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -40rpx 0 0 -40rpx;
    z-index: 1;
    opacity: 1;
}

.h2w__audioInfo {
    padding-left: 20rpx;
    padding-top: 16rpx;
    position: absolute;
    left: 136rpx;
    right: 0;
}

.h2w__audioSchedule {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 255, 0, 0.1);
    height: 136rpx;
    width: 0;
}

.h2w__audioTips {
    position: absolute;
    right: 0;
    top: 0;
    height: 32rpx;
    line-height: 32rpx;
    padding: 10rpx 20rpx;
    font-size: 20rpx;
}

.h2w__audio--error .h2w__audioTips {
    color: red;
}

.h2w__audioTitle {
    display: block;
    font-size: 24rpx;
    height: 40rpx;
    line-height: 40rpx;
    font-weight: bold;
}

.h2w__audioAuthor {
    display: block;
    font-size: 20rpx;
    height: 32rpx;
    line-height: 32rpx;
}

.h2w__audioTime {
    display: block;
    font-size: 20rpx;
    height: 32rpx;
    line-height: 32rpx;
}

.h2w__audioIcon {
    width: 0;
    height: 0;
    position: absolute;
    left: 60rpx;
    top: 48rpx;
    border-width: 20rpx 0 20rpx 20rpx;
    border-style: solid;
    border-color: transparent transparent transparent #fff;
    z-index: 1;
}

/* 深色主题 */
.h2w-dark .h2w__audio {
    background: #1f1f1f;
}

.h2w-dark .h2w__audio--error {
    background: rgba(255, 0, 0, 0.1);
}

.h2w-dark .h2w__audioCover {
    background: black;
}

.h2w-dark .h2w__audioSchedule {
    background: rgba(0, 255, 0, 0.2);
}

.h2w-dark .h2w__audioIcon {
    border-color: transparent transparent transparent #fff;
}

/* 浅色主题 */
.h2w-light .h2w__audio {
    background: #f1f1f1;
}

.h2w-light .h2w__audio--error {
    background: rgba(255, 0, 0, 0.1);
}

.h2w-light .h2w__audioCover {
    background: black;
}

.h2w-light .h2w__audioSchedule {
    background: rgba(0, 255, 0, 0.1);
}

.h2w-light .h2w__audioIcon {
    border-color: transparent transparent transparent #fff;
}
</style>
