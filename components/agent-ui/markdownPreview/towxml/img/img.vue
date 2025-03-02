<template>
    <view>
        <image
            :class="attrs.class"
            :lazy-load="true"
            :mode="attrs.mode || 'widthFix'"
            :src="attrs.src"
            :style="attrs.style + ' width:' + size.w + 'px;height:' + size.h + 'px;'"
            @load="load"
        ></image>
    </view>
</template>

<script>
const config = require('../config');
export default {
    data() {
        return {
            attr: {
                src: '',
                class: '',
                style: ''
            },

            size: {
                w: 0,
                h: 0
            },

            styleObj: {},

            attrs: {
                class: '',
                mode: '',
                src: '',
                style: ''
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
    methods: {
        attached: function () {
            const that = this;
            let dataAttr = this.data.attrs;

            // 将图片大小处理到对象中
            if (dataAttr.width) {
                that.size.w = +dataAttr.width / config.dpr;
            }
            if (dataAttr.height) {
                that.size.h = +dataAttr.height / config.dpr;
            }

            // 将样式合并到样式对象中
            if (dataAttr.style) {
                let re = /;\s{0,}/gi;
                dataAttr.style = dataAttr.style.replace(re, ';');
                dataAttr.style.split(';').forEach((item) => {
                    let itemArr = item.split(':');
                    if (/^(width|height)$/i.test(itemArr[0])) {
                        let num = parseInt(itemArr[1]) || 0;
                        let key = ''; // itemArr[1] = num / config.dpr + itemArr[1].replace(num,'');
                        switch (itemArr[0].toLocaleLowerCase()) {
                            case 'width':
                                key = 'w';
                                break;
                            case 'height':
                                key = 'h';
                                break;
                        }
                        that.size[key] = num / config.dpr;
                    } else {
                        that.styleObj[itemArr[0]] = itemArr[1];
                    }
                });
            }

            // 设置公式图片
            that.setData({
                attrs: {
                    src: dataAttr.src,
                    class: dataAttr.class,
                    style: that.setStyle(that.styleObj)
                },

                size: that.size
            });
        },

        // 设置图片样式
        setStyle: function (o) {
            let str = ``;
            for (let key in o) {
                str += `${key}:${o[key]};`;
            }
            return str;
        },

        // 图片加载完成设置图片大小
        load: function (e) {
            const that = this;
            if (!that.size.w || !that.size.h) {
                that.setData({
                    size: {
                        w: e.detail.width / config.dpr,
                        h: e.detail.height / config.dpr
                    }
                });
            }
        }
    },
    created: function () {}
};
</script>
<style></style>
