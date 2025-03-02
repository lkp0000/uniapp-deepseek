<template>
    <view>
        <!-- index.wxml -->
        <agent-ui :agentConfig="agentConfig"></agent-ui>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';
import agentUi from '@/components/agent-ui/index';
// index.js
export default {
    components: {
        navigationBar,
        agentUi
    },
    data() {
        return {
            agentConfig: {
                type: 'model',
                // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，modelName和model必填
                botId: 'bot-e7d1e736',
                // agent id
                modelName: 'deepseek',
                // 大模型服务商
                model: 'deepseek-r1',
                // 具体的模型版本
                logo: 'https://docs.cloudbase.net/img/logo.svg',
                // 图标(只在model模式下生效)
                welcomeMessage: '欢迎语!' // 欢迎语(只在model模式下生效)
            }
        };
    },
    methods: {}
};
</script>
<style></style>
