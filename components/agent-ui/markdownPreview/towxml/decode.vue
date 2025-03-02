<template>
    <view>
        <block v-for="(item, i) in nodes.children" :key="i">
            <block v-if="item.tag === undefined">{{ item.text }}</block>

            <block v-if="item.tag === 'view'">
                <block v-if="item.rely">
                    <view :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                        <decode v-if="item.children" :nodes="item" />
                    </view>
                </block>
                <block v-else>
                    <view class="h2w__viewParent">
                        <view :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                            <decode v-if="item.children" :nodes="item" />
                        </view>
                    </view>
                </block>
            </block>

            <block v-if="item.tag === 'video'">
                <view class="h2w__videoParent">
                    <video
                        :data-data="item"
                        :class="item.attrs.class"
                        :data="item.attrs.data"
                        :id="item.attrs.id"
                        :style="item.attrs.style"
                        @tap.stop.prevent="tapFun"
                        :poster="item.attrs.poster"
                        :src="item.attrs.src"
                    >
                        <decode v-if="item.children" :nodes="item" />
                    </video>
                </view>
            </block>

            <block v-if="item.tag === 'text'">
                <view class="h2w__textParent">
                    <text :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                        <decode v-if="item.children" :nodes="item" />
                    </text>
                </view>
            </block>

            <block v-if="item.tag === 'image'">
                <view class="h2w__imageParent">
                    <image
                        :data-data="item"
                        :class="item.attrs.class"
                        :data="item.attrs.data"
                        :id="item.attrs.id"
                        :style="item.attrs.style"
                        @tap.stop.prevent="tapFun"
                        :src="item.attrs.src"
                        :mode="item.attrs.mode ? item.attrs.mode : 'widthFix'"
                        :lazy-load="item.attr['lazy-load']"
                    >
                        <decode v-if="item.children" :nodes="item" />
                    </image>
                </view>
            </block>

            <block v-if="item.tag === 'navigator'">
                <view class="h2w__navigatorParent">
                    <navigator
                        :data-data="item"
                        :class="item.attrs.class"
                        :data="item.attrs.data"
                        :id="item.attrs.id"
                        :style="item.attrs.style"
                        @tap.stop.prevent="tapFun"
                        :url="item.attrs.href"
                    >
                        <decode v-if="item.children" :nodes="item" />
                    </navigator>
                </view>
            </block>

            <block v-if="item.tag === 'swiper'">
                <view class="h2w__swiperParent">
                    <swiper :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                        <decode v-if="item.children" :nodes="item" />
                    </swiper>
                </view>
            </block>

            <block v-if="item.tag === 'swiper-item'">
                <view class="h2w__swiper-itemParent">
                    <swiper-item :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                        <decode v-if="item.children" :nodes="item" />
                    </swiper-item>
                </view>
            </block>

            <block v-if="item.tag === 'block'">
                <view class="h2w__blockParent">
                    <block
                        :data-data="item"
                        :class="item.attrs.class"
                        :data="item.attrs.data"
                        :id="item.attrs.id"
                        :style="item.attrs.style"
                        @tap.native.stop.prevent="tapFun($event, { data: item, tagId: item.attrs.id })"
                    >
                        <decode v-if="item.children" :nodes="item" />
                    </block>
                </view>
            </block>

            <block v-if="item.tag === 'form'">
                <view class="h2w__formParent">
                    <form :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                        <decode v-if="item.children" :nodes="item" />
                    </form>
                </view>
            </block>

            <block v-if="item.tag === 'input'">
                <view class="h2w__inputParent">
                    <input :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun" />
                    <decode v-if="item.children" :nodes="item" />
                </view>
            </block>

            <block v-if="item.tag === 'textarea'">
                <view class="h2w__textareaParent">
                    <textarea :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
<decode v-if="item.children" :nodes="item"/></textarea
                    >
                </view>
            </block>

            <block v-if="item.tag === 'button'">
                <view class="h2w__buttonParent">
                    <button :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                        <decode v-if="item.children" :nodes="item" />
                    </button>
                </view>
            </block>

            <block v-if="item.tag === 'checkbox-group'">
                <view class="h2w__checkbox-groupParent">
                    <checkbox-group
                        :data-data="item"
                        :class="item.attrs.class"
                        :data="item.attrs.data"
                        :id="item.attrs.id"
                        :style="item.attrs.style"
                        @tap.stop.prevent="tapFun"
                        @change="parseEventDynamicCode($event, item.attrs.bindchange)"
                    >
                        <decode v-if="item.children" :nodes="item" />
                    </checkbox-group>
                </view>
            </block>

            <block v-if="item.tag === 'checkbox'">
                <view class="h2w__checkboxParent">
                    <checkbox
                        :data-data="item"
                        :class="item.attrs.class"
                        :data="item.attrs.data"
                        :id="item.attrs.id"
                        :style="item.attrs.style"
                        @tap.stop.prevent="tapFun"
                        :checked="item.attrs.checked"
                        :value="item.attrs.value"
                    >
                        <decode v-if="item.children" :nodes="item" />
                    </checkbox>
                </view>
            </block>

            <block v-if="item.tag === 'radio-group'">
                <view class="h2w__radio-groupParent">
                    <radio-group :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :id="item.attrs.id" :style="item.attrs.style" @tap.stop.prevent="tapFun">
                        <decode v-if="item.children" :nodes="item" />
                    </radio-group>
                </view>
            </block>

            <block v-if="item.tag === 'radio'">
                <view class="h2w__radioParent">
                    <radio
                        :data-data="item"
                        :class="item.attrs.class"
                        :data="item.attrs.data"
                        :id="item.attrs.id"
                        :style="item.attrs.style"
                        @tap.stop.prevent="tapFun"
                        :checked="item.attrs.checked"
                    >
                        <decode v-if="item.children" :nodes="item" />
                    </radio>
                </view>
            </block>

            <block v-if="item.tag === 'rich-text'">
                <view class="h2w__rich-textParent">
                    <rich-text :data-data="item" :class="item.attrs.class" :data="item.attrs.data" :style="item.attrs.style" @tap.stop.prevent="tapFun" :nodes="item.children">
                        <decode v-if="item.children" :nodes="item" />
                    </rich-text>
                </view>
            </block>

            <block v-if="item.tag === 'audio-player'">
                <audio-player :data="item" :data-data="item" @tap.native.stop.prevent="tapFun($event, { data: item })" />
            </block>

            <block v-if="item.tag === 'table'">
                <table :data="item" :data-data="item" @tap.native.stop.prevent="tapFun($event, { data: item })" />
            </block>

            <block v-if="item.tag === 'img'"><img :data="item" :data-data="item" @tap.native.stop.prevent="tapFun($event, { data: item })" /></block>
        </block>
    </view>
</template>

<script>
import decode from '@/components/agent-ui/markdownPreview/towxml/decode';
import audioPlayer from '@/components/agent-ui/markdownPreview/towxml/audio-player/audio-player';
import table from '@/components/agent-ui/markdownPreview/towxml/table/table';
import img from '@/components/agent-ui/markdownPreview/towxml/img/img';
const config = require('./config');
export default {
    components: {
        decode,
        audioPlayer,
        table,
        img
    },
    data() {
        return {
            i: '',
            undefined: ''
        };
    },
    options: {
        styleIsolation: 'apply-shared'
    },
    props: {
        nodes: {
            type: Object,
            default: () => ({})
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    methods: {
        attached: function () {
            const that = this;
            config.events.forEach((item) => {
                that['_' + item] = function (...arg) {
                    if (global._events && typeof global._events[item] === 'function') {
                        global._events[item](...arg);
                    }
                };
            });
        },

        tapFun(e, _dataset) {
            /* ---处理dataset begin--- */
            this.handleDataset(e, _dataset);
            /* ---处理dataset end--- */
            console.log('占位：函数 _tap 未声明');
        }
    },
    created: function () {}
};
</script>
<style></style>
