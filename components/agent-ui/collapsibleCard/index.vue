<template>
    <!-- components/agent-ui/collapsibleCard/index.wxml -->
    <view>
        <view @tap="changeCollapsedStatus" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px">
            <slot name="title"></slot>
            <image
                src="/static/components/agent-ui/imgs/arrow.svg"
                mode="aspectFill"
                :style="'width: 16px;height: 16px;transform: rotate(' + (collapsedStatus ? 0 : 180) + 'deg);'"
            />
        </view>
        <block v-if="collapsedStatus">
            <slot name="content"></slot>
        </block>
    </view>
</template>

<script>
// components/agent-ui/collapsibleCard/index.js
export default {
    data() {
        return {
            collapsedStatus: false
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        initStatus: {
            type: Boolean,
            default: false
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
            this.setData({
                collapsedStatus: this.initStatus
            });
        },

        changeCollapsedStatus: function () {
            this.setData({
                collapsedStatus: !this.collapsedStatus
            });
        }
    },
    options: {
        multipleSlots: true
    },
    created: function () {}
};
</script>
<style>
/* components/agent-ui/collapsibleCard/index.wxss */
</style>
