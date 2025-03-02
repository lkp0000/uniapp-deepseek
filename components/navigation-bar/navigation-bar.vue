<template>
    <view :class="'weui-navigation-bar ' + extClass">
        <view
            :class="'weui-navigation-bar__inner ' + (ios ? 'ios' : 'android')"
            :style="'color: ' + color + '; background: ' + background + '; ' + displayStyle + '; ' + innerPaddingRight + '; ' + safeAreaTop + ';'"
        >
            <!-- 左侧按钮 -->
            <view class="weui-navigation-bar__left" :style="leftWidth + ';'">
                <block v-if="back || homeButton">
                    <!-- 返回上一页 -->
                    <block v-if="back">
                        <view class="weui-navigation-bar__buttons weui-navigation-bar__buttons_goback">
                            <view
                                @tap="backFun"
                                class="weui-navigation-bar__btn_goback_wrapper"
                                hover-class="weui-active"
                                hover-stay-time="100"
                                aria-role="button"
                                aria-label="返回"
                            >
                                <view class="weui-navigation-bar__button weui-navigation-bar__btn_goback"></view>
                            </view>
                        </view>
                    </block>
                    <!-- 返回首页 -->
                    <block v-if="homeButton">
                        <view class="weui-navigation-bar__buttons weui-navigation-bar__buttons_home">
                            <view @tap="home" class="weui-navigation-bar__btn_home_wrapper" hover-class="weui-active" aria-role="button" aria-label="首页">
                                <view class="weui-navigation-bar__button weui-navigation-bar__btn_home"></view>
                            </view>
                        </view>
                    </block>
                </block>
                <block v-else>
                    <slot name="left"></slot>
                </block>
            </view>

            <!-- 标题 -->
            <view class="weui-navigation-bar__center">
                <view v-if="loading" class="weui-navigation-bar__loading" aria-role="alert">
                    <view class="weui-loading" aria-role="img" aria-label="加载中"></view>
                </view>
                <block v-if="title">
                    <text>{{ title }}</text>
                </block>
                <block v-else>
                    <slot name="center"></slot>
                </block>
            </view>

            <!-- 右侧留空 -->
            <view class="weui-navigation-bar__right">
                <slot name="right"></slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            displayStyle: '',
            ios: '',
            innerPaddingRight: '',
            leftWidth: '',
            safeAreaTop: ''
        };
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    props: {
        extClass: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        background: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: ''
        },
        back: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        homeButton: {
            type: Boolean,
            default: false
        },
        animated: {
            // 显示隐藏的时候opacity动画效果
            type: Boolean,
            default: true
        },
        show: {
            // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
            type: Boolean,

            default: true
        },
        // back为true的时候，返回的页面深度
        delta: {
            type: Number,
            default: 1
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        attached() {
            const rect = uni.getMenuButtonBoundingClientRect();
            uni.getSystemInfo({
                success: (res) => {
                    const isAndroid = res.platform === 'android';
                    const isDevtools = res.platform === 'devtools';
                    this.setData({
                        ios: !isAndroid,
                        innerPaddingRight: `padding-right: ${res.windowWidth - rect.left}px`,
                        leftWidth: `width: ${res.windowWidth - rect.left}px`,
                        safeAreaTop: isDevtools || isAndroid ? `height: calc(var(--height) + ${res.safeArea.top}px); padding-top: ${res.safeArea.top}px` : ``
                    });
                }
            });
        },

        showChangeFun(show) {
            const animated = this.animated;
            let displayStyle = '';
            if (animated) {
                displayStyle = `opacity: ${show ? '1' : '0'};transition:opacity 0.5s;`;
            } else {
                displayStyle = `display: ${show ? '' : 'none'}`;
            }
            this.setData({
                displayStyle
            });
        },

        backFun() {
            const data = this;
            if (data.delta) {
                uni.navigateBack({
                    delta: data.delta
                });
            }
            this.$emit(
                'back',
                {
                    detail: {
                        delta: data.delta
                    }
                },
                {}
            );
        },

        home() {
            console.log('占位：函数 home 未声明');
        }
    },
    created: function () {},
    watch: {
        show: {
            handler: function (show) {
                const animated = this.animated;
                let displayStyle = '';
                if (animated) {
                    displayStyle = `opacity: ${show ? '1' : '0'};transition:opacity 0.5s;`;
                } else {
                    displayStyle = `display: ${show ? '' : 'none'}`;
                }
                this.setData({
                    displayStyle
                });
            },

            immediate: true
        }
    }
};
</script>
<style>
.weui-navigation-bar {
    --weui-FG-0: rgba(0, 0, 0, 0.9);
    --height: 44px;
    --left: 16px;
}
.weui-navigation-bar .android {
    --height: 48px;
}

.weui-navigation-bar {
    overflow: hidden;
    color: var(--weui-FG-0);
    flex: none;
}

.weui-navigation-bar__inner {
    position: relative;
    top: 0;
    left: 0;
    height: calc(var(--height) + env(safe-area-inset-top));
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: env(safe-area-inset-top);
    width: 100%;
    box-sizing: border-box;
}

.weui-navigation-bar__left {
    position: relative;
    padding-left: var(--left);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    height: 100%;
    box-sizing: border-box;
}

.weui-navigation-bar__btn_goback_wrapper {
    padding: 11px 18px 11px 16px;
    margin: -11px -18px -11px -16px;
}

.weui-navigation-bar__btn_goback_wrapper.weui-active {
    opacity: 0.5;
}

.weui-navigation-bar__btn_goback {
    font-size: 12px;
    width: 12px;
    height: 24px;
    -webkit-mask: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z'/%3E%3C/svg%3E")
        no-repeat 50% 50%;
    mask: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z'/%3E%3C/svg%3E")
        no-repeat 50% 50%;
    -webkit-mask-size: cover;
    mask-size: cover;
    background-color: var(--weui-FG-0);
}

.weui-navigation-bar__center {
    font-size: 17px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex: 1;
    height: 100%;
}

.weui-navigation-bar__loading {
    margin-right: 4px;
    align-items: center;
}

.weui-loading {
    font-size: 16px;
    width: 16px;
    height: 16px;
    display: block;
    background: transparent
        url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='80px' height='80px' viewBox='0 0 80 80' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3Eloading%3C/title%3E%3Cdefs%3E%3ClinearGradient x1='94.0869141%25' y1='0%25' x2='94.0869141%25' y2='90.559082%25' id='linearGradient-1'%3E%3Cstop stop-color='%23606060' stop-opacity='0' offset='0%25'%3E%3C/stop%3E%3Cstop stop-color='%23606060' stop-opacity='0.3' offset='100%25'%3E%3C/stop%3E%3C/linearGradient%3E%3ClinearGradient x1='100%25' y1='8.67370605%25' x2='100%25' y2='90.6286621%25' id='linearGradient-2'%3E%3Cstop stop-color='%23606060' offset='0%25'%3E%3C/stop%3E%3Cstop stop-color='%23606060' stop-opacity='0.3' offset='100%25'%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' opacity='0.9'%3E%3Cg%3E%3Cpath d='M40,0 C62.09139,0 80,17.90861 80,40 C80,62.09139 62.09139,80 40,80 L40,73 C58.2253967,73 73,58.2253967 73,40 C73,21.7746033 58.2253967,7 40,7 L40,0 Z' fill='url(%23linearGradient-1)'%3E%3C/path%3E%3Cpath d='M40,0 L40,7 C21.7746033,7 7,21.7746033 7,40 C7,58.2253967 21.7746033,73 40,73 L40,80 C17.90861,80 0,62.09139 0,40 C0,17.90861 17.90861,0 40,0 Z' fill='url(%23linearGradient-2)'%3E%3C/path%3E%3Ccircle id='Oval' fill='%23606060' cx='40.5' cy='3.5' r='3.5'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A")
        no-repeat;
    background-size: 100%;
    margin-left: 0;
    animation: loading linear infinite 1s;
}

@keyframes loading {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
