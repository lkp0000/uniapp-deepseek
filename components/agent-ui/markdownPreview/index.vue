<template>
    <view>
        <!-- components/agent-ui/markdownPreview/index.wxml -->
        <towxml :nodes="text"></towxml>
    </view>
</template>

<script>
import towxml from '@/components/agent-ui/markdownPreview/towxml/towxml';
// components/agent-ui/markdownPreview/index.js
import { markdownToWxml } from './utils';
export default {
    components: {
        towxml
    },
    data() {
        return {
            text: {}
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        markdown: {
            type: String,
            default: ''
        }
    },
    watch: {
        markdown: function (value) {
            const wxml = markdownToWxml(value);
            this.setData({
                text: wxml
            });
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {},
    created: function () {}
};
</script>
<style>
/* components/agent-ui/markdownPreview/index.wxss */
</style>
