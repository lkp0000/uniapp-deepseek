<template>
    <!-- agent ui 组件根容器 -->
    <view class="agent-ui">
        <!-- 聊天对话区 -->
        <scroll-view
            @wheel="onWheel"
            @tap="toBottom"
            :enhanced="true"
            @scroll="onScroll"
            :scroll-with-animation="true"
            @dragstart="handleScrollStart"
            class="main"
            :style="'height: ' + (windowInfo.windowHeight - footerHeight) + 'px;'"
            :scroll-y="true"
            :scroll-top="viewTop"
            :scroll-into-view="scrollTo"
            lower-threshold="1"
            @scrolltolower="handleScrollToLower"
        >
            <view class="nav">
                <image :src="bot.avatar || agentConfig.logo" mode="aspectFill" class="avatar" />
                <view style="line-height: 47px">{{ agentConfig.type === 'bot' ? bot.name : agentConfig.modelName }}</view>
                <view style="line-height: 26px; padding: 0px 16px">{{ agentConfig.type === 'bot' ? '' : agentConfig.welcomeMessage }}</view>
            </view>
            <view class="guide_system" v-if="showGuide">
                <markdownPreview :markdown="guide"></markdownPreview>
            </view>
            <view class="bot_intro_system" v-if="agentConfig.type === 'bot'">
                <markdownPreview :markdown="bot.introduction || ''"></markdownPreview>
            </view>
            <block v-for="(item, index) in chatRecords" :key="index">
                <view class="system" v-if="item.role === 'assistant'">
                    <!-- 联网搜索 -->
                    <FoldedCard v-if="item.search_info" :initStatus="false">
                        <view slot="title" style="opacity: 0.7; font-size: 16px">已搜索到 {{ item.search_info.search_results.length }} 个网页</view>
                        <view slot="content">
                            <block v-for="(item, index1) in item.search_info.search_results" :key="index1">
                                <view
                                    @tap="copyUrl"
                                    :data-url="item.url"
                                    style="font-size: 14px; color: #2c56f0; line-height: 24px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                                >
                                    {{ index + 1 }}. {{ item.title }}
                                </view>
                            </block>
                        </view>
                    </FoldedCard>
                    <!-- 知识库 -->
                    <!-- 推理过程 -->
                    <FoldedCard v-if="!!item.reasoning_content" :initStatus="true">
                        <view slot="title" style="opacity: 0.7; font-size: 16px">{{ item.reasoning_content && !item.content ? '思考中...' : '已深度思考' }}</view>
                        <view style="padding-left: 30rpx; border-left: rgb(165, 164, 164) solid 2px; opacity: 0.7; font-size: 12px !important" slot="content">
                            <markdownPreview :markdown="item.reasoning_content || ''"></markdownPreview>
                        </view>
                    </FoldedCard>
                    <markdownPreview :markdown="item.content || ''"></markdownPreview>
                    <view style="display: flex; gap: 10px; justify-content: flex-end" v-if="!streamStatus">
                        <image
                            mode="widthFix"
                            @tap="copyChatRecord"
                            src="/static/components/agent-ui/imgs/copy.svg"
                            style="width: 36rpx; height: 36rpx"
                            :data-content="item.content"
                        />
                        <button class="share_btn" open-type="share">
                            <image mode="widthFix" src="/static/components/agent-ui/imgs/share.svg" style="width: 36rpx; height: 36rpx; vertical-align: top" @tap="share" />
                        </button>
                    </view>
                </view>

                <view class="userContent" v-if="item.role === 'user'">
                    <view class="user">
                        <view>
                            {{ item.content }}
                        </view>
                    </view>
                    <view class="fileBar">
                        <chatFile
                            style="margin-right: 32rpx"
                            :enableDel="false"
                            :fileData="innerItem"
                            @removeChild="handleRemoveChild"
                            @changeChild="handleChangeChild"
                            v-for="(innerItem, index1) in item.fileList"
                            :key="index1"
                        ></chatFile>
                    </view>
                    <view style="display: flex; flex-direction: row-reverse; overflow-x: auto; white-space: nowrap; margin: 0px 16px 0px 100rpx">
                        <block v-for="(item1, index1) in item.imageList" :key="index1">
                            <image :src="item1.tempFilePath" alt="" model="aspectFill" style="width: 80px; height: 80px; margin-left: 8px; flex-shrink: 0; border-radius: 10px" />
                        </block>
                    </view>
                </view>
            </block>
            <!-- 推荐问题 -->
            <block v-for="(item, index) in questions" :key="index">
                <view class="questions">
                    <view class="question_content" @tap="sendMessage" :data-message="item">{{ item }}</view>
                </view>
            </block>
            <view id="scroll-bottom" style="width: 100%; height: 20px"></view>
        </scroll-view>
        <!-- 底部输入区 -->
        <view class="footer">
            <view class="feature_list" v-if="showFeatureList">
                <view @tap="handleClickWebSearch" :class="'webSearchSwitch ' + (useWebSearch ? 'feature_enable' : '')">
                    <image :src="useWebSearch ? './imgs/internetUse.svg' : './imgs/internet.svg'" mode="" style="width: 40rpx; height: 30px; margin-right: 10rpx" />
                    <text>联网搜索</text>
                </view>
            </view>
            <view class="file_list" v-if="showFileList">
                <chatFile :fileData="item" @removeChild="handleRemoveChild" @changeChild="handleChangeChild" v-for="(item, index) in sendFileList" :key="index"></chatFile>
            </view>
            <view class="foot-function">
                <scroll-view class="img-box" :scroll-x="true" v-if="!!imageList.length">
                    <block v-for="(item, index) in imageList" :key="index">
                        <view class="img-preview">
                            <image :src="item.tempFilePath" alt="" model="aspectFill" class="img-preview-image" />
                            <!-- 蒙层 -->
                            <view class="img-preview-loading" v-if="!!!item.base64Url"></view>
                            <!-- 删除按钮 -->
                            <image src="/static/components/agent-ui/imgs/close.svg" mode="aspectFill" class="img-preview-close" @tap="deleteImg" :data-index="index" />
                        </view>
                    </block>
                </scroll-view>

                <view class="input_box">
                    <input
                        class="input"
                        :value="inputValue"
                        type="text"
                        maxlength="1024"
                        @focus="bindInputFocus"
                        @input="bindKeyInput"
                        placeholder="说点什么吧"
                        @confirm="sendMessage"
                        confirm-type="send"
                        adjust-position
                        cursor-spacing="20"
                    />
                    <!-- 加号 -->
                    <image src="/static/components/agent-ui/imgs/set.svg" class="set" mode="widthFix" @tap="handleClickTools" />
                    <!-- 发送按钮 -->
                    <image
                        src="/static/components/agent-ui/imgs/send.svg"
                        class="set"
                        mode="widthFix"
                        v-if="!!inputValue && !streamStatus"
                        @tap="sendMessage"
                        style="transform: rotate(-40deg); transform-origin: 8px 8px"
                    />
                    <!-- 暂停按钮 -->
                    <image src="/static/components/agent-ui/imgs/stop.svg" class="set" mode="widthFix" v-if="!!streamStatus" @tap="stop" />
                </view>
            </view>
            <!-- 底部工具栏 -->
            <view class="tool_box" v-if="showTools">
                <view class="function" @tap="clearChatRecords">
                    <image src="/static/components/agent-ui/imgs/clear.svg" alt="widthFix" class="icon" />
                    <text class="text_desc">清除</text>
                </view>
                <view class="function" @tap="uploadImgs" v-if="agentConfig.model === 'hunyuan-vision' && agentConfig.type === 'model'">
                    <image src="/static/components/agent-ui/imgs/uploadImg.svg" alt="widthFix" class="icon" />
                    <text class="text_desc">添加图片</text>
                </view>
                <view v-if="enableUpload && agentConfig.type === 'bot'" class="function" @tap="handleUploadImg">
                    <image src="/static/components/agent-ui/imgs/uploadImg.svg" alt="widthFix" class="icon" />
                    <text class="text_desc">图片</text>
                </view>
                <view v-if="enableUpload && agentConfig.type === 'bot'" class="function" @tap="handleUploadFile">
                    <image src="/static/components/agent-ui/imgs/file.svg" alt="widthFix" class="icon" />
                    <text class="text_desc">文件</text>
                </view>
                <view v-if="enableUpload && agentConfig.type === 'bot'" class="function" @tap="handleCamera">
                    <image src="/static/components/agent-ui/imgs/camera.svg" alt="widthFix" class="icon" />
                    <text class="text_desc">相机</text>
                </view>
            </view>
            <!-- 设置面板 -->
            <view class="set_panel_modal" v-if="setPanelVisibility" @tap="closeSetPanel">
                <view class="set_panel">
                    <view class="set_panel_funtion">
                        <view class="function" @tap="clearChatRecords">
                            <image src="/static/components/agent-ui/imgs/clear.svg" alt="widthFix" class="icon" />
                            <text class="text_desc">清除对话</text>
                        </view>
                        <view class="function" @tap="uploadImgs" v-if="agentConfig.model === 'hunyuan-vision' && agentConfig.type === 'model'">
                            <image src="/static/components/agent-ui/imgs/uploadImg.svg" alt="widthFix" class="icon" />
                            <text class="text_desc">添加图片</text>
                        </view>
                    </view>
                    <view class="set_panel_cancel" @tap="closeSetPanel">取消</view>
                </view>
            </view>
        </view>
        <image
            @tap="autoToBottom"
            v-if="manualScroll"
            style="width: 30px; height: 30px; border-radius: 50px; position: absolute; bottom: 150px; right: 20px; background-color: white"
            src="/static/components/agent-ui/imgs/toBottom.svg"
            mode="aspectFit"
            @error=""
            @load=""
        />
    </view>
</template>

<script>
import markdownPreview from '@/components/agent-ui/markdownPreview/index';
import FoldedCard from '@/components/agent-ui/collapsibleCard/index';
import chatFile from '@/components/agent-ui/chatFile/index';
// components/agent-ui/index.js
import { guide, checkConfig } from './tools';
export default {
    components: {
        markdownPreview,
        FoldedCard,
        chatFile
    },
    data() {
        return {
            isLoading: true,

            // 判断是否尚在加载中
            article: {},

            windowInfo: uni.getWindowInfo(),

            bot: {
                avatar: '',
                name: '',
                introduction: ''
            },

            inputValue: '',
            output: '',
            chatRecords: [],
            scrollTop: 0,
            streamStatus: false,
            setPanelVisibility: false,
            questions: [],
            scrollTop: 0,
            guide,
            showGuide: false,
            imageList: [],
            scrollTop: 0,

            // 文字撑起来后能滚动的最大高度
            viewTop: 0,

            // 根据实际情况，可能用户手动滚动，需要记录当前滚动的位置
            scrollTo: '',

            // 快速定位到指定元素，置底用
            scrollTimer: null,

            //
            manualScroll: false,

            // 当前为手动滚动/自动滚动
            showTools: false,

            // 展示底部工具栏
            showFileList: false,

            // 展示顶部文件行
            sendFileList: [],

            footerHeight: 80,
            lastScrollTop: 0,
            enableUpload: false,

            // 待支持
            showWebSearchSwitch: false,

            useWebSearch: false,
            showFeatureList: false,
            innerItem: ''
        };
    },
    props: {
        agentConfig: {
            type: Object,
            default: () => ({
                type: '',

                // 值为'bot'或'model'。当type='bot'时，botId必填；当type='model'时，model必填
                botId: '',

                // agent id
                modelName: '',

                // 大模型服务商
                model: '',

                // 具体的模型版本
                logo: '',

                // 图标(只在model模式下生效)
                welcomeMessage: '',

                // 欢迎语(只在model模式下生效)
                allowWebSearch: true
            })
        }
    },
    watch: {
        showWebSearchSwitch: function (showWebSearchSwitch) {
            this.setData({
                showFeatureList: showWebSearchSwitch
            });
        },
        showTools: function (isShow) {
            if (isShow) {
                this.setData({
                    footerHeight: this.footerHeight + 80
                });
            } else {
                this.setData({
                    footerHeight: this.footerHeight - 80
                });
            }
        },
        showFileList: function (isShow) {
            if (isShow) {
                this.setData({
                    footerHeight: this.footerHeight + 80
                });
            } else {
                this.setData({
                    footerHeight: this.footerHeight - 80
                });
            }
        },
        showFeatureList: function (isShow) {
            if (isShow) {
                this.setData({
                    footerHeight: this.footerHeight + 30
                });
            } else {
                this.setData({
                    footerHeight: this.footerHeight - 30
                });
            }
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    methods: {
        attached: async function () {
            const { botId, type } = this.agentConfig;
            const [check, message] = checkConfig(this.agentConfig);
            if (!check) {
                uni.showModal({
                    title: '提示',
                    content: message
                });
                this.setData({
                    showGuide: true
                });
            } else {
                this.setData({
                    showGuide: false
                });
            }
            if (type === 'bot') {
                const ai = wx.cloud.extend.AI;
                const bot = await ai.bot.get({
                    botId
                });
                // 新增错误提示
                if (bot.code) {
                    uni.showModal({
                        title: '提示',
                        content: bot.message
                    });
                    return;
                }
                this.setData({
                    bot,
                    questions: bot.initQuestions,
                    showWebSearchSwitch: bot.searchEnable && this.agentConfig.allowWebSearch
                });
            }
        },

        // 滚动相关处理
        calculateContentHeight() {
            return new Promise((resolve) => {
                const query = uni.createSelectorQuery().in(this);
                query
                    .selectAll('.main >>> .system, .main >>> .userContent')
                    .boundingClientRect((rects) => {
                        let totalHeight = 0;
                        rects.forEach((rect) => {
                            totalHeight += rect.height;
                        });
                        resolve(totalHeight);
                    })
                    .exec();
            });
        },

        calculateContentInTop() {
            return new Promise((resolve) => {
                const query = uni.createSelectorQuery().in(this);
                query
                    .selectAll('.main >>> .nav, .main >>> .guide_system, .main >>> .bot_intro_system')
                    .boundingClientRect((rects) => {
                        let totalHeight = 0;
                        rects.forEach((rect) => {
                            totalHeight += rect.height;
                        });
                        // console.log('top height', totalHeight);
                        resolve(totalHeight);
                    })
                    .exec();
            });
        },

        onWheel: function (e) {
            // 解决小程序开发工具中滑动
            if (!this.manualScroll && e.detail.deltaY < 0) {
                this.setData({
                    manualScroll: true
                });
            }
        },

        onScroll: function (e) {
            if (e.detail.scrollTop < this.lastScrollTop) {
                // 鸿蒙系统上可能滚动事件，拖动事件失效，兜底处理
                this.setData({
                    manualScroll: true
                });
            }
            this.setData({
                lastScrollTop: e.detail.scrollTop
            });

            // 针对连续滚动的最后一次进行处理，scroll-view的 scroll end事件不好判定
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer);
            }
            const { scrollTop, scrollHeight, height } = e.detail;
            this.setData({
                scrollTimer: setTimeout(() => {
                    // console.log(
                    //   'e.detail.scrollTop data.scrollTop',
                    //   scrollTop,
                    //   this.data.scrollTop,
                    //   this.data.manualScroll
                    // );
                    const newTop = Math.max(this.scrollTop, e.detail.scrollTop);
                    if (this.manualScroll) {
                        this.setData({
                            scrollTop: newTop
                        });
                    } else {
                        this.setData({
                            scrollTop: newTop,
                            viewTop: newTop
                        });
                    }
                }, 100)
            });
        },

        handleScrollStart: function (e) {
            console.log('drag start', e);
            if (e.detail.scrollTop > 0) {
                // 手动开始滚
                this.setData({
                    manualScroll: true
                });
            }
        },

        handleScrollToLower: function (e) {
            console.log('scroll to lower', e);
            // 监听到底转自动
            this.setData({
                manualScroll: false
            });
        },

        autoToBottom: function () {
            console.log('autoToBottom');
            this.setData({
                manualScroll: false,
                scrollTo: 'scroll-bottom'
            });
            // console.log('scrollTop', this.data.scrollTop);
        },

        bindInputFocus: function (e) {
            this.setData({
                manualScroll: false
            });
            this.autoToBottom();
        },

        //
        bindKeyInput: function (e) {
            this.setData({
                inputValue: e.detail.value
            });
        },

        clearChatRecords: function () {
            this.setData({
                chatRecords: [],
                streamStatus: false
                // setPanelVisibility: !this.data.setPanelVisibility,
            });
        },

        handleUploadImg: function () {
            const that = this;
            uni.chooseMessageFile({
                count: 10,
                type: 'image',
                success(res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    // const tempFilePaths = res.tempFiles;
                    console.log('res', res);
                    const tempFiles = res.tempFiles.map((item) => ({
                        tempId: `${new Date().getTime()}-${item.name}`,
                        rawType: item.type,
                        // 微信选择默认的文件类型 image/video/file
                        fileName: item.name,
                        // 文件名
                        tempPath: item.path,
                        fileSize: item.size,
                        fileUrl: '',
                        fileId: ''
                    }));
                    // 过滤掉已选择中的 file 文件（保留image）
                    const filterFileList = that.sendFileList.filter((item) => item.rawType !== 'file');
                    const finalFileList = [...filterFileList, ...tempFiles];
                    console.log('final', finalFileList);
                    that.setData({
                        sendFileList: finalFileList //
                    });

                    if (finalFileList.length) {
                        that.setData({
                            showFileList: true,
                            showTools: false
                        });
                    }
                }
            });
        },

        handleUploadFile: function () {
            const that = this;
            uni.chooseMessageFile({
                count: 10,
                type: 'file',
                success(res) {
                    // tempFilePath可以作为img标签的src属性显示图片
                    // const tempFilePaths = res.tempFiles;
                    console.log('res', res);
                    const tempFiles = res.tempFiles.map((item) => ({
                        tempId: `${new Date().getTime()}-${item.name}`,
                        rawType: item.type,
                        // 微信选择默认的文件类型 image/video/file
                        fileName: item.name,
                        // 文件名
                        tempPath: item.path,
                        fileSize: item.size,
                        fileUrl: '',
                        fileId: ''
                    }));
                    // 过滤掉已选择中的 image 文件（保留file)
                    const filterFileList = that.sendFileList.filter((item) => item.rawType !== 'image');
                    const finalFileList = [...filterFileList, ...tempFiles];
                    console.log('final', finalFileList);
                    that.setData({
                        sendFileList: finalFileList //
                    });

                    if (finalFileList.length) {
                        that.setData({
                            showFileList: true,
                            showTools: false
                        });
                    }
                }
            });
        },

        handleCamera: function () {
            const that = this;
            uni.chooseMedia({
                count: 9,
                mediaType: ['image'],
                sourceType: ['camera'],
                maxDuration: 30,
                camera: 'back',
                success(res) {
                    console.log('res', res);
                    // console.log(res.tempFiles[0].tempFilePath)
                    // console.log(res.tempFiles[0].size)
                    const tempFiles = res.tempFiles.map((item) => {
                        let index = item.tempFilePath.lastIndexOf('.');
                        const fileExt = item.tempFilePath.substring(index + 1);
                        const randomFileName = new Date().getTime() + '.' + fileExt;
                        return {
                            tempId: randomFileName,
                            rawType: item.fileType,
                            // 微信选择默认的文件类型 image/video/file
                            fileName: randomFileName,
                            // 文件名
                            tempPath: item.tempFilePath,
                            fileSize: item.size,
                            fileUrl: '',
                            fileId: ''
                        };
                    });
                    // 过滤掉已选择中的 file 文件（保留image）
                    const filterFileList = that.sendFileList.filter((item) => item.rawType !== 'file');
                    const finalFileList = [...filterFileList, ...tempFiles];
                    console.log('final', finalFileList);
                    that.setData({
                        sendFileList: finalFileList //
                    });

                    if (finalFileList.length) {
                        that.setData({
                            showTools: false,
                            showFileList: true
                        });
                    }
                }
            });
        },

        stop: function () {
            this.autoToBottom();
            const { chatRecords } = this;
            const newChatRecords = [...chatRecords];
            const record = newChatRecords[newChatRecords.length - 1];
            if (record.content === '...') {
                record.content = '已暂停回复';
            }
            this.setData({
                streamStatus: false,
                chatRecords: newChatRecords,
                manualScroll: false
            });
        },

        openSetPanel: function () {
            this.setData({
                setPanelVisibility: true
            });
        },

        closeSetPanel: function () {
            this.setData({
                setPanelVisibility: false
            });
        },

        sendMessage: async function (event) {
            if (this.showFileList) {
                this.setData({
                    showFileList: !this.showFileList
                });
            }
            if (this.showTools) {
                this.setData({
                    showTools: !this.showTools
                });
            }
            const { message } = event.currentTarget.dataset;
            let { inputValue, bot, agentConfig, chatRecords, streamStatus, imageList } = this;
            // 如果正在流式输出，不让发送消息
            if (streamStatus) {
                return;
            }
            // 将传进来的消息给到inputValue
            if (message) {
                inputValue = message;
            }
            // 空消息返回
            if (!inputValue) {
                return;
            }
            // 图片上传没有完成，返回
            if (imageList.length) {
                if (imageList.filter((item) => !item.base64Url).length) {
                    return;
                }
            }
            const { type, modelName, model } = agentConfig;
            // console.log(inputValue,bot.botId)
            const userRecord = {
                content: inputValue,
                record_id: 'record_id' + String(+new Date() - 10),
                role: 'user',
                imageList: [...imageList]
            };
            userRecord.fileList = this.sendFileList;
            if (this.sendFileList.length) {
                this.setData({
                    sendFileList: []
                });
            }

            // // TODO: 判断是否携带图片(hunyuan-vision 用到)，携带则scrollTop 增加
            // if (imageList.length) {
            //   const newScrollTop = this.data.scrollTop;
            //   if (this.data.manualScroll) {
            //     this.setData({
            //       scrollTop: newScrollTop,
            //     });
            //   } else {
            //     this.setData({
            //       scrollTop: newScrollTop,
            //       viewTop: newScrollTop,
            //     });
            //   }
            // }

            const record = {
                content: '...',
                record_id: 'record_id' + String(+new Date() + 10),
                role: 'assistant'
            };
            this.setData({
                inputValue: '',
                questions: [],
                chatRecords: [...chatRecords, userRecord, record],
                streamStatus: false,
                imageList: []
            });

            // 新增一轮对话记录时 自动往下滚底
            this.autoToBottom();
            if (type === 'bot') {
                const ai = wx.cloud.extend.AI;
                const res = await ai.bot.sendMessage({
                    data: {
                        botId: bot.botId,
                        history: [
                            ...chatRecords.map((item) => ({
                                role: item.role,
                                content: item.content
                            }))
                        ],
                        msg: inputValue,
                        fileList: userRecord.fileList.map((item) => ({
                            type: item.rawType,
                            fileId: item.fileId
                        })),
                        searchEnable: this.useWebSearch
                    }
                });
                this.setData({
                    streamStatus: true
                });
                let contentText = '';
                let reasoningContentText = '';
                for await (let event of res.eventStream) {
                    if (!this.streamStatus) {
                        break;
                    }
                    this.toBottom();
                    const { data } = event;
                    try {
                        const dataJson = JSON.parse(data);
                        // console.log(dataJson)
                        const { type, content, reasoning_content, record_id, search_info, role, knowledge_meta, finish_reason } = dataJson;
                        const newValue = [...this.chatRecords];
                        // 取最后一条消息更新
                        const lastValue = newValue[newValue.length - 1];
                        lastValue.role = role || 'assistant';
                        lastValue.record_id = record_id || lastValue.record_id;
                        // 优先处理错误,直接中断
                        if (finish_reason === 'error') {
                            lastValue.search_info = null;
                            lastValue.reasoning_content = '';
                            lastValue.knowledge_meta = [];
                            lastValue.content = '网络繁忙，请稍后重试!';
                            this.setData({
                                chatRecords: newValue
                            });
                            break;
                        }
                        // 下面根据type来确定输出的内容
                        // 只更新一次参考文献，后续再收到这样的消息丢弃
                        if (type === 'search' && !lastValue.search_info) {
                            lastValue.search_info = search_info;
                            this.setData({
                                chatRecords: newValue
                            });
                        }
                        // 思考过程
                        if (type === 'thinking') {
                            reasoningContentText += reasoning_content;
                            lastValue.reasoning_content = reasoningContentText;
                            this.setData({
                                chatRecords: newValue
                            });
                        }
                        // 内容
                        if (type === 'text') {
                            contentText += content;
                            lastValue.content = contentText;
                            this.setData({
                                chatRecords: newValue
                            });
                        }
                        // 知识库，这个版本没有文件元信息，展示不更新
                        if (type === 'knowledge') {
                            // lastValue.knowledge_meta = knowledge_meta
                            // this.setData({ chatRecords: newValue });
                        }
                    } catch (e) {
                        console.log('CatchClause', e);
                        console.log('CatchClause', e);
                        // console.log('err', event, e)
                        break;
                    }
                }
                this.setData({
                    streamStatus: false
                });
                if (bot.isNeedRecommend) {
                    const ai = wx.cloud.extend.AI;
                    const recommendRes = await ai.bot.getRecommendQuestions({
                        data: {
                            botId: bot.botId,
                            history: [],
                            msg: inputValue,
                            agentSetting: '',
                            introduction: '',
                            name: ''
                        }
                    });
                    let result = '';
                    for await (let str of recommendRes.textStream) {
                        // console.log(str);
                        this.toBottom();
                        result += str;
                        this.setData({
                            questions: result.split('\n').filter((item) => !!item)
                        });
                    }
                }
            }
            if (type === 'model') {
                const aiModel = wx.cloud.extend.AI.createModel(modelName);
                let params = {};
                if (model === 'hunyuan-vision') {
                    params = {
                        model: model,
                        messages: [
                            ...chatRecords.map((item) => ({
                                role: item.role,
                                content: [
                                    {
                                        type: 'text',
                                        text: item.content
                                    },
                                    ...(item.imageList || []).map((item) => ({
                                        type: 'image_url',
                                        image_url: {
                                            url: item.base64Url
                                        }
                                    }))
                                ]
                            })),
                            {
                                role: 'user',
                                content: [
                                    {
                                        type: 'text',
                                        text: inputValue
                                    },
                                    ...imageList.map((item) => ({
                                        type: 'image_url',
                                        image_url: {
                                            url: item.base64Url
                                        }
                                    }))
                                ]
                            }
                        ]
                    };
                } else {
                    params = {
                        model: model,
                        messages: [
                            ...chatRecords.map((item) => ({
                                role: item.role,
                                content: item.content
                            })),
                            {
                                role: 'user',
                                content: inputValue
                            }
                        ]
                    };
                }
                const res = await aiModel.streamText({
                    data: params
                });
                let contentText = '';
                let reasoningText = '';
                this.setData({
                    streamStatus: true
                });
                for await (let event of res.eventStream) {
                    if (!this.streamStatus) {
                        break;
                    }
                    this.toBottom();
                    const { data } = event;
                    try {
                        const dataJson = JSON.parse(data);
                        const { id, choices = [] } = dataJson || {};
                        const { delta, finish_reason } = choices[0] || {};
                        if (finish_reason === 'stop') {
                            break;
                        }
                        const { content, reasoning_content, role } = delta;
                        reasoningText += reasoning_content || '';
                        contentText += content || '';
                        const newValue = [...this.chatRecords];
                        newValue[newValue.length - 1] = {
                            content: contentText,
                            reasoning_content: reasoningText,
                            record_id: 'record_id' + String(id),
                            role: role
                        };
                        this.setData({
                            chatRecords: newValue
                        });
                    } catch (e) {
                        console.log('CatchClause', e);
                        console.log('CatchClause', e);
                        // console.log(e, event)
                        break;
                    }
                }
                this.setData({
                    streamStatus: false
                });
            }
        },

        toBottom: async function () {
            const clientHeight = this.windowInfo.windowHeight - this.footerHeight; // 视口高度
            const contentHeight = (await this.calculateContentHeight()) + (await this.calculateContentInTop()); // 内容总高度
            // console.log(
            //   'contentHeight clientHeight newTop',
            //   contentHeight,
            //   clientHeight,
            //   this.data.scrollTop + 4
            // );
            if (clientHeight - contentHeight < 10) {
                // 只有当内容高度接近视口高度时才开始增加 scrollTop
                const newTop = this.scrollTop + 4;
                if (this.manualScroll) {
                    this.setData({
                        scrollTop: newTop
                    });
                } else {
                    this.setData({
                        scrollTop: newTop,
                        viewTop: newTop
                    });
                }
            }
        },

        copyChatRecord: function (e) {
            // console.log(e)
            const { content } = e.currentTarget.dataset;
            uni.setClipboardData({
                data: content + '\n\n来自微信云开发AI+',
                success: function (res) {
                    uni.showToast({
                        title: '复制成功',
                        icon: 'success'
                    });
                }
            });
        },

        addFileList: function () {
            // 顶部文件行展现时，隐藏底部工具栏
            this.setData({});
        },

        subFileList: function () {},

        uploadImgs: function () {
            const that = this;
            uni.chooseMedia({
                count: 9,
                mediaType: ['image'],
                sourceType: ['album', 'camera'],
                maxDuration: 30,
                camera: 'back',
                success(media) {
                    // console.log(media.tempFiles)
                    const { tempFiles } = media;
                    that.setData({
                        imageList: [...tempFiles]
                    });
                    tempFiles.forEach((img, index) => {
                        const lastDotIndex = img.tempFilePath.lastIndexOf('.');
                        const fileExtension = img.tempFilePath.substring(lastDotIndex + 1);
                        uni.getFileSystemManager().readFile({
                            filePath: img.tempFilePath,
                            encoding: 'base64',
                            success(file) {
                                const base64String = file.data;
                                const base64Url = `data:image/${fileExtension};base64,${base64String}`;
                                const { imageList } = that;
                                const image = imageList[index];
                                image.base64Url = base64Url;
                                that.setData({
                                    imageList: [...imageList]
                                });
                            }
                        });
                    });
                },
                fail(e) {
                    console.log(e);
                }
            });
        },

        deleteImg: function (e) {
            const {
                currentTarget: {
                    dataset: { index }
                }
            } = e;
            const { imageList } = this;
            const newImageList = imageList.filter((_, idx) => idx != index);
            this.setData({
                imageList: [...newImageList]
            });
        },

        copyUrl: function (e) {
            const { url } = e.currentTarget.dataset;
            console.log(url);
            uni.setClipboardData({
                data: url,
                success: function (res) {
                    uni.showToast({
                        title: '复制成功',
                        icon: 'success'
                    });
                }
            });
        },

        handleRemoveChild: function (e) {
            console.log('remove', e.detail.tempId);
            if (e.detail.tempId) {
                const newSendFileList = this.sendFileList.filter((item) => item.tempId !== e.detail.tempId);
                console.log('newSendFileList', newSendFileList);
                this.setData({
                    sendFileList: newSendFileList
                });
                if (newSendFileList.length === 0) {
                    this.setData({
                        showFileList: false
                    });
                }
            }
        },

        handleChangeChild: function (e) {
            console.log('change', e.detail);
            const { fileId, tempId } = e.detail;
            // const curFile = this.data.sendFileList.find(item => item.tempId === tempId)
            // curFile.fileId = fileId
            const newSendFileList = this.sendFileList.map((item) => {
                if (item.tempId === tempId) {
                    return {
                        ...item,
                        fileId
                    };
                }
                return item;
            });
            this.setData({
                sendFileList: newSendFileList
            });
        },

        handleClickTools: function () {
            if (this.showTools) {
                this.setData({
                    showTools: !this.showTools
                });
            } else {
                this.setData({
                    showTools: !this.showTools
                });
            }
        },

        handleClickWebSearch: function () {
            this.setData({
                useWebSearch: !this.useWebSearch
            });
        },

        share() {
            console.log('占位：函数 share 未声明');
        }
    },
    created: function () {}
};
</script>
<style>
/* components/agent-ui/index.wxss */
.agent-ui {
    width: 750rpx;
    height: 100vh;
    position: relative;
}

.nav {
    width: 750rpx;
    padding: 20px 0px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.share_btn {
    background-color: #fff;
    margin: 0px !important;
    padding: 0px !important;
    width: 36rpx !important;
    height: 36rpx;
}

.avatar {
    width: 150rpx;
    height: 150rpx;
    border-radius: 75rpx;
}

.questions {
    margin: 0px 16px 10px 16px;
}

.question_content {
    border: #f3f3f3 solid 1px;
    background-color: #fff;
    padding: 6px 12px;
    border-radius: 10px;
    display: inline-block;
    font-size: 28rpx;
    font-weight: 300;
}

.footer {
    width: 100%;
    min-height: 80px;
    max-height: 270px;
    /* background-color: aquamarine; */
    position: absolute;
    bottom: 0;
}

.foot-function {
    border: #f3f3f3 solid 1px;
    border-radius: 16px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    margin: 15px 16px;
    padding: 4px 8px;
    position: relative;
    background-color: white;
}

.footer .file_list {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
    padding: 0px 16px;
    overflow-x: scroll;
    height: 80px;
}

.img-box {
    position: absolute;
    top: -100px;
    left: 0px;
    white-space: nowrap;
    /* 防止内部元素换行 */
    width: 100%;
    /* 设置容器宽度 */
    background-color: #fff;
}

.img-preview {
    display: inline-block;
    width: 80px;
    height: 80px;
    margin-right: 8px;
    position: relative;
    margin-top: 10px;
}

.img-preview-image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
}

.img-preview-loading {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: #eee;
    border-radius: 10px;
}

.img-preview-close {
    width: 16px;
    height: 16px;
    position: absolute;
    right: -8px;
    top: -8px;
    /* background-color: blueviolet; */
}

.input_box {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    position: relative;
}

.set_panel_modal {
    position: fixed;
    width: 750rpx;
    height: 100vh;
    left: 0px;
    top: 0px;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
}

.set_panel {
    background-color: #f3f3f3;
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 750rpx;
}

.set_panel_funtion {
    display: flex;
    flex-direction: row;
    padding: 10px 16px;
    box-sizing: border-box;
    gap: 10px;
}

.set_panel_cancel {
    height: 60px;
    text-align: center;
    line-height: 40px;
    color: black;
    border-top: #cfcdcd solid 1px;
}

.function {
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background-color: #fff;
    color: black;
    padding: 0px 6px;
    border-radius: 6px;
}

.icon {
    width: 48rpx;
    height: 48rpx;
}

.text_desc {
    font-weight: 300;
    font-size: 24rpx;
}

.input {
    flex: 1;
    height: 40px;
    background-color: #fff;
    color: black;
}

.set {
    width: 48rpx;
    height: 48rpx;
}

.system {
    margin-left: 32rpx;
    margin-right: 32rpx;
    border-radius: 12rpx;
    margin-bottom: 16px;
    box-sizing: border-box;
}

.guide_system {
    padding-left: 32rpx;
    padding-right: 32rpx;
    border-radius: 12rpx;
    padding-bottom: 16px;
    box-sizing: border-box;
}

.bot_intro_system {
    padding-left: 32rpx;
    padding-right: 32rpx;
    border-radius: 12rpx;
    padding-bottom: 16px;
    box-sizing: border-box;
}

.user {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
}

.userContent .fileBar {
    display: flex;
    overflow-x: scroll;
    justify-content: flex-end;
    width: 100%;
}

.user view {
    background-color: #f3f3f3;
    border-radius: 12rpx;
    margin-left: 32rpx;
    margin-right: 32rpx;
    padding: 16rpx;
    word-wrap: break-word;
    word-break: break-all;
    font-size: 32rpx;
}

.feedback_modal {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 750rpx;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: #fff;
    width: 700rpx;
    border-radius: 16rpx;
    overflow: hidden;
}

.modal_head {
    height: 40px;
    line-height: 40px;
    padding: 0px 10px;
}

.modal_body {
    padding: 10px;
}

.modal_footer {
    display: flex;
}

.tool_box {
    height: 80px;
    display: flex;
    flex-direction: row;
    padding: 10px 16px;
    box-sizing: border-box;
    gap: 10px;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-x: scroll;
}

.tool_box .function {
    flex: 0 0 calc(25% - 20px);
}

.webSearchSwitch {
    width: 200rpx;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f3f3f3;
    border-radius: 50px;
    border: 1px solid rgb(76, 76, 76);
    font-size: 14px;
}

.feature_enable {
    background-color: rgb(219, 234, 254);
    color: rgb(77, 107, 254);
    border-color: rgba(0, 122, 255, 0.15);
}

.feature_list {
    margin: 0 16px;
}
</style>
