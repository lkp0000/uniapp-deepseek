<template>
    <view :class="'h2w h2w-' + nodes.theme">
        <view class="h2w__main">
            <decode :nodes="nodes" />
        </view>
    </view>
</template>

<script>
import decode from './decode';
export default {
    components: {
        decode
    },
    data() {
        return {
            someData: {}
        };
    },
    options: {
        styleIsolation: 'shared'
    },
    props: {
        nodes: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {},
    created: function () {}
};
</script>
<style>
@import './style/main.css';
@import './style/theme/light.css';
@import './style/theme/dark.css'; /**基础风格样式**/

/**主题配色（浅色样式）**/

/**主题配色（深色样式）**/

.h2w__main {
    margin: 0px;
    padding: 0px;
}
</style>
